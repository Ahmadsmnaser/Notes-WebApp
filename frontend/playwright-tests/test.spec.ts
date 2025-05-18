import { test, expect } from '@playwright/test';

test('homepage should have title', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Notes/i);
});

test('homepage should display welcome text', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const welcomeText = page.getByRole('heading', { name: 'Welcome to My Notes App' });
    await expect(welcomeText).toBeVisible({ timeout: 15000 });
});
