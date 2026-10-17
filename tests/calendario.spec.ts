import { test, expect } from '@playwright/test';

test.describe('Holiday Calendar E2E Tests', () => {

  test('should load the homepage and list clean province slugs in the select', async ({ page }) => {
    await page.goto('/');

    const selectProvincia = page.locator('select#provincia');
    await expect(selectProvincia).toBeVisible();

    const options = await selectProvincia.locator('option').all();
    expect(options.length).toBeGreaterThan(50);

    for (const option of options) {
      const val = await option.getAttribute('value');
      // The value should be clean (e.g., '0: madrid' in Angular form or clean slug)
      // and must never contain .htm or raw URL fragments
      expect(val).not.toContain('.htm');
      expect(val).not.toContain('calendarios-laborales');
    }
  });

  test('should search and navigate to Madrid calendar via form', async ({ page }) => {
    // Listen for failed responses to ensure /api doesn't fail
    const failedApiResponses: string[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/') && response.status() >= 400) {
        failedApiResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/');

    // Select province Madrid
    await page.selectOption('select#provincia', { label: 'Madrid' });

    // Submit search form
    await page.getByRole('button', { name: 'Buscar' }).click();

    // Verify URL navigation
    await expect(page).toHaveURL(/\/festivos\/madrid\/\d{4}/);

    // Verify error page was NOT displayed
    await expect(page.locator('app-error')).toHaveCount(0);

    // Verify annual calendar header and title
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Madrid');

    // Verify calendar months are rendered
    const calendars = page.locator('app-calendar');
    await expect(calendars).toHaveCount(12);

    expect(failedApiResponses).toEqual([]);
  });

  test('should navigate to province via quick links section', async ({ page }) => {
    const failedApiResponses: string[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/') && response.status() >= 400) {
        failedApiResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/');

    // Click on Barcelona quick link in home section
    const barcelonaLink = page.locator('app-home').getByRole('link', { name: 'Barcelona', exact: true });
    await expect(barcelonaLink).toBeVisible();
    await barcelonaLink.click();

    await expect(page).toHaveURL(/\/festivos\/barcelona\/\d{4}/);
    await expect(page.locator('app-error')).toHaveCount(0);

    const heading = page.locator('h1');
    await expect(heading).toContainText('Barcelona');

    const calendars = page.locator('app-calendar');
    await expect(calendars).toHaveCount(12);

    expect(failedApiResponses).toEqual([]);
  });

  test('should correctly render holidays for mapped provinces (e.g. Álava)', async ({ page }) => {
    const failedApiResponses: string[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/') && response.status() >= 400) {
        failedApiResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/festivos/alava/2026');

    await expect(page).toHaveURL('/festivos/alava/2026');
    await expect(page.locator('app-error')).toHaveCount(0);

    const heading = page.locator('h1');
    await expect(heading).toContainText('Alava');

    const calendars = page.locator('app-calendar');
    await expect(calendars).toHaveCount(12);

    expect(failedApiResponses).toEqual([]);
  });

  test('should support legacy dirty slug in API without throwing 404', async ({ request }) => {
    const response = await request.get('/api/festivos/calendarios-laborales-2026-provincia-de-madrid.htm/2026');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.enero).toBeDefined();
    expect(Array.isArray(data.enero)).toBe(true);
    expect(data.mayo).toBeDefined();
  });

});
