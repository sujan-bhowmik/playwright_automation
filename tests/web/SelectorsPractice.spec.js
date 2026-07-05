import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://example.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await expect(page.locator('h1')).toHaveText('Example Domain');
});