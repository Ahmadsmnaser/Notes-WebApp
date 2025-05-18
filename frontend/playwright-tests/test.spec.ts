// frontend/playwright-tests/test.spec.ts
import { test, expect } from '@playwright/test';

test('Home page has expected title', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Notes/i);
});
