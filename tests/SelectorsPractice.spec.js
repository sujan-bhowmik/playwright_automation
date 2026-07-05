import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://eaapp.somee.com/');
  await page.getByRole('link', { name: '👥 Employees' }).click();
  await page.getByRole('link', { name: '📋 Details' }).first().click();
});