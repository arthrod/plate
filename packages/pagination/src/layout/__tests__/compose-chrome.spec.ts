// ============================================================
// pagination/layout/compose-chrome.spec.ts
//
// Composer contract for the chrome extension (headers, footers, page numbers,
// margins). The chrome IS the answer to the user's "page numbers follow the
// screen" complaint: chrome rects come out of `composeLayout` as pure
// page-geometric values, with NO DOM measurement involved. The overlay anchors
// them by `page.index + chrome.y`, so scrolling the editor cannot drift them.
//
// Tests cover:
//  1. baseline — no chrome → existing behavior preserved (frames unchanged)
//  2. header only — shrinks content height by header.heightPx, header.y == top margin
//  3. footer only — shrinks content height by footer.heightPx, footer.y == page-bottom - margin - height
//  4. both     — content height shrinks by header + footer
//  5. geometry — chrome.x == margin.left, chrome.widthPx == content width
//  6. per-page — every page in the output carries the same chrome rects
//  7. extra packing — chrome reduces frame height, so MORE pages may be needed
// ============================================================

import { describe, expect, test } from 'bun:test';

import { composeLayout } from '../compose';
import type { LayoutInput, MeasuredSnapshot } from '../types';

function makeSnapshot(blockCount: number, heightPx: number): MeasuredSnapshot {
  const blocks = Array.from({ length: blockCount }, (_, i) => ({
    id: `b${i}`,
    path: [i],
    heightPx,
    flowHeightPx: heightPx,
    lineHeightPx: 20,
    lineCount: Math.max(1, Math.round(heightPx / 20)),
  }));
  return { blocks };
}

const baseInput = (overrides: Partial<LayoutInput> = {}): LayoutInput => ({
  page: { widthPx: 800, heightPx: 1000 },
  margins: { topPx: 96, rightPx: 96, bottomPx: 96, leftPx: 96 },
  policies: { widowLinesMin: 2, orphanLinesMin: 2, keepWithNextEnabled: false },
  ...overrides,
});

describe('composeLayout — chrome (header/footer/page-numbers/margins)', () => {
  test('1. baseline: no chrome → no chrome field on PageLayout, frame unchanged', () => {
    const snapshot = makeSnapshot(3, 200);
    const out = composeLayout(snapshot, baseInput());
    expect(out.pages.length).toBeGreaterThan(0);
    for (const p of out.pages) {
      expect(p.chrome).toBeUndefined();
      expect(p.frames[0]!.bounds.y).toBe(96);
      expect(p.frames[0]!.bounds.height).toBe(1000 - 96 - 96);
    }
  });

  test('2. header only: shrinks frame height; chrome.header at top margin', () => {
    const snapshot = makeSnapshot(2, 200);
    const out = composeLayout(
      snapshot,
      baseInput({ chrome: { header: { heightPx: 40 } } })
    );
    for (const p of out.pages) {
      expect(p.frames[0]!.bounds.y).toBe(96 + 40);
      expect(p.frames[0]!.bounds.height).toBe(1000 - 96 - 96 - 40);
      expect(p.chrome?.header?.y).toBe(96);
      expect(p.chrome?.header?.heightPx).toBe(40);
      expect(p.chrome?.footer).toBeUndefined();
    }
  });

  test('3. footer only: shrinks frame height; chrome.footer at page-bottom - bottom-margin', () => {
    const snapshot = makeSnapshot(2, 200);
    const out = composeLayout(
      snapshot,
      baseInput({ chrome: { footer: { heightPx: 28 } } })
    );
    for (const p of out.pages) {
      expect(p.frames[0]!.bounds.y).toBe(96);
      expect(p.frames[0]!.bounds.height).toBe(1000 - 96 - 96 - 28);
      expect(p.chrome?.footer?.y).toBe(1000 - 96 - 28);
      expect(p.chrome?.footer?.heightPx).toBe(28);
      expect(p.chrome?.header).toBeUndefined();
    }
  });

  test('4. header AND footer: both bands subtract from content height', () => {
    const snapshot = makeSnapshot(2, 200);
    const out = composeLayout(
      snapshot,
      baseInput({
        chrome: { header: { heightPx: 40 }, footer: { heightPx: 28 } },
      })
    );
    for (const p of out.pages) {
      expect(p.frames[0]!.bounds.y).toBe(96 + 40);
      expect(p.frames[0]!.bounds.height).toBe(1000 - 96 - 96 - 40 - 28);
      expect(p.chrome?.header?.y).toBe(96);
      expect(p.chrome?.footer?.y).toBe(1000 - 96 - 28);
    }
  });

  test('5. geometry: chrome.x == margins.left, widthPx == content width', () => {
    const out = composeLayout(
      makeSnapshot(1, 100),
      baseInput({
        margins: { topPx: 50, rightPx: 60, bottomPx: 70, leftPx: 80 },
        chrome: { header: { heightPx: 30 }, footer: { heightPx: 20 } },
      })
    );
    const p = out.pages[0]!;
    const expectedWidth = 800 - 80 - 60;
    expect(p.chrome?.header?.x).toBe(80);
    expect(p.chrome?.header?.widthPx).toBe(expectedWidth);
    expect(p.chrome?.footer?.x).toBe(80);
    expect(p.chrome?.footer?.widthPx).toBe(expectedWidth);
  });

  test('6. per-page: every page carries identical chrome rects', () => {
    const out = composeLayout(
      makeSnapshot(5, 300),
      baseInput({
        chrome: { header: { heightPx: 24 }, footer: { heightPx: 24 } },
      })
    );
    expect(out.pages.length).toBeGreaterThanOrEqual(2);
    const first = out.pages[0]!.chrome;
    for (const p of out.pages) {
      expect(p.chrome?.header?.y).toBe(first?.header?.y!);
      expect(p.chrome?.header?.heightPx).toBe(first?.header?.heightPx!);
      expect(p.chrome?.footer?.y).toBe(first?.footer?.y!);
      expect(p.chrome?.footer?.heightPx).toBe(first?.footer?.heightPx!);
    }
  });

  test('7. extra packing: chrome shrinks usable frame → more pages may be produced', () => {
    // 4 blocks of 200px each = 800px content. Page content area without chrome
    // is 1000-96-96 = 808px (just fits). With chrome reducing usable height to
    // 740px, packing should require an extra page.
    const snapshot = makeSnapshot(4, 200);
    const noChrome = composeLayout(snapshot, baseInput());
    const withChrome = composeLayout(
      snapshot,
      baseInput({
        chrome: { header: { heightPx: 40 }, footer: { heightPx: 28 } },
      })
    );
    expect(withChrome.pages.length).toBeGreaterThan(noChrome.pages.length);
  });
});
