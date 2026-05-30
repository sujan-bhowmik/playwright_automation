import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Login Test using dotenv', async ({ page }) => {
  
  console.log('BASE_URL →', process.env.BASE_URL);
  console.log('USERNAME →', process.env.USERNAME);
  console.log('PASSWORD →', process.env.PASSWORD);

  await page.goto(process.env.BASE_URL + '/practice-test-login/');

  await page.getByRole('textbox', { name: 'Username' }).fill(process.env.USERNAME || 'student');
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.PASSWORD || 'Password123');

  await page.getByRole('button', { name: 'Submit' }).click();

  // === Better Assertions (More Reliable) ===
  
  // Wait for successful login page
  await expect(page).toHaveURL(/.*logged-in-successfully.*/);
  
  // Check success message
  await expect(page.locator('h1')).toContainText('Congratulations');
  
  // Check Log out button
  await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible({ timeout: 10000 });

  console.log('✅ Login Test Passed Successfully!');
});