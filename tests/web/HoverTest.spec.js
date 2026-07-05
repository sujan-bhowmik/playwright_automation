const { test } = require('@playwright/test');

async function dismissCookie(page) {
  const allowAll = page.locator('//button[normalize-space()="Allow all"]');
  if (await allowAll.isVisible({ timeout: 5000 }).catch(() => false)) {
    await allowAll.click();
  }
}

test('menu hover', async ({ page }) => {
  const baseUrl = 'https://www.orangehrm.com/';
  await page.goto(baseUrl);
  await dismissCookie(page);

  const solutionsMenu = page.locator('//nav//a[normalize-space()="Solutions"]');
  await solutionsMenu.hover();
  const recruitmentMenu = page.locator('//a[contains(@href, "talent-management/recruitment")]').first();
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    recruitmentMenu.click(),
  ]);
  await dismissCookie(page);
  await page.goto(baseUrl);

  const whyMenu = page.locator('//nav//a[normalize-space()="Why OrangeHRM"]');
  await whyMenu.hover();
  const healthcareMenu = page.locator('//a[contains(@href, "hr-software-for-healthcare")]').first();
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    healthcareMenu.click(),
  ]);
  await dismissCookie(page);
  await page.goto(baseUrl);

  const resourcesMenu = page.locator('//nav//a[normalize-space()="Resources"]');
  await resourcesMenu.hover();
  const blogMenu = page.locator('//a[contains(@href, "resources/blog")]').first();
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    blogMenu.click(),
  ]);
  await dismissCookie(page);
});