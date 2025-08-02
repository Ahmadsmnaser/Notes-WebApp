import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// ✅ Unique test user to avoid duplication
const unique = Date.now();
const TEST_USER = {
  name: 'Test_User',
  email: `test${unique}@gmail.com`,
  username: `testuser_${unique}`,
  password: '12345678',
};

// ✅ Global timeout for all tests and hooks
test.describe.configure({ timeout: 20000 });

test.describe('Rich Notes XSS & Sanitizer', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    console.log('Navigating to create-user page...');
    await page.getByTestId('go_to_create_user_button').click();

    console.log('Filling form...');
    await page.getByTestId('create_user_form_name').fill(TEST_USER.name);
    await page.getByTestId('create_user_form_email').fill(TEST_USER.email);
    await page.getByTestId('create_user_form_username').fill(TEST_USER.username);
    await page.getByTestId('create_user_form_password').fill(TEST_USER.password);

    console.log('Submitting form...');
    await page.getByTestId('create_user_form_create_user').click();

    // ✅ No redirect — verify the form is still visible
    await expect(page.locator('text=Create New User')).toBeVisible();
    console.log('✅ User created manually, continuing...');

    await page.close();
  });

  const login = async (page) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.getByTestId('go_to_login_button').click();
    await page.getByTestId('login_form_username').fill(TEST_USER.username);
    await page.getByTestId('login_form_password').fill(TEST_USER.password);
    await page.getByTestId('login_form_login').click();

    await page.waitForSelector('[placeholder="Title"]', { timeout: 5000 });
  };

  test('Rich HTML note is rendered with <b> tag', async ({ page }) => {
    await login(page);

    await page.getByPlaceholder('Title').fill('Bold test');
    await page.getByPlaceholder('Content').fill('<b>This is bold</b>');
    await page.getByText('Create').click();

    await expect(page.locator('b', { hasText: 'This is bold' })).toBeVisible();
  });

  test('XSS payload triggers when sanitizer is OFF', async ({ page }) => {
    await login(page);

    await page.getByPlaceholder('Title').fill('XSS Note');
    await page.getByPlaceholder('Content').fill(
      `<img src="x" onerror="window.__xssWorked = true">`
    );
    await page.getByText('Create').click();

    await page.getByLabel('Sanitizer OFF').click();
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => (window as any).__xssWorked);
    expect(result).toBe(true);
  });

  test('Sanitizer blocks XSS payload when ON', async ({ page }) => {
    await login(page);

    await page.getByLabel('Sanitizer ON').click();
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => (window as any).__xssWorked);
    expect(result).not.toBe(true);
  });

  test('Can create and delete a note', async ({ page }) => {
    await login(page);

    await page.getByPlaceholder('Title').fill('Delete_me');
    await page.getByPlaceholder('Content').fill('Some note');
    await page.getByText('Create').click();

    const deleteButton = page.locator('button', { hasText: 'Delete' }).first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
  });
});
