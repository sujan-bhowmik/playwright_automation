const {test, expect} = require('@playwright/test');
const playwright = require('playwright');

test('Create PDF Test', async () => {
const browser = await playwright.chromium.launch({ headless: false, slowMo: 1000 });
const context = await browser.newContext();

const page = await context.newPage();
await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
await page.locator('xpath=//input[@placeholder="Username"]').fill('Admin');
await page.locator('xpath=//input[@placeholder="Password"]').fill('admin123');
await page.locator('xpath=//button[normalize-space()="Login"]').click();

await page.pdf({ path: 'output/document_' + Date.now() + '.pdf' });

await page.waitForTimeout(5000); // Wait for 5 seconds to ensure the video is recorded

await context.close();

});