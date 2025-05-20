// tests/notes.spec.ts
import { test, expect, Page } from '@playwright/test';

const APP_URL = 'http://localhost:3000';

// Helper: locate a note by its test ID
function locateNoteById(page: Page, id: string) {
    return page.locator(`.note[data-testid="${id}"]`);
}

// Helper: wait for the notification area to display specific texta
async function waitForNotification(page: Page, expectedText: string) {
    const notification = page.locator('.notification');
    await notification.waitFor({ state: 'visible', timeout: 30000 });
    await expect(notification).toHaveText(expectedText, { timeout: 30000 });
}

// Helper: wait until at least one note is present
async function waitForNotes(page: Page) {
    await page.waitForSelector('.note', { timeout: 10000 });
}

// Runs before each test: navigate and ensure UI is ready
test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await waitForNotification(page, 'Notification area');
    await waitForNotes(page);
});

// 1) Read page: ensure existing notes are displayed
test('reads the page and shows existing notes', async ({ page }) => {
    test.setTimeout(10000);
    const notes = page.locator('.note');
    await expect(notes).toHaveCount(10);
    await waitForNotification(page, 'Notification area');
});

// 2) Create a new note
test('creates a new note and shows it at the top of the first page', async ({ page }) => {
    test.setTimeout(15000);

    // open add-new UI
    await page.click('button[name="add_new_note"]');

    const input = page.locator('input[name="text_input_new_note"]');
    await expect(input).toBeVisible();

    const newContent = 'Playwright test note - appears at top of first page';
    await input.fill(newContent);
    await page.click('button[name="text_input_save_new_note"]');

    // wait for notification
    await waitForNotification(page, 'Added a new note');

    // go to the first page
    const firstButton = page.locator('button[name="First"]');
    if (await firstButton.isVisible() && !(await firstButton.isDisabled())) {
        await firstButton.click();
        await waitForNotes(page);
    }

    // find the first note on the first page
    const firstNote = page.locator('.note').first();
    await expect(firstNote.locator('p.note-content')).toHaveText(newContent);
});

// 3) Edit an existing note
test('edits an existing note', async ({ page }) => {
    test.setTimeout(30000);

    const first = page.locator('.note').first();
    const noteId = await first.getAttribute('data-testid');
    if (!noteId) return;

    await page.click(`button[data-testid="edit-${noteId}"]`);
    const textarea = page.locator(`textarea[name="text_input-${noteId}"]`);
    await expect(textarea).toBeVisible();

    await expect(page.locator(`button[name="text_input_save-${noteId}"]`)).toBeVisible();
    await expect(page.locator(`button[name="text_input_cancel-${noteId}"]`)).toBeVisible();

    const updated = 'Updated by Playwright';
    await textarea.fill(updated);
    await page.click(`button[name="text_input_save-${noteId}"]`);

    await waitForNotification(page, 'Note updated');

    const updatedNote = locateNoteById(page, noteId).locator('p.note-content');
    await expect(updatedNote).toHaveText(updated, { timeout: 30000 });
});

// 4) Delete a note
test('deletes a note', async ({ page }) => {
    test.setTimeout(10000);
    const beforeCount = await page.locator('.note').count();
    const first = page.locator('.note').first();
    const noteId = await first.getAttribute('data-testid');
    if (!noteId) return;

    await page.click(`button[data-testid="delete-${noteId}"]`);
    await waitForNotification(page, 'Note deleted');
    await expect(page.locator('.note')).toHaveCount(beforeCount);
});