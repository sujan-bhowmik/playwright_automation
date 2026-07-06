# Mobile Automation with Playwright + Appium — Learning Guide

A from-scratch guide for this project. Read top to bottom once, then use it as a reference.

---

## 1. How Playwright and Appium fit together

Playwright **cannot** automate native mobile apps by itself — it drives browsers. Appium **can** drive apps, but has no test runner. So we combine them:

```
Your spec file (test, expect, fixtures, HTML report)   <- Playwright Test = RUNNER
        |
   driver fixture (tests/mobile/helpers/driver.js)
        |
   webdriverio remote()  --- HTTP (WebDriver protocol) --->  Appium server :4723
                                                                  |
                                                    UiAutomator2 driver (Android)
                                                    XCUITest driver (iOS)
                                                                  |
                                                          Emulator / real device
```

Every command in a test (`click()`, `setValue()`, `getText()`) becomes an HTTP request to the Appium server, which translates it into native automation calls on the device.

Why this combo is nice: you keep one runner, one report, and one CI setup for web (pure Playwright) **and** mobile (Appium) tests.

## 2. One-time machine setup (Windows)

### 2.1 Node.js
Already have it if Playwright works. Verify: `node -v` (need 18+).

### 2.2 Java JDK 17
UiAutomator2 needs Java. Install [Temurin JDK 17](https://adoptium.net/), then set the environment variable `JAVA_HOME` to the JDK folder (e.g. `C:\Program Files\Eclipse Adoptium\jdk-17...`) and add `%JAVA_HOME%\bin` to `Path`. Verify: `java -version`.

### 2.3 Android Studio + SDK
1. Install [Android Studio](https://developer.android.com/studio).
2. Set env var `ANDROID_HOME` to `C:\Users\bides\AppData\Local\Android\Sdk`.
3. Add to `Path`: `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\emulator`.
4. Verify in a NEW terminal: `adb --version`.

### 2.4 Create an emulator (AVD)
Android Studio → **Device Manager** → **Create device** → pick *Pixel 7* → pick a recent system image (API 34) → Finish. Start it with the ▶ button, or from a terminal:

```
emulator -list-avds
emulator -avd Pixel_7_API_34
```

Verify it's visible: `adb devices` → should list `emulator-5554  device`.

### 2.5 Appium 2 + Android driver

```
npm install -g appium
appium driver install uiautomator2
appium driver list --installed
```

Optional but recommended health check:

```
npm install -g @appium/doctor
appium-doctor --android
```

Fix anything red before continuing.

### 2.6 The sample app
Download the Sauce Labs "Swag Labs" demo apk from
https://github.com/saucelabs/sample-app-mobile/releases
(file: `Android.SauceLabs.Mobile.Sample.app.X.X.X.apk`).
Create an `apps/` folder in this project and save it as `apps/swaglabs-android.apk`. (Or set the `ANDROID_APP` env var to any path.)

### 2.7 Appium Inspector (your element-finding tool)
Download from https://github.com/appium/appium-inspector/releases. This is the mobile equivalent of browser DevTools — see §7.

### 2.8 Project dependencies

```
npm install
```

## 3. Running your first test

Three terminals:

```
# Terminal 1 — emulator (skip if already running via Android Studio)
emulator -avd Pixel_7_API_34

# Terminal 2 — Appium server
appium

# Terminal 3 — the tests
npx playwright test tests/mobile/specs/01-first-test.spec.js
npx playwright show-report
```

Run everything: `npm run test:mobile`. Target iOS later with `npm run test:mobile:ios` (Mac required).

## 4. Project tour

```
playwright.config.js          runner config; the "mobile" project points at tests/mobile/specs
tests/mobile/
  config/                     capabilities = "what device, what app, which driver"
    android.caps.js
    ios.caps.js
  helpers/
    driver.js                 Playwright fixture that opens/closes the Appium session
    gestures.js               swipe/scroll/long-press implementations (3 techniques)
  screens/                    Screen Objects (Page Object Model for mobile)
    login.screen.js  products.screen.js  cart.screen.js  checkout.screen.js
  specs/                      the numbered lessons — read them in order
    01-first-test.spec.js     launch + wait + screenshot
    02-locators.spec.js       every locator strategy
    03-login.spec.js          typing, tapping, assertions, Screen Objects
    04-gestures.spec.js       swipe, scroll, long press (3 ways)
    05-e2e-checkout.spec.js   real user journey with test.step()
    06-app-lifecycle.spec.js  background, kill/relaunch, deep links, rotation
apps/                         put swaglabs-android.apk here (you create this)
```

The key idea in `driver.js`: we extend Playwright's `test` with a `driver` fixture, exactly like Playwright's built-in `page`. Fresh Appium session per test = full isolation.

## 5. Scenario reference (every technique, with examples)

### 5.1 Capabilities — describing the session
See `config/android.caps.js` (commented line by line). The three you always need: `platformName`, `appium:automationName`, `appium:app`. Useful extras: `appium:noReset` (keep app data between sessions — faster but less isolated), `appium:autoGrantPermissions` (no permission popups), `appium:fullReset` (uninstall + reinstall every time — slowest, cleanest).

### 5.2 Locators — finding elements
Covered hands-on in `02-locators.spec.js`. Ranking:

| Strategy | Syntax | When |
|---|---|---|
| Accessibility ID | `$('~test-Username')` | **Always first choice.** Cross-platform, fast. Android `content-desc`, iOS `accessibilityIdentifier`. |
| Resource ID | `$('id=com.app:id/loginBtn')` | Android apps with proper resource-ids. |
| UiAutomator | `$('android=new UiSelector().text("LOGIN")')` | Android: match by text/desc/index/scrollable. |
| iOS predicate | `$('-ios predicate string:label == "LOGIN"')` | iOS: match by label/name/type. |
| iOS class chain | `$('-ios class chain:**/XCUIElementTypeButton[1]')` | iOS: hierarchy walks (faster than XPath). |
| Class name | `$('android.widget.EditText')` | Grabbing all widgets of a type (`$$`). |
| XPath | `$('//android.widget.TextView[@text="X"]')` | Last resort. Slow, breaks when the UI tree shifts. |

If your own app lacks accessibility ids, the single highest-ROI request you can make to developers is: *add testID / contentDescription / accessibilityIdentifier to interactive elements.*

### 5.3 Waiting — the #1 cause of flaky mobile tests
Mobile apps render slowly and unevenly. Never assume an element is ready.

```js
await el.waitForDisplayed({ timeout: 20000 });        // visible
await el.waitForDisplayed({ reverse: true });          // gone
await el.waitForEnabled();                             // clickable
await el.waitForExist();                               // in tree (maybe off-screen)

// arbitrary condition:
await driver.waitUntil(async () => (await el.getText()) === 'READY', {
  timeout: 15000, timeoutMsg: 'never became READY',
});
```

Never use fixed sleeps (`driver.pause(5000)`) except while debugging. Avoid implicit waits (`driver.setTimeout({ implicit: ... })`) — explicit waits at the point of use are predictable; implicit ones hide problems.

### 5.4 Text input & keyboard

```js
await el.setValue('hello');     // clears then types
await el.addValue(' world');    // appends
await el.clearValue();
if (await driver.isKeyboardShown()) await driver.hideKeyboard(); // keyboard covers buttons!
```

The `hideKeyboard()` step matters: on small screens the soft keyboard often covers the button you're about to tap. See `login.screen.js`.

### 5.5 Taps and gestures
`04-gestures.spec.js` + `helpers/gestures.js` show all three techniques:

Simple tap: `await el.click();` — covers 95% of cases.

W3C Actions (cross-platform, raw finger): press at (x1,y1) → move to (x2,y2) → lift. Used in `swipeByCoordinates()`. Also how you do multi-finger gestures (pinch = two pointers moving apart).

`mobile:` commands (driver shortcuts, Android examples):

```js
await driver.execute('mobile: swipeGesture',    { left, top, width, height, direction: 'up', percent: 0.75 });
await driver.execute('mobile: scrollGesture',   { ...same, direction: 'down', percent: 0.8 });
await driver.execute('mobile: longClickGesture',{ elementId: el.elementId, duration: 1500 });
await driver.execute('mobile: doubleClickGesture', { elementId: el.elementId });
await driver.execute('mobile: pinchOpenGesture',   { elementId: el.elementId, percent: 0.75 });
await driver.execute('mobile: dragGesture', { elementId: el.elementId, endX: 500, endY: 1200 });
```

iOS equivalents: `mobile: swipe`, `mobile: scroll`, `mobile: touchAndHold`, `mobile: pinch`, `mobile: dragFromToForDuration`.

UiScrollable (Android): "keep scrolling until found" in one locator — see `androidScrollToText()` in gestures.js. No loops needed.

### 5.6 Alerts & permissions

```js
// System dialogs (permissions, alerts):
await driver.getAlertText();
await driver.acceptAlert();
await driver.dismissAlert();
```

Better: prevent permission popups entirely with `appium:autoGrantPermissions: true` (Android) / `appium:autoAcceptAlerts: true` (iOS) — already set in our caps.

### 5.7 App lifecycle
`06-app-lifecycle.spec.js` demonstrates:

```js
await driver.background(3);                    // home button for 3s, then return
await driver.terminateApp('com.pkg');          // force kill
await driver.activateApp('com.pkg');           // (re)launch
await driver.queryAppState('com.pkg');         // 0 unknown, 1 not running, 3 background, 4 foreground
await driver.installApp('/path/app.apk');
await driver.removeApp('com.pkg');
await driver.isAppInstalled('com.pkg');
```

Classic real scenario: fill half a form → background the app → return → assert the data survived.

### 5.8 Deep links — the biggest speed trick

```js
await driver.execute('mobile: deepLink', {
  url: 'swaglabs://swag-item/4',
  package: 'com.swaglabsmobileapp',
});
```

Instead of login → scroll → tap → tap to reach a screen, jump straight to it. A suite of 50 tests that each save 30 seconds of navigation is 25 minutes faster. Ask your developers what URL schemes the app registers.

### 5.9 Device interaction

```js
await driver.setOrientation('LANDSCAPE');
await driver.pressKeyCode(4);                         // Android BACK
await driver.pressKeyCode(66);                        // ENTER
await driver.execute('mobile: shell', { command: 'settings', args: ['put', ...] }); // adb (needs server flag)
await driver.setGeoLocation({ latitude: 22.57, longitude: 88.36, altitude: 0 });    // fake GPS
```

### 5.10 Hybrid apps & WebViews
If a screen of the app is actually an embedded browser (WebView), switch context and use normal web selectors:

```js
const contexts = await driver.getContexts();   // ['NATIVE_APP', 'WEBVIEW_com.pkg']
await driver.switchContext(contexts[1]);       // now CSS selectors work!
await driver.$('button#submit').click();
await driver.switchContext('NATIVE_APP');      // back to native
```

(The Swag Labs app is fully native, so there's no runnable demo spec — try this on any app with an in-app browser. Chromedriver must match the WebView version; `appium:chromedriverAutodownload: true` helps.)

### 5.11 Screenshots, video, reporting
Screenshots: `driver.takeScreenshot()` returns base64 → attach to the Playwright report with `testInfo.attach()` (done automatically on failure by our fixture, and manually in `01-first-test.spec.js`). Video: record with `driver.startRecordingScreen()` / `stopRecordingScreen()` (base64 mp4), or on the emulator via `adb shell screenrecord`.

### 5.12 Real device instead of emulator
Enable Developer Options → USB debugging on the phone, plug it in, `adb devices` to get its id, then:

```
set ANDROID_DEVICE_NAME=R58M12ABCDE   (the id from adb devices)
npm run test:mobile
```

Nothing else changes — that's the point of capabilities being config, not code.

### 5.13 iOS
Requires macOS + Xcode. Then: `appium driver install xcuitest`, put the simulator `.app` build in `apps/`, and run `PLATFORM=ios npx playwright test --project=mobile`. Our locators use accessibility ids wherever possible, so most tests run unchanged; Android-only tests skip themselves via `test.skip(platform !== 'android')`.

## 6. Waiting vs. Playwright auto-waiting — an honest warning

Playwright's `expect(locator).toBeVisible()` auto-retrying magic works only on Playwright locators (web). Appium elements are plain objects, so:

```js
// WEB (Playwright):    await expect(page.locator('#x')).toBeVisible();   // retries automatically
// MOBILE (Appium):     await el.waitForDisplayed();                       // you wait explicitly,
//                      expect(await el.isDisplayed()).toBe(true);         // then assert the value
```

Forgetting this is the most common mistake when web automation engineers move to mobile.

## 7. Appium Inspector — finding locators

1. Start the Appium server (`appium`).
2. Open Appium Inspector, set Remote host `127.0.0.1`, port `4723`.
3. Paste the JSON from `android.caps.js` into Desired Capabilities (as JSON: `{"platformName": "Android", "appium:automationName": "UiAutomator2", ...}`).
4. Start Session → you get a live screenshot; click any element to see its attributes (`content-desc`, `resource-id`, `text`, `class`) and suggested locators.

This is how you'll find locators for *your own* app.

## 8. Common errors and fixes

| Error | Fix |
|---|---|
| `ECONNREFUSED 127.0.0.1:4723` | Appium server isn't running — `appium` in a terminal. |
| `Could not find a connected Android device` | Emulator not booted / `adb devices` empty. Try `adb kill-server && adb start-server`. |
| `The desired capabilities must include platformName` | Typo in caps, or missing `appium:` prefix on non-standard caps. |
| `An element could not be located` | Wrong locator, or you didn't wait. Verify in Appium Inspector. |
| `App file does not exist` | apk path wrong — check `apps/swaglabs-android.apk` or `ANDROID_APP`. |
| `JAVA_HOME is not set` | §2.2. Open a NEW terminal after setting env vars. |
| Session dies mid-test after idling | Increase `appium:newCommandTimeout`. |
| Element found but click does nothing | Keyboard covering it (`hideKeyboard()`), or element not yet enabled (`waitForEnabled`). |
| Works locally, flaky in CI | Slower machine: raise timeouts; boot emulator with `-no-snapshot -no-window`. |

## 9. Suggested learning path

Run the specs in order (01 → 06), reading each file's header comment first. Then: open Appium Inspector and explore the Swag Labs app yourself; write a new test for the app's sorting dropdown or the swipeable image gallery on the item page; then swap in your own company's apk and build its first Screen Object. After that you know 90% of what daily mobile automation work requires.
