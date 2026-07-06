const {test, expect} = require('@playwright/test');
const playwright = require('playwright');

test('File Upload', async () => {
  const browser = await playwright.firefox.launch({headless: false, slowMo: 1000});
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://uppy.io/examples/'),{waitUntil: 'domcontentloaded', timeout: 30000};
    page.click('//button[normalize-space()="browse files"]');
    const handle = await page.$('input[type="file"]');
    await handle.setInputFiles('C:/Users/bides/Documents/playwright/output/test.txt');
    const filePath = 'C:/Users/bides/Documents/playwright/output/test.txt';

    page.click('//button[@aria-label="Upload 1 file"]');

    await page.waitForSelector('text=Upload complete', { timeout: 10000 }); 

});