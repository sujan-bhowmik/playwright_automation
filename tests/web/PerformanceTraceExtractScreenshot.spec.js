const {test, expect} = require('@playwright/test');
const playwright = require('playwright');
const fs = require('fs');

test('Performance Trace Screenshot Extraction', async () => {

const browser = await playwright.chromium.launch({ headless: false, slowMo: 1000 });
const context = await browser.newContext();
const page = await context.newPage();

const tracePath = 'output/trace_' + Date.now() + '.json';
fs.mkdirSync('output', { recursive: true });
await browser.startTracing(page, { path: tracePath, screenshots: true, snapshots: true, categories: ['devtools.timeline', 'disabled-by-default-devtools.screenshot'] });

await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

await page.locator('xpath=//input[@placeholder="Username"]').fill('Admin');
await page.locator('xpath=//input[@placeholder="Password"]').fill('admin123');
await page.locator('xpath=//button[normalize-space()="Login"]').click();

await browser.stopTracing();

const traceInfo = JSON.parse(fs.readFileSync(tracePath, 'utf-8'));

const traceData = traceInfo.traceEvents.filter(event => 
  event.cat === 'disabled-by-default-devtools.screenshot' &&
  event.name === 'Screenshot' && 
  typeof event.args !== 'undefined' &&
  typeof event.args.snapshot !== 'undefined'   

);

for (const screenshotEvent of traceData) {
    const screenshotBase64 = screenshotEvent.args.snapshot;
    const screenshotBuffer = Buffer.from(screenshotBase64, 'base64');
    const screenshotPath = `output/screenshot_${screenshotEvent.ts}.png`;
    fs.writeFileSync(screenshotPath, screenshotBuffer);
    console.log(`Screenshot saved: ${screenshotPath}`);
}


await browser.close();
}); 

