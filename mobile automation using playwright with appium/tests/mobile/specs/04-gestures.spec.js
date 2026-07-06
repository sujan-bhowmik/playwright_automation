// SCENARIO 4 — Gestures: swipe, scroll, long press
// ------------------------------------------------
// Gestures are what make mobile different from web. Three techniques:
//   A) W3C Actions API      — raw finger movements, cross-platform
//   B) mobile: commands     — driver shortcuts (swipeGesture, scrollGesture...)
//   C) UiScrollable         — Android auto-scroll-until-found
// All three are implemented in helpers/gestures.js — read it side by side.

const { test, expect } = require('../helpers/driver');
const LoginScreen = require('../screens/login.screen');
const ProductsScreen = require('../screens/products.screen');
const {
  swipeUp,
  swipeDown,
  androidScroll,
  androidScrollToText,
  scrollUntilVisible,
  longPress,
} = require('../helpers/gestures');

test.describe('04 - Gestures', () => {
  test.beforeEach(async ({ driver }) => {
    const login = new LoginScreen(driver);
    await login.waitForScreen();
    await login.login('standard_user', 'secret_sauce');
    await new ProductsScreen(driver).waitForScreen();
  });

  test('A) swipe up/down with W3C actions', async ({ driver }) => {
    // Scroll down the product list, then back up.
    await swipeUp(driver);
    await swipeUp(driver);
    await swipeDown(driver);
    // No assertion needed to learn the mechanics, but let's add one:
    expect(await driver.$('~test-PRODUCTS').isDisplayed()).toBe(true);
  });

  test('B) native scrollGesture (Android mobile: command)', async ({ driver, platform }) => {
    test.skip(platform !== 'android', 'Android-only demo');
    await androidScroll(driver, 'down'); // scroll content down
    await androidScroll(driver, 'up');   // and back
  });

  test('C) UiScrollable — scroll until a product is found', async ({ driver, platform }) => {
    test.skip(platform !== 'android', 'Android-only demo');
    // "Test.allTheThings() T-Shirt" is the last product — off-screen initially.
    const item = await androidScrollToText(driver, 'Test.allTheThings()');
    expect(await item.isDisplayed()).toBe(true);
  });

  test('generic scrollUntilVisible helper (cross-platform)', async ({ driver }) => {
    const lastItem = driver.$(
      'android=new UiSelector().textContains("Test.allTheThings()")'
    );
    const found = await scrollUntilVisible(driver, lastItem, 6);
    expect(found).toBe(true);
  });

  test('long press on an element', async ({ driver }) => {
    const firstTitle = await driver.$$('~test-Item title')[0];
    await firstTitle.waitForDisplayed();
    await longPress(driver, firstTitle, 1500);
    // Swag Labs has no long-press action; this just proves the gesture fires
    // without error. In your own app, assert on the context menu that opens.
  });

  test('tap by coordinates (when no element exists)', async ({ driver }) => {
    // Rarely needed (games, canvas, maps). Prefer element clicks!
    const { width, height } = await driver.getWindowRect();
    await driver
      .action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ x: Math.round(width / 2), y: Math.round(height / 2) })
      .down()
      .up()
      .perform();
  });
});
