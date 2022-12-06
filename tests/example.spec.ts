import { test, expect } from '@playwright/test'

test('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {
  await page.goto(process.env.APP_URL || 'http://127.0.0.1:8082/')

  await page.click("text='Login'")
  await page.locator('input[id="username"]').type("guts@duke.edu")
  await page.locator('input[id="password"]').type("12345")
  await page.locator('input[id="kc-login"]').click()

  await page.click("text='Create a Post'")
  await page.locator('input[id="title-input"]').type("hello")
  await page.locator('textarea[id="content-input"]').type("I'm a dog")
  await page.click("text='Submit'")
  await page.locator("'text='hello''").click()
  await expect(page.locator('h2')).toHaveText("hello")
});
