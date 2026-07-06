// tests/mobile/screens/checkout.screen.js
// Covers both checkout steps of the Swag Labs sample app:
// address form -> overview -> finish.

const { scrollUntilVisible } = require('../helpers/gestures');

class CheckoutScreen {
  constructor(driver) {
    this.driver = driver;
  }

  // Step 1: address form
  get firstName() { return this.driver.$('~test-First Name'); }
  get lastName() { return this.driver.$('~test-Last Name'); }
  get zip() { return this.driver.$('~test-Zip/Postal Code'); }
  get continueButton() { return this.driver.$('~test-CONTINUE'); }

  // Step 2: overview
  get finishButton() { return this.driver.$('~test-FINISH'); }

  // Step 3: confirmation
  get completeScreen() { return this.driver.$('~test-CHECKOUT: COMPLETE!'); }

  async fillAddress({ first, last, zip }) {
    await this.firstName.waitForDisplayed();
    await this.firstName.setValue(first);
    await this.lastName.setValue(last);
    await this.zip.setValue(zip);
    if (await this.driver.isKeyboardShown()) {
      await this.driver.hideKeyboard();
    }
    await this.continueButton.click();
  }

  async finish() {
    // FINISH is at the bottom of a long overview page -> scroll to it.
    await scrollUntilVisible(this.driver, await this.finishButton);
    await this.finishButton.click();
  }
}

module.exports = CheckoutScreen;
