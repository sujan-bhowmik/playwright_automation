// tests/mobile/helpers/gestures.js
// Reusable touch gestures. Two approaches are shown on purpose:
//
//  A) "mobile:" commands — driver-specific shortcuts (fast, reliable).
//     Android/UiAutomator2:  mobile: swipeGesture, scrollGesture, longClickGesture...
//     iOS/XCUITest:          mobile: swipe, scroll, touchAndHold...
//
//  B) W3C Actions API — raw pointer moves, works on BOTH platforms.
//     You describe a finger: press down -> move -> lift up.

/** Get screen size, used to compute swipe coordinates. */
async function screenSize(driver) {
  const { width, height } = await driver.getWindowRect();
  return { width, height };
}

/**
 * Approach B: cross-platform swipe from one point to another (W3C Actions).
 */
async function swipeByCoordinates(driver, from, to, durationMs = 600) {
  await driver.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: from.x, y: from.y },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 100 },
        { type: 'pointerMove', duration: durationMs, x: to.x, y: to.y },
        { type: 'pointerUp', button: 0 },
      ],
    },
  ]);
  await driver.releaseActions();
}

/** Swipe up = scroll DOWN the content (finger moves up). */
async function swipeUp(driver) {
  const { width, height } = await screenSize(driver);
  await swipeByCoordinates(
    driver,
    { x: width / 2, y: height * 0.75 },
    { x: width / 2, y: height * 0.25 }
  );
}

/** Swipe down = scroll UP the content. */
async function swipeDown(driver) {
  const { width, height } = await screenSize(driver);
  await swipeByCoordinates(
    driver,
    { x: width / 2, y: height * 0.25 },
    { x: width / 2, y: height * 0.75 }
  );
}

/**
 * Approach A (Android): native scroll gesture — smoother than raw swipes.
 * direction: 'up' | 'down' | 'left' | 'right' (direction content moves TO view).
 */
async function androidScroll(driver, direction = 'down', percent = 0.8) {
  const { width, height } = await screenSize(driver);
  await driver.execute('mobile: scrollGesture', {
    left: width * 0.1,
    top: height * 0.2,
    width: width * 0.8,
    height: height * 0.6,
    direction,
    percent,
  });
}

/**
 * Android-only power move: scroll until an element with given text is visible,
 * using a UiAutomator UiScrollable expression. No loop needed — UiAutomator
 * keeps scrolling internally until it finds the text.
 */
async function androidScrollToText(driver, text) {
  return driver.$(
    `android=new UiScrollable(new UiSelector().scrollable(true))` +
      `.scrollIntoView(new UiSelector().textContains("${text}"))`
  );
}

/** Cross-platform "scroll until element is displayed", max N swipes. */
async function scrollUntilVisible(driver, element, maxSwipes = 5) {
  for (let i = 0; i < maxSwipes; i++) {
    if (await element.isDisplayed().catch(() => false)) return true;
    await swipeUp(driver);
  }
  return element.isDisplayed();
}

/** Long press on an element (Android native gesture, with W3C fallback). */
async function longPress(driver, element, ms = 1500) {
  if (driver.isAndroid) {
    await driver.execute('mobile: longClickGesture', {
      elementId: element.elementId,
      duration: ms,
    });
  } else {
    // iOS
    await driver.execute('mobile: touchAndHold', {
      elementId: element.elementId,
      duration: ms / 1000,
    });
  }
}

module.exports = {
  screenSize,
  swipeByCoordinates,
  swipeUp,
  swipeDown,
  androidScroll,
  androidScrollToText,
  scrollUntilVisible,
  longPress,
};
