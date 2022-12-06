import { test, expect } from '@playwright/test'

test('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {
  await page.goto(process.env.APP_URL || 'http://127.0.0.1:8099/')

  await page.locator('input[name="userId"]').selectText()
  await page.locator('input[name="userId"]').type("alice")
  await page.click("text='Login'")
  await expect(page.locator('h1')).toHaveText("Hello, alice")

  await page.locator('input[name="userId"]').selectText()
  await page.locator('input[name="userId"]').type("bob")
  await page.click("text='Login'")
  await expect(page.locator('h1')).toHaveText("Hello, bob")
});
