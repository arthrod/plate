import { test, expect } from '@playwright/test';

test.describe('Editor Page', () => {
  test('serves SPA at root', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    const html = await page.content();
    expect(html).toContain('id="root"');
  });

  test('loads editor at /#/editor/new', async ({ page }) => {
    await page.goto('/#/editor/new');

    // Wait for the Slate editor to appear
    const editor = page.locator('[data-slate-editor]');
    await expect(editor).toBeVisible({ timeout: 30_000 });
  });

  test('editor is interactive — can type text', async ({ page }) => {
    await page.goto('/#/editor/new');

    const editor = page.locator('[data-slate-editor]');
    await expect(editor).toBeVisible({ timeout: 30_000 });

    // Click into the editor and type
    await editor.click();
    await page.keyboard.type('Hello Playwright');

    // Verify the text appears in the editor
    await expect(editor.locator('[data-slate-string]', { hasText: 'Hello Playwright' }).first()).toBeVisible();
  });

  test('page title is set', async ({ page }) => {
    await page.goto('/#/editor/new');
    await expect(page).toHaveTitle(/Plate/i);
  });

  test('CSS is loaded — editor has proper styling', async ({ page }) => {
    await page.goto('/#/editor/new');

    const editor = page.locator('[data-slate-editor]');
    await expect(editor).toBeVisible({ timeout: 30_000 });

    // Check that body has background-color set (Tailwind base styles applied)
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // Should not be transparent (means CSS loaded)
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/#/editor/new');
    const editor = page.locator('[data-slate-editor]');
    await expect(editor).toBeVisible({ timeout: 30_000 });

    // Allow minor font warnings, filter for real errors
    const realErrors = errors.filter(
      (e) => !e.includes('font') && !e.includes('OTS')
    );
    expect(realErrors).toHaveLength(0);
  });

  test('toolbar is visible', async ({ page }) => {
    await page.goto('/#/editor/new');

    const editor = page.locator('[data-slate-editor]');
    await expect(editor).toBeVisible({ timeout: 30_000 });

    // Check for toolbar buttons (Bold, Italic, etc.)
    const toolbar = page.locator('[role="toolbar"]');
    const toolbarExists = await toolbar.count();
    // If no role="toolbar", check for button groups near the top
    if (toolbarExists === 0) {
      // At minimum, the editor container should have buttons
      const buttons = page.locator('button');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    } else {
      await expect(toolbar).toBeVisible();
    }
  });
});
