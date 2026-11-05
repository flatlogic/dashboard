const { test, expect } = require('@playwright/test');

test('production login and dashboard render without missing templates or assets', async ({ page }) => {
  const errors = [];
  const missing = [];
  page.on('console', message => { if (message.type() === 'error') console.error(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:4322/')) {
      missing.push(response.url());
      console.error("Missing asset", response.url());
    }
  });
  await page.goto('/#/login');
  await page.getByPlaceholder('Username').fill('demo');
  await page.getByPlaceholder('Password').fill('demo');
  await page.getByRole('button', { name: 'Log In', exact: true }).click();
  await expect(page).toHaveURL(/#\/app\/dashboard/);
  await expect(page.locator('.qor-app')).toBeVisible();
  await expect(page.locator('[qor-sidebar]')).toBeVisible();
  await page.locator('[qor-sidebar-group-heading="Domains"]').click();
  await expect(page).toHaveURL(/#\/app\/domains/);
  await expect(page.locator('.list-group-item').first()).toBeVisible();
  expect(missing).toEqual([]);
  expect(errors).toEqual([]);
});
