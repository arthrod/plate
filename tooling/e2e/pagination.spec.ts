import { expect, test } from '@playwright/test';

// ============================================================
// E2E: @platejs/pagination continuous-view overlay
//
// Locks in the user-visible behavior the pagination dogfood pass surfaced:
// advisory break lines render on load, page labels include the real total, and
// the overlay remains non-interactive so native editing is untouched.
// ============================================================

const ROUTE = process.env.PLAYWRIGHT_BASE_URL
  ? new URL('/dev/pagination2', process.env.PLAYWRIGHT_BASE_URL).toString()
  : '/dev/pagination2';
const CONTENT_PER_PAGE = 931; // 1123 - 96 - 96

const BREAK_LINE = '[data-slot="pagination-break-line"]';
const PAGE_MARKER = '[data-slot="pagination-page-marker"]';
const LABEL = '[data-slot="pagination-break-label"]';
const CONTAINER = '[data-slot="pagination-break-lines"]';

/** Read the explicit inline `top` (px) of an absolutely-positioned overlay node. */
const topOf = (handle: {
  evaluate: <R>(fn: (el: HTMLElement | SVGElement) => R) => Promise<R>;
}) => handle.evaluate((el) => Number.parseFloat((el as HTMLElement).style.top));

test.describe('pagination continuous-view overlay', () => {
  test('advisory break lines render on load', async ({ page }) => {
    await page.goto(ROUTE);

    await expect(page.locator(BREAK_LINE).first()).toBeVisible();
    expect(await page.locator(BREAK_LINE).count()).toBeGreaterThan(0);
  });

  test('renders a "Page 1 of N" marker and consistent "Page K of N" labels', async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.locator(BREAK_LINE).first()).toBeVisible();

    const breakCount = await page.locator(BREAK_LINE).count();
    const total = breakCount + 1;

    await expect(page.locator(`${PAGE_MARKER} ${LABEL}`)).toHaveText(
      `Page 1 of ${total}`
    );

    const labels = await page.locator(`${BREAK_LINE} ${LABEL}`).allInnerTexts();
    expect(labels).toEqual(
      Array.from({ length: breakCount }, (_, i) => `Page ${i + 2} of ${total}`)
    );
  });

  test('break lines sit on the A4 boundary without accumulating drift', async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.locator(BREAK_LINE).first()).toBeVisible();

    const markerTop = await topOf(page.locator(PAGE_MARKER));
    const lines = page.locator(BREAK_LINE);
    const count = await lines.count();
    expect(count).toBeGreaterThan(1);

    let prev = markerTop;
    for (let i = 0; i < count; i++) {
      const top = await topOf(lines.nth(i));
      const fromOrigin = top - markerTop;
      const expectedBoundary = (i + 1) * CONTENT_PER_PAGE;

      expect(fromOrigin).toBeLessThanOrEqual(expectedBoundary + 30);

      const gap = top - prev;
      expect(gap).toBeLessThanOrEqual(CONTENT_PER_PAGE + 30);
      expect(gap).toBeGreaterThanOrEqual(CONTENT_PER_PAGE - 250);
      prev = top;
    }
  });

  test('page labels stay on-screen on a viewport narrower than the page', async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 600 });
    await page.goto(ROUTE);
    await expect(page.locator(BREAK_LINE).first()).toBeVisible();

    const labels = page.locator(LABEL);
    const count = await labels.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const box = await labels.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(600);
    }
  });

  test('overlay never intercepts pointer events', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.locator(BREAK_LINE).first()).toBeVisible();

    const pointerEvents = await page
      .locator(CONTAINER)
      .evaluate((el) => getComputedStyle(el).pointerEvents);
    expect(pointerEvents).toBe('none');

    await expect(
      page.locator('[contenteditable="true"]').first()
    ).toBeVisible();
  });

  test('no console errors while the overlay computes and recomputes', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto(ROUTE);
    await expect(page.locator(BREAK_LINE).first()).toBeVisible();
    await page.setViewportSize({ height: 900, width: 700 });
    await expect(page.locator(BREAK_LINE).first()).toBeVisible();

    expect(errors).toEqual([]);
  });
});
