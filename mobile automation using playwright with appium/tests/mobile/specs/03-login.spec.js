// SCENARIO 3 — Typing, tapping, assertions + Screen Object pattern
// ----------------------------------------------------------------
// A classic login suite: happy path, wrong password, empty form.
// Notice how thin the tests are — all locators/actions live in
// screens/login.screen.js. That's the Screen Object (Page Object) pattern.
//
// Sample app credentials:
//   valid:      standard_user / secret_sauce
//   locked out: locked_out_user / secret_sauce

const { test, expect } = require('../helpers/driver');
const LoginScreen = require('../screens/login.screen');
const ProductsScreen = require('../screens/products.screen');

test.describe('03 - Login', () => {
  let login, products;

  test.beforeEach(async ({ driver }) => {
    login = new LoginScreen(driver);
    products = new ProductsScreen(driver);
    await login.waitForScreen();
  });

  test('valid credentials land on the products page', async ({ driver }) => {
    await login.login('standard_user', 'secret_sauce');
    await products.waitForScreen();
    expect(await products.screen.isDisplayed()).toBe(true);
  });

  test('wrong password shows an error message', async () => {
    await login.login('standard_user', 'wrong_password');
    const error = await login.getErrorText();
    expect(error).toContain('Username and password do not match');
  });

  test('locked out user cannot log in', async () => {
    await login.login('locked_out_user', 'secret_sauce');
    const error = await login.getErrorText();
    expect(error).toContain('locked out');
  });

  test('empty username shows a required-field error', async ({ driver }) => {
    // Tap login without typing anything.
    await login.loginButton.click();
    const error = await login.getErrorText();
    expect(error).toContain('Username is required');
  });

  test('clearing a field', async () => {
    await login.username.setValue('typo_user');
    await login.username.clearValue(); // clear + retype is a common pattern
    await login.username.setValue('standard_user');
    expect(await login.username.getText()).toBe('standard_user');
  });
});
