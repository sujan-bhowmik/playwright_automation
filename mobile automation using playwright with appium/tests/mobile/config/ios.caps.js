// tests/mobile/config/ios.caps.js
// iOS equivalent of android.caps.js.
// NOTE: iOS automation requires a Mac with Xcode. Kept here so the framework
// is platform-ready — run with:  PLATFORM=ios npx playwright test --project=mobile

const path = require('path');

module.exports = {
  platformName: 'iOS',

  // XCUITest is the standard iOS driver:  appium driver install xcuitest
  'appium:automationName': 'XCUITest',

  // Simulator name exactly as shown in Xcode > Devices and Simulators.
  'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 15',
  'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '17.0',

  // .app (simulator build) or .ipa (real device).
  'appium:app':
    process.env.IOS_APP || path.resolve(__dirname, '../../../apps/swaglabs-ios.app'),

  // Auto-accept iOS permission alerts ("Allow notifications?" etc.).
  'appium:autoAcceptAlerts': true,

  'appium:newCommandTimeout': 240,
};
