const {test,expect}=require("@playwright/test");

test('Browser Context Test', async ({ browser,context }) => {

//Context1

const context1 = await browser.newContext();

const page1 = await context1.newPage();

await page1.goto('https://practicetestautomation.com/practice-test-login/');

await expect(page1).toHaveTitle(/Practice Test Automation/);


//context2
const context2 = await browser.newContext();

const page2 = await context2.newPage();

await  page2.goto('https://practicetestautomation.com/contact/');

await expect(page2).toHaveTitle(/Contact/);

await context1.close();
await context2.close();

});