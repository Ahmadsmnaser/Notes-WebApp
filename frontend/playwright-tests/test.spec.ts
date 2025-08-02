import { test, expect } from '@playwright/test';

const login = async (page) => {
  await page.goto('http://localhost:3000/');
  await page.getByTestId('go_to_login_button').click();
  await page.getByTestId('login_form_username').fill('s');
  await page.getByTestId('login_form_password').fill('m');
  await page.getByTestId('login_form_login').click();
};

async function deleteNoteByTitle(page, title: string) {
  const note = await page.locator('.card.note', { has: page.getByText(title) }).first();
  const testId = await note.getAttribute('data-testid');
  if (testId) {
    await page.getByTestId(`delete-${testId}`).click();
    // Optionally: wait for it to disappear
    await expect(page.getByTestId(testId)).toHaveCount(0);
  }
  
}


test.describe('Rich Notes XSS & Sanitizer', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('XSS payload triggers when sanitizer is OFF', async ({ page }) => {
   // await page.getByLabel('Sanitizer OFF').check();
    await page.getByRole('radio', { name: 'Sanitizer OFF' }).check();

   await page.getByPlaceholder('Title').fill('XSS Test');
    await page.getByPlaceholder('Content').fill(`<img src=x onerror="alert('XSS');" />`);
    await page.getByRole('button', { name: 'Create' }).click();

    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('XSS');
      await dialog.dismiss();
    });

    await page.waitForTimeout(1000);

    // 🧹 Clean up
    await deleteNoteByTitle(page, 'XSS Test');
  });

  test('Sanitizer blocks XSS when ON', async ({ page }) => {
    // await page.getByLabel('Sanitizer ON').check();
    await page.getByRole('radio', { name: 'Sanitizer ON' }).check();

    await page.getByPlaceholder('Title').fill('XSS Blocked');
    await page.getByPlaceholder('Content').fill(`<img src=x onerror="alert('SHOULD NOT RUN');" />`);
    await page.getByRole('button', { name: 'Create' }).click();

    let alertTriggered = false;
    page.on('dialog', async dialog => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    await page.waitForTimeout(1000);
    expect(alertTriggered).toBeFalsy();

    // 🧹 Clean up
    await deleteNoteByTitle(page, 'XSS Blocked');
  });
});
