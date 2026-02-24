import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Static Pages', () => {
  test('homepage loads and shows hero', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Rinse/);
    await expect(page.getByRole('heading', { name: /Premium Car Care/ })).toBeVisible();
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    // Check for the card title (rendered as div with specific class)
    await expect(page.locator('.text-2xl').filter({ hasText: 'Sign In' }).first()).toBeVisible();
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
  });

  test('register page loads', async ({ page }) => {
    await page.goto('/register');
    // Check for the card title
    await expect(page.locator('.text-2xl').filter({ hasText: 'Create Account' }).first()).toBeVisible();
    await expect(page.getByPlaceholder('John Doe')).toBeVisible();
  });

  test('search page loads', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByPlaceholder(/Enter location/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  });

  test('navbar is visible with logo', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'RINSE' })).toBeVisible();
  });

  test('footer is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('All rights reserved')).toBeVisible();
  });

  test('login link works from navbar', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('register link works from homepage CTA', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /get started/i }).first().click();
    await expect(page).toHaveURL(/\/register/);
  });
});
