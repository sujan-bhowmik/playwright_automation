import { test, expect } from '@playwright/test';

test('test', async ({ browser }) => {
  
  // Create context with slow motion
  const context = await browser.newContext({
    slowMo: 5000,        // 1000ms = 1 second delay between actions
  });

  const page = await context.newPage();

  await page.goto('https://practicetestautomation.com/practice-test-login/');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('student');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Password123');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('link', { name: 'Log out' }).click();

  await context.close();
});