// SCENARIO 5 — Full end-to-end user journey
// -----------------------------------------
// Login -> add product to cart -> cart -> checkout form -> finish.
// This is what a real regression test looks like: multiple screen objects
// chained together, asserting at each step. Uses test.step() so the
// Playwright HTML report shows a beautiful step-by-step breakdown.

const { test, expect } = require('../helpers/driver');
const LoginScreen = require('../screens/login.screen');
const ProductsScreen = require('../screens/products.screen');
const CartScreen = require('../screens/cart.screen');
const CheckoutScreen = require('../screens/checkout.screen');

test.describe('05 - E2E checkout journey', () => {
  test('buy a backpack from login to order confirmation', async ({ driver }) => {
    const login = new LoginScreen(driver);
    const products = new ProductsScreen(driver);
    const cart = new CartScreen(driver);
    const checkout = new CheckoutScreen(driver);

    await test.step('log in', async () => {
      await login.waitForScreen();
      await login.login('standard_user', 'secret_sauce');
      await products.waitForScreen();
    });

    await test.step('add first product to cart', async () => {
      await products.addFirstItemToCart();
      // The cart badge should now show "1".
      const badgeText = await driver
        .$('~test-Cart')
        .$('//android.widget.TextView')
        .getText();
      expect(badgeText).toBe('1');
    });

    await test.step('open cart and verify item', async () => {
      await products.openCart();
      await cart.waitForScreen();
      expect(await cart.itemCount()).toBe(1);
    });

    await test.step('fill checkout information', async () => {
      await cart.checkout();
      await checkout.fillAddress({ first: 'Sujan', last: 'Bhowmik', zip: '700001' });
    });

    await test.step('finish order and verify confirmation', async () => {
      await checkout.finish();
      await checkout.completeScreen.waitForDisplayed();
      expect(await checkout.completeScreen.isDisplayed()).toBe(true);
    });
  });
});
