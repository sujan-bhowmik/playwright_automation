const {test, expect} = require('@playwright/test');
const { chromium,devices } = require('playwright');


test('Page Emulation Test', async () => {

const iPhone = devices['iPhone 13 Pro'];
  const browser = await chromium.launch({
  headless: false,
  slowMo: 1000,
  channel: 'chrome'
});
const context = await browser.newContext({
  ...iPhone,
  recordVideo: { dir: 'output/videos/' }
});
const page = await context.newPage();
await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
await page.locator('xpath=//input[@placeholder="Username"]').fill('Admin');
await page.locator('xpath=//input[@placeholder="Password"]').fill('admin123');
await page.locator('xpath=//button[normalize-space()="Login"]').click();  
await context.close();  // required to save the video
await browser.close();

});








