import { test, expect } from '@playwright/test';

const USER = {
  username: 's',
  password: 'm',
};

test.describe('Basic Rich Notes Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/', { timeout: 20000 }); // 10s timeout
  });

  test('Login with valid credentials', async ({ page }) => {
    await page.getByTestId('go_to_login_button').click();
    await page.getByTestId('login_form_username').fill(USER.username);
    await page.getByTestId('login_form_password').fill(USER.password);
    await page.getByTestId('login_form_login').click();

    await page.waitForURL('**/', { timeout: 20000 });
    await expect(page.getByTestId('logout')).toBeVisible({ timeout: 20000 });
  });

  test('Create a note with <b> HTML and verify it renders', async ({ page }) => {
    await page.getByTestId('go_to_login_button').click();
    await page.getByTestId('login_form_username').fill(USER.username);
    await page.getByTestId('login_form_password').fill(USER.password);
    await page.getByTestId('login_form_login').click();
    await page.waitForURL('**/');

    const uniqueTitle = `Bold Test ${Date.now()}`;
    const uniqueContent = '<b>This is bold XYZ123</b>';

    await page.getByPlaceholder('Title').fill(uniqueTitle);
    await page.getByPlaceholder('Content').fill(uniqueContent);
    await page.getByRole('button', { name: 'Create' }).click();

    const noteCard = page.locator('.card.note', { hasText: uniqueTitle }).first();
    await expect(noteCard).toBeVisible({ timeout: 20000 });

    const boldElement = noteCard.locator('b', { hasText: 'This is bold XYZ123' });
    await expect(boldElement).toBeVisible({ timeout: 20000 });
  });
});
