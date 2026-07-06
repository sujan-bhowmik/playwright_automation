// SCENARIO 6 — App lifecycle, deep links, device interaction
// ----------------------------------------------------------
// Real-world scenarios beyond tapping buttons:
//   - backgrounding/foregrounding the app (does state survive?)
//   - deep links (jump straight to a screen — huge time saver)
//   - device rotation
//   - reading device state (battery, network, activity)

const { test, expect } = require('../helpers/driver');
const LoginScreen = require('../screens/login.screen');

const APP_PACKAGE = 'com.swaglabsmobileapp'; // Android package of the sample app

test.describe('06 - App lifecycle & device interaction', () => {
  test.beforeEach(async ({ driver }) => {
    await new LoginScreen(driver).waitForScreen();
  });

  test('background the app for 3s, then come back', async ({ driver }) => {
    // Simulates: user presses Home, checks WhatsApp, returns.
    await driver.background(3); // seconds; app auto-reactivates after

    // The login screen should still be there (state preserved).
    expect(await driver.$('~test-Username').isDisplayed()).toBe(true);
  });

  test('terminate and relaunch the app', async ({ driver, platform }) => {
    test.skip(platform !== 'android', 'package id is Android-specific');

    await driver.terminateApp(APP_PACKAGE); // force-kill
    const state = await driver.queryAppState(APP_PACKAGE);
    expect(state).toBe(1); // 1 = not running

    await driver.activateApp(APP_PACKAGE); // relaunch
    await driver.$('~test-Username').waitForDisplayed({ timeout: 20000 });
  });

  test('open a screen directly via deep link', async ({ driver, platform }) => {
    test.skip(platform !== 'android', 'deep link demo written for Android');

    // Swag Labs registers the swaglabs:// scheme. Jump straight to item #4
    // without logging in or tapping through the catalog:
    await driver.execute('mobile: deepLink', {
      url: 'swaglabs://swag-item/4',
      package: APP_PACKAGE,
    });

    // We land on a product details page.
    await driver.$('~test-Description').waitForDisplayed({ timeout: 15000 });
    // Why this matters: deep links let each test START at the screen under
    // test instead of re-walking the whole navigation — much faster suites.
  });

  test('rotate the device', async ({ driver }) => {
    await driver.setOrientation('LANDSCAPE');
    expect(await driver.getOrientation()).toBe('LANDSCAPE');

    // App should still be usable after rotation.
    expect(await driver.$('~test-Username').isDisplayed()).toBe(true);

    await driver.setOrientation('PORTRAIT');
  });

  test('read device info', async ({ driver, platform }) => {
    test.skip(platform !== 'android', 'Android-only commands');

    const activity = await driver.getCurrentActivity();
    const pkg = await driver.getCurrentPackage();
    const battery = await driver.execute('mobile: batteryInfo');

    console.log({ activity, pkg, battery });
    expect(pkg).toBe(APP_PACKAGE);
  });

  test('send the app a text via adb-style key events', async ({ driver, platform }) => {
    test.skip(platform !== 'android', 'keycodes are Android-only');

    await driver.$('~test-Username').click();
    // Android keycodes: 29 = 'a', 30 = 'b' ... (KEYCODE_A etc.)
    await driver.pressKeyCode(29);
    await driver.pressKeyCode(30);
    expect(await driver.$('~test-Username').getText()).toBe('ab');
  });
});
