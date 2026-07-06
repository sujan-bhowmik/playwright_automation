// playwright.config.js
// Playwright is used ONLY as the test runner here (test structure, fixtures,
// assertions, HTML report). The actual mobile driving is done by Appium,
// which our tests talk to through webdriverio (see tests/mobile/helpers/driver.js).

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  // Mobile tests are slow: app install + boot can take a while.
  timeout: 180_000,
  expect: { timeout: 15_000 },

  // One emulator = one test at a time. Never parallelize against a single device.
  workers: 1,
  fullyParallel: false,

  reporter: [['list'], ['html', { open: 'never' }]],

  projects: [
    {
      // All Appium/mobile specs live in tests/mobile (project convention).
      name: 'mobile',
      testDir: './tests/mobile/specs',
    },
    // Later you can add a normal Playwright web project here, e.g.:
    // { name: 'web', testDir: './tests/web', use: { ...devices['Desktop Chrome'] } },
  ],
});
