const { test } = require('@playwright/test');

test('menu hover', async ({ page }) => {
  await page.goto('https://www.orangehrm.com/');

  const allowAll = page.locator('//button[normalize-space()="Allow all"]');
  if (await allowAll.isVisible({ timeout: 5000 }).catch(() => false)) {
    await allowAll.click();
  }

  const solutionsMenu = page.locator('//nav//a[normalize-space()="Solutions"]');
  await solutionsMenu.hover();
  const recruitmentMenu = page.locator('//a[contains(@href, "talent-management/recruitment")]').first();
  await recruitmentMenu.hover();
  await recruitmentMenu.click();
  await page.waitForTimeout(3000);
  await page.goBack();

  const whyMenu = page.locator('//nav//a[normalize-space()="Why OrangeHRM"]');
  await whyMenu.hover();
  const healthcareMenu = page.locator('//a[contains(@href, "hr-software-for-healthcare")]').first();
  await healthcareMenu.hover();
  await healthcareMenu.click();
  await page.waitForTimeout(3000);
  await page.goBack();

  const resourcesMenu = page.locator('//nav//a[normalize-space()="Resources"]');
  await resourcesMenu.hover();
  const blogMenu = page.locator('//a[contains(@href, "resources/blog")]').first();
  await blogMenu.hover();
  await blogMenu.click();
  await page.waitForTimeout(3000);
});