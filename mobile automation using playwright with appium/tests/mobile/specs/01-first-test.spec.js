// SCENARIO 1 — Your very first mobile test
// ----------------------------------------
// Goal: launch the app on the emulator and prove the login screen is there.
//
// What happens under the hood when this runs:
//   1. Playwright starts the test and asks for the `driver` fixture.
//   2. The fixture (helpers/driver.js) opens a session on the Appium server.
//   3. Appium installs + launches the .apk on the emulator.
//   4. Your commands travel: test -> webdriverio -> Appium -> UiAutomator2 -> app.
//   5. After the test, the fixture deletes the session (app closes).
//
// Run it:
//   Terminal 1: start your emulator
//   Terminal 2: appium
//   Terminal 3: npx playwright test tests/mobile/specs/01-first-test.spec.js

const { test, expect } = require('../helpers/driver');

test.describe('01 - First mobile test', () => {
  test('app launches and shows the login screen', async ({ driver }) => {
    // Find an element by ACCESSIBILITY ID (the '~' prefix).
    const username = driver.$('~test-Username');

    // Mobile golden rule: always WAIT before interacting.
    await username.waitForDisplayed({ timeout: 20000 });

    // Playwright's expect works on any value, incl. Appium results.
    expect(await username.isDisplayed()).toBe(true);

    // Bonus: grab some session info to see who you're talking to.
    console.log('Platform:', driver.capabilities.platformName);
    console.log('Device:', driver.capabilities.deviceName);
  });

  test('take a screenshot and attach it to the report', async ({ driver }, testInfo) => {
    await driver.$('~test-Username').waitForDisplayed({ timeout: 20000 });

    const png = await driver.takeScreenshot(); // base64 string
    await testInfo.attach('login-screen', {
      body: Buffer.from(png, 'base64'),
      contentType: 'image/png',
    });
    // Open `npx playwright show-report` after the run to see it.
  });
});
