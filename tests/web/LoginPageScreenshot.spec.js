const { test, expect } = require('@playwright/test');
const playwright = require('playwright');

test('login Page Screenshot', async () => {
  const browser = await playwright.firefox.launch({headless: false, slowMo: 1000});

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: `orange_${Date.now()}.png` });
  await browser.close();
}); 
