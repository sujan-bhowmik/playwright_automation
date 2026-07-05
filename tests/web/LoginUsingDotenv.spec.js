import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'config/.env'), override: true });

test('Login Test using dotenv', async ({ page }) => {
  const baseUrl = process.env.BASE_URL ?? 'https://practicetestautomation.com';
  const username = process.env.USERNAME ?? 'student';
  const password = process.env.PASSWORD ?? 'Password123';

  console.log('BASE_URL →', baseUrl);
  console.log('USERNAME →', username);
  console.log('PASSWORD →', password ? '***' : undefined);

  await page.goto(`${baseUrl}/practice-test-login/`, { waitUntil: 'domcontentloaded' });

  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);

  await page.getByRole('button', { name: 'Submit' }).click();

  // Wait for the logout button to confirm a successful login
  await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible({ timeout: 10000 });

  console.log('✅ Login Test Passed Successfully!');
});