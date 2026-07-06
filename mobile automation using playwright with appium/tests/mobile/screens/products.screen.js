// tests/mobile/screens/products.screen.js
// The product catalog shown after login in the Swag Labs sample app.

const { scrollUntilVisible } = require('../helpers/gestures');

class ProductsScreen {
  constructor(driver) {
    this.driver = driver;
  }

  get title() {
    // Locator by visible text — platform-specific, shown for teaching purposes.
    return this.driver.isAndroid
      ? this.driver.$('android=new UiSelector().text("PRODUCTS")')
      : this.driver.$('-ios predicate string:label == "PRODUCTS"');
  }

  get screen() { return this.driver.$('~test-PRODUCTS'); }
  get cartBadge() { return this.driver.$('~test-Cart'); }
  get menuButton() { return this.driver.$('~test-Menu'); }
  get firstAddToCart() { return this.driver.$('~test-ADD TO CART'); }

  itemByIndex(i) {
    // All product cards share the same accessibility id -> use $$ (plural).
    return this.driver.$$('~test-Item')[i];
  }

  async waitForScreen() {
    await this.screen.waitForDisplayed({ timeout: 20000 });
  }

  async addFirstItemToCart() {
    await this.firstAddToCart.waitForDisplayed();
    await this.firstAddToCart.click();
  }

  async addItemToCartByName(name) {
    // Find the ADD TO CART button belonging to a specific product via XPath:
    // "the button that follows the title with this text". Fragile but
    // demonstrates relative XPath — see GUIDE.md locator section.
    const btn = this.driver.$(
      `//android.widget.TextView[@text="${name}"]` +
        `/ancestor::android.view.ViewGroup[@content-desc="test-Item"]` +
        `//android.view.ViewGroup[@content-desc="test-ADD TO CART"]`
    );
    await scrollUntilVisible(this.driver, btn);
    await btn.click();
  }

  async openCart() {
    await this.cartBadge.click();
  }
}

module.exports = ProductsScreen;
