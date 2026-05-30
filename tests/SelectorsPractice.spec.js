import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://eaapp.somee.com/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'User Name' }).click();
  await page.getByRole('textbox', { name: 'User Name' }).fill('admin1');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('@dMin123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: '👥 Employees' }).click();
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('link', { name: '📋 Details' }).nth(1).click();
  await page.getByRole('link', { name: '📈 PF Contribution' }).nth(2).click();
  await page.getByRole('heading', { name: 'Alice Nguyen' }).click();
  await page.getByRole('link', { name: '📈 Details' }).click();
  await page.getByRole('link', { name: '🏢 Company Contribution' }).nth(2).click();
  await page.getByRole('link', { name: '← Back to Employee Details' }).click();
  await page.getByText('📊 66 employees').click();
  await page.getByRole('link', { name: 'Hello admin1!' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();
});