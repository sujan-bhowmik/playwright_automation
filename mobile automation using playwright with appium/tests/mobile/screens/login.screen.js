// tests/mobile/screens/login.screen.js
// SCREEN OBJECT = Page Object Model for mobile.
// One class per app screen: locators + user actions live here,
// specs stay short and readable.
//
// Locator syntax used below (webdriverio):
//   $('~foo')  ->  "accessibility id" = foo
// In the Swag Labs sample app every element has an accessibility id
// like "test-Username" (Android content-desc / iOS accessibilityIdentifier).
// Accessibility id is THE preferred mobile locator: fast + cross-platform.

class LoginScreen {
  constructor(driver) {
    this.driver = driver;
  }

  // Getters so the element is looked up fresh each time (no stale elements).
  get username() { return this.driver.$('~test-Username'); }
  get password() { return this.driver.$('~test-Password'); }
  get loginButton() { return this.driver.$('~test-LOGIN'); }
  get errorMessage() { return this.driver.$('~test-Error message'); }

  async waitForScreen() {
    await this.username.waitForDisplayed({ timeout: 20000 });
  }

  async login(user, pass) {
    await this.username.setValue(user);
    await this.password.setValue(pass);

    // Keyboard can cover the button on small screens — hide it first.
    if (await this.driver.isKeyboardShown()) {
      await this.driver.hideKeyboard();
    }
    await this.loginButton.click();
  }

  async getErrorText() {
    await this.errorMessage.waitForDisplayed();
    // The visible text sits in a child Text element.
    const child = await this.errorMessage.$('//android.widget.TextView');
    return child.getText();
  }
}

module.exports = LoginScreen;
