import { expect, test } from '@playwright/test';

// ============================================================
// E2E: @platejs/pagination continuous-view overlay
//
// Locks in the user-visible behavior the 2026-05-23 dogfood pass surfaced and
// the "margin-aware packing + overlay polish" fix (commit e7be784) resolved.
// Each test maps to a dogfood issue:
//
//   ISSUE-001  break lines land on the true A4 boundary, no accumulating drift
//   ISSUE-002  the advisory lines render on load (no permanent missing-overlay)
//   ISSUE-003  a "Page 1 of N" marker + "Page K of N" labels with a real total
//   ISSUE-004  labels stay on-screen when a narrow viewport overflows the page
//
// Plus two invariants the dogfood verified by hand: zero console errors, and an
// overlay that never intercepts pointer events (native editing untouched).
//
// Geometry facts (BasePaginationPlugin defaults, asserted against the demo):
//   page height 1123px, top+bottom margin 96px each  ->  931px content per page.
// Break tops are explicit inline `top` px values in the editable's offset frame,
// so the page-1 marker top is the origin and `break[i].top - markerTop` is the
// content-space distance to the start of page i+2.
// ============================================================

const ROUTE = '/dev/pagination2';
const CONTENT_PER_PAGE = 931; // 1123 - 96 - 96

const BREAK_LINE = '[data-slot="pagination-break-line"]';
const PAGE_MARKER = '[data-slot="pagination-page-marker"]';
const LABEL = '[data-slot="pagination-break-label"]';
const CONTAINER = '[data-slot="pagination-break-lines"]';

/** Read the explicit inline `top` (px) of an absolutely-positioned overlay node. */
const topOf = (handle: {
  evaluate: <R>(fn: (el: SVGElement | HTMLElement) => R) => Promise<R>;
}) => handle.evaluate((el) => Number.parseFloat((el as HTMLElement).style.top));

test.describe('pagination continuous-view overlay', () => {
  test('ISSUE-002: advisory break lines render on load', async ({ page }) => {
    await page.goto(ROUTE);

    // The overlay computes in a layout effect after hydration; the lines must
    // actually appear (the regression was content with no lines).
    await expect(page.locator(BREAK_LINE).first()).toBeVisible();
  });

  test('ISSUE-003: a "Page 1 of N" marker and consistent "Page K of N" labels', async ({

  }) => {
    await page.goto(ROUTE);
    await expect(page.locator(BREAK_LINE).first()).toBeVisible();

    const breakCount = await page.locator(BREAK_LINE).count();
    const total = breakCount + 1;

    // Page 1 is explicitly marked (its absence was the dogfood complaint).
    await expect(page.locator(`${PAGE_MARKER} ${LABEL}`)).toHaveText(
      `Page 1 of ${total}`
    );

    // Every break label reads "Page K of N" with the same, real total — and the
    // page numbers run 2..total in document order.
    const labels = await page.locator(`${BREAK_LINE} ${LABEL}`).allInnerTexts();
    expect(labels).toEqual(
      Array.from({ length: breakCount }, (_, i) => `Page ${i + 2} of ${total}`)
    );
  });

  test('ISSUE-001: break lines sit on the A4 boundary without accumulating drift', async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.locator(BREAK_LINE).first()).toBeVisible();

    const markerTop = await topOf(page.locator(PAGE_MARKER));
    const lines = page.locator(BREAK_LINE);
    const count = await lines.count();
    expect(count).toBeGreaterThan(1); // need >=2 to prove drift doesn't compound

    let prev = markerTop;
    for (let i = 0; i < count; i++) {
      const top = await topOf(lines.nth(i));
      const fromOrigin = top - markerTop; // content-space Y of page (i+2)'s start
      const expectedBoundary = (i + 1) * CONTENT_PER_PAGE;

      // MAIN GUARD: a break never sits BELOW the true A4 boundary. The pre-fix
      // bug pushed each break progressively below it (+137px at page 2, +307px
      // at page 3); margin-aware packing keeps every break on or above the grid.
      expect(fromOrigin).toBeLessThanOrEqual(expectedBoundary + 30);

      // Per-page gap is ~one A4 of content: never over-packed (the bug), and
      // not absurdly under-filled. Whole-block packing under-fills by at most
      // ~one block, so this stays a LOCAL bound that does not accumulate.
      const gap = top - prev;
      expect(gap).toBeLessThanOrEqual(CONTENT_PER_PAGE + 30);
      expect(gap).toBeGreaterThanOrEqual(CONTENT_PER_PAGE - 250);
      prev = top;
    }
  });

  test('ISSUE-004: page labels stay on-screen on a viewport narrower than the page', async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 600 }); // < 794px A4 stack
    await page.goto(ROUTE);
    await expect(page.locator(BREAK_LINE).first()).toBeVisible();

    const labels = page.locator(LABEL);
    const count = await labels.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const box = await labels.nth(i).boundingBox();
      expect(box).not.toBeNull();
      // Whole chip within the 600px viewport (left-gutter placement), so the
      // user never has to scroll horizontally to read a page number.
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(600);
    }
  });

  test('overlay never intercepts pointer events (native editing untouched)', async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.locator(BREAK_LINE).first()).toBeVisible();

    const pointerEvents = await page
      .locator(CONTAINER)
      .evaluate((el) => getComputedStyle(el).pointerEvents);
    expect(pointerEvents).toBe('none');

    // The editor remains the live, editable surface beneath the overlay.
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
    // Settle a resize-driven recompute too (width change re-wraps + re-anchors).
    await page.setViewportSize({ height: 900, width: 700 });
    await expect(page.locator(BREAK_LINE).first()).toBeVisible();

    expect(errors).toEqual([]);
  });
});
