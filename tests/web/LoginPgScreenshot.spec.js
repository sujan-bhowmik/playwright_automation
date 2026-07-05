const { test } = require('@playwright/test');

test('login Page Screenshot', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: `screenshots/orange_${Date.now()}.png` });
});