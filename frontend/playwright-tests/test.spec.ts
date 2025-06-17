import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

const timestamp = Date.now();
const testUser = {
  name: 'Test User',
  email: `test+${timestamp}@example.com`,
  username: `testuser${timestamp}`,
  password: 'test1234',
};

test.describe('Full HW3 Frontend Flow', () => {
  test('1. Create user → Login → Add, edit, delete note → Logout', async ({ page }) => {
    await page.goto(BASE_URL);

    // Create user
    await page.getByTestId('go_to_create_user_button').click();
    await expect(page).toHaveURL(/\/create-user/);
    await page.getByTestId('create_user_form_name').fill(testUser.name);
    await page.getByTestId('create_user_form_email').fill(testUser.email);
    await page.getByTestId('create_user_form_username').fill(testUser.username);
    await page.getByTestId('create_user_form_password').fill(testUser.password);
    await page.getByTestId('create_user_form_create_user').click();
    // No redirect occurs

    // Login
    await page.getByTestId('go_to_login_button').click();
    await expect(page).toHaveURL(/\/login/);
    await page.getByTestId('login_form_username').fill(testUser.username);
    await page.getByTestId('login_form_password').fill(testUser.password);
    await page.getByTestId('login_form_login').click();
    await expect(page.getByTestId('logout')).toBeVisible();

    // Add note
    const noteTitle = `Test Note ${timestamp}`;
    const noteContent = `Test content ${timestamp}`;
    await page.locator('input[placeholder="Title"]').fill(noteTitle);
    await page.locator('textarea[placeholder="Content"]').fill(noteContent);
    await page.locator('button', { hasText: 'Create' }).click();
    const note = page.locator('.note', { hasText: noteTitle });
    await expect(note).toContainText(noteContent);

    // Edit note
    const updatedTitle = `Updated Title ${timestamp}`;
    const updatedContent = `Updated content ${timestamp}`;
    await note.getByRole('button', { name: 'Edit' }).click();
    await page.getByPlaceholder('Title').fill(updatedTitle);
    await page.getByPlaceholder('Content').fill(updatedContent);
    await page.getByRole('button', { name: 'Save' }).click();

    const updatedNote = page.locator('.note', { hasText: updatedTitle });
    await expect(updatedNote).toContainText(updatedContent);

    // Delete note
    await updatedNote.getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator('.note', { hasText: updatedTitle })).toHaveCount(0, { timeout: 10000 });

    // Logout
    await page.getByTestId('logout').click();
    await expect(page.getByTestId('go_to_login_button')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Create' })).toHaveCount(0);
  });
});
