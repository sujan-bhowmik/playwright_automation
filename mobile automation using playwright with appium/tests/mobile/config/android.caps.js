// tests/mobile/config/android.caps.js
// "Capabilities" tell the Appium server WHAT to automate and HOW.
// Anything prefixed "appium:" is an Appium-specific (non-W3C-standard) capability.

const path = require('path');

module.exports = {
  // Which OS — Appium routes the session to the matching driver.
  platformName: 'Android',

  // The Appium driver to use. UiAutomator2 is the standard Android driver.
  // Install once with:  appium driver install uiautomator2
  'appium:automationName': 'UiAutomator2',

  // Emulator/device id from `adb devices`. First emulator is usually emulator-5554.
  'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'emulator-5554',

  // Path to the .apk. Appium installs it automatically at session start.
  // Download the sample app (Sauce Labs "Swag Labs") — see GUIDE.md step 6.
  'appium:app':
    process.env.ANDROID_APP ||
    path.resolve(__dirname, '../../../apps/swaglabs-android.apk'),

  // The sample app opens through a splash activity; '*' means
  // "wait for ANY activity to appear" instead of one exact activity name.
  'appium:appWaitActivity': '*',

  // Auto-accept Android permission popups (camera, location...) at install.
  'appium:autoGrantPermissions': true,

  // Keep the session alive for up to 4 min between commands
  // (useful when you pause on a debugger breakpoint).
  'appium:newCommandTimeout': 240,

  // Uncomment to keep the app + its data between tests (faster, less isolated):
  // 'appium:noReset': true,

  // Uncomment to pin an OS version if you run several emulators:
  // 'appium:platformVersion': '14',
};
