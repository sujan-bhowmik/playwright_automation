# Playwright + Appium Mobile Automation

Playwright Test as the runner, Appium (via webdriverio) as the mobile driver. All mobile tests live in `tests/mobile/`.

**New here? Read [GUIDE.md](./GUIDE.md)** — full setup + explanation of every scenario.

## Quickstart

```bash
npm install                       # project deps
npm install -g appium             # once
appium driver install uiautomator2   # once
# download the sample apk (GUIDE.md §2.6) into apps/swaglabs-android.apk

# 3 terminals:
emulator -avd Pixel_7_API_34      # 1: emulator
appium                            # 2: appium server
npm run test:mobile               # 3: tests
npx playwright show-report
```

## Lessons (tests/mobile/specs/)

| Spec | Teaches |
|---|---|
| 01-first-test | launching the app, waiting, screenshots |
| 02-locators | every locator strategy |
| 03-login | typing, tapping, assertions, Screen Objects |
| 04-gestures | swipe/scroll/long-press, 3 techniques |
| 05-e2e-checkout | full user journey with test.step() |
| 06-app-lifecycle | background/kill/relaunch, deep links, rotation |

Env vars: `PLATFORM=android|ios`, `ANDROID_DEVICE_NAME`, `ANDROID_APP`, `APPIUM_HOST`, `APPIUM_PORT`.
