const {test, expect} = require('@playwright/test');
const playwright = require('playwright');

test('All Browser Screenshots', async () => {

    for (const browserType of ['chromium', 'firefox', 'webkit']) {
        const browser = await playwright[browserType].launch({ headless: false, slowMo: 1000 });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await page.locator('//input[@placeholder="Username"]').waitFor();
        await page.screenshot({ path: `output/${browserType}_orange_${Date.now()}.png` });
        await page.close();
        await browser.close();
    }


});