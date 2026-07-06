// SCENARIO 2 — Locator strategies (how to FIND elements)
// -------------------------------------------------------
// The #1 skill in mobile automation. Ranked from best to worst:
//
//   1. Accessibility ID   $('~test-Username')        cross-platform, fast   <- USE THIS
//   2. Resource/Element ID $('id=com.app:id/login')  Android resource-id
//   3. UiAutomator        $('android=new UiSelector()...')  Android-only, powerful
//   4. iOS Predicate      $('-ios predicate string:...')    iOS-only, powerful
//   5. Class name         $('android.widget.EditText')      too generic alone
//   6. XPath              $('//android.widget...')   slowest, most brittle - last resort
//
// Explore your app's element tree with Appium Inspector (see GUIDE.md §7).

const { test, expect } = require('../helpers/driver');

test.describe('02 - Locator strategies', () => {
  test.beforeEach(async ({ driver }) => {
    await driver.$('~test-Username').waitForDisplayed({ timeout: 20000 });
  });

  test('1. accessibility id — the preferred way', async ({ driver }) => {
    // Android: content-desc attribute. iOS: accessibilityIdentifier.
    // Same locator works on BOTH platforms if devs set matching ids.
    const el = driver.$('~test-Username');
    expect(await el.isDisplayed()).toBe(true);
  });

  test('2. class name — find by widget type', async ({ driver }) => {
    // All EditText inputs on screen. $$ returns a list.
    const inputs = await driver.$$('android.widget.EditText');
    expect(inputs.length).toBe(2); // username + password
  });

  test('3. UiAutomator selector — Android superpowers', async ({ driver }) => {
    // Full UiSelector API: match by text, description, index, scrollable...
    const byText = driver.$('android=new UiSelector().text("LOGIN")');
    expect(await byText.isDisplayed()).toBe(true);

    const byDescContains = driver.$(
      'android=new UiSelector().descriptionContains("test-User")'
    );
    expect(await byDescContains.isDisplayed()).toBe(true);
  });

  test('4. XPath — last resort, but sometimes needed', async ({ driver }) => {
    // Match by any attribute combination / hierarchy.
    const el = driver.$('//android.widget.EditText[@content-desc="test-Username"]');
    expect(await el.isDisplayed()).toBe(true);

    // Relative XPath: "the EditText right after the Username one".
    const password = driver.$(
      '//android.widget.EditText[@content-desc="test-Username"]' +
        '/following::android.widget.EditText[1]'
    );
    expect(await password.isDisplayed()).toBe(true);
  });

  test('5. reading element attributes', async ({ driver }) => {
    const username = driver.$('~test-Username');

    // Common inspection commands:
    console.log('text:', await username.getText());
    console.log('enabled:', await username.isEnabled());
    console.log('location:', await username.getLocation()); // {x, y}
    console.log('size:', await username.getSize()); // {width, height}
    console.log('class:', await username.getAttribute('className'));

    expect(await username.isEnabled()).toBe(true);
  });
});
