import { test, expect } from '@playwright/test';

test('homepage should have title', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Vite/i);
});

test('homepage should display welcome text', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const welcomeText = 'Welcome to My Notes App';

    await expect(page.getByText(welcomeText)).toBeVisible({ timeout: 10000 });
});
