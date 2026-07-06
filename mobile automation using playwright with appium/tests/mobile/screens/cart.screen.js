// tests/mobile/screens/cart.screen.js

class CartScreen {
  constructor(driver) {
    this.driver = driver;
  }

  get screen() { return this.driver.$('~test-Cart Content'); }
  get checkoutButton() { return this.driver.$('~test-CHECKOUT'); }
  get itemTitles() { return this.driver.$$('~test-Item title'); }
  get removeButton() { return this.driver.$('~test-REMOVE'); }

  async waitForScreen() {
    await this.screen.waitForDisplayed({ timeout: 15000 });
  }

  async itemCount() {
    const items = await this.itemTitles;
    return items.length;
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}

module.exports = CartScreen;
