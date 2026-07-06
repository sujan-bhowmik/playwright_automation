// tests/mobile/helpers/driver.js
// THE BRIDGE between Playwright and Appium.
//
// How it works:
//   1. Playwright Test provides the runner: test(), fixtures, expect, reports.
//   2. We extend Playwright's `test` with a custom fixture called `driver`.
//   3. The fixture uses webdriverio's remote() to open a session against the
//      Appium server (http://127.0.0.1:4723) before each test, hands the
//      driver to the test, and deletes the session afterwards.
//
// So in every spec you just write:
//   const { test, expect } = require('../helpers/driver');
//   test('my test', async ({ driver }) => { ... });
// and you get a fresh app launch per test — same mental model as
// Playwright's `page` fixture.

const base = require('@playwright/test');
const { remote } = require('webdriverio');
const androidCaps = require('../config/android.caps');
const iosCaps = require('../config/ios.caps');

const PLATFORM = (process.env.PLATFORM || 'android').toLowerCase();

const test = base.test.extend({
  // Which platform this run targets — handy for platform-specific branches.
  platform: [PLATFORM, { option: true }],

  // The Appium session (a webdriverio "browser" object driving the app).
  driver: async ({ platform }, use, testInfo) => {
    const driver = await remote({
      hostname: process.env.APPIUM_HOST || '127.0.0.1',
      port: Number(process.env.APPIUM_PORT || 4723),
      logLevel: 'warn',
      capabilities: platform === 'ios' ? iosCaps : androidCaps,
    });

    try {
      await use(driver); // <-- the test body runs here
    } finally {
      // Attach a screenshot to the Playwright HTML report if the test failed.
      if (testInfo.status !== testInfo.expectedStatus) {
        try {
          const png = await driver.takeScreenshot();
          await testInfo.attach('failure-screenshot', {
            body: Buffer.from(png, 'base64'),
            contentType: 'image/png',
          });
        } catch (_) { /* session may already be dead */ }
      }
      await driver.deleteSession(); // closes app + session
    }
  },
});

module.exports = { test, expect: base.expect, PLATFORM };
