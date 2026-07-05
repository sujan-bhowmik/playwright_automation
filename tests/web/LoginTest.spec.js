const {test, expect} = require('@playwright/test');
const playwright = require('playwright');

test('Hover Test', async () => {
  const browser = await playwright.chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();
await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

//await page.getByRole('button', { name: 'Login' })
await page.locator('xpath=//input[@placeholder="Username"]').fill('Admin');

await page.locator('xpath=//input[@placeholder="Password"]').fill('admin123');

await page.locator('xpath=//button[normalize-space()="Login"]').click();



  await browser.close();
});