// ============================================================
// pagination/layout/compose-chrome-edge-cases.spec.ts
//
// Regression guards for chrome edge cases discovered via the live-deploy
// dogfood loop. Each test pins a behavior that broke (or was at risk of
// breaking) when the chrome design met real user data.
// ============================================================

import { describe, expect, test } from 'bun:test';

import { composeLayout } from '../compose';
import type { LayoutInput, MeasuredSnapshot } from '../types';

function snapshot(
  blocks: Array<{ id: string; heightPx: number }>
): MeasuredSnapshot {
  return {
    blocks: blocks.map((b, i) => ({
      id: b.id,
      path: [i],
      heightPx: b.heightPx,
      flowHeightPx: b.heightPx,
      lineHeightPx: 24,
      lineCount: Math.max(1, Math.round(b.heightPx / 24)),
    })),
  };
}
const A4 = (override: Partial<LayoutInput> = {}): LayoutInput => ({
  page: { widthPx: 794, heightPx: 1123, preset: 'a4' },
  margins: { topPx: 96, rightPx: 96, bottomPx: 96, leftPx: 96 },
  policies: { widowLinesMin: 2, orphanLinesMin: 2, keepWithNextEnabled: false },
  ...override,
});

describe('composeLayout — chrome edge cases (iter-1 dogfood)', () => {
  test('last page has a chrome rect even when its content is much shorter than a full page', () => {
    // Stack content that OVERFLOWS into a second page with just one short
    // block (~32px). Page-1 content area = 1123-96-96-28-32 = 871 px; the
    // first block fills 850 (close to full), and the second block is 32 px
    // forcing a page break. The second page's chrome.footer should still be
    // present and identical in geometry to every other page's footer.
    const blocks = [
      { id: 'fill', heightPx: 850 }, // fills page 1's content area
      { id: 'short', heightPx: 32 }, // tiny last block on page 2
    ];
    const out = composeLayout(
      snapshot(blocks),
      A4({
        chrome: { header: { heightPx: 28 }, footer: { heightPx: 32 } },
      })
    );
    expect(out.pages.length).toBe(2);
    const last = out.pages[1]!;
    expect(last.chrome?.footer?.heightPx).toBe(32);
    expect(last.chrome?.header?.heightPx).toBe(28);
    expect(last.chrome?.footer?.y).toBe(out.pages[0]!.chrome!.footer!.y);
  });

  test('content frame height is the same on every page (chrome subtraction is constant)', () => {
    const out = composeLayout(
      snapshot([
        { id: 'a', heightPx: 600 },
        { id: 'b', heightPx: 600 },
        { id: 'c', heightPx: 600 },
        { id: 'd', heightPx: 600 },
      ]),
      A4({ chrome: { header: { heightPx: 28 }, footer: { heightPx: 32 } } })
    );
    expect(out.pages.length).toBeGreaterThanOrEqual(3);
    const expectedHeight = 1123 - 96 - 96 - 28 - 32;
    for (const p of out.pages) {
      expect(p.frames[0]!.bounds.height).toBe(expectedHeight);
    }
  });

  test('chrome geometry is reproducible: same input → same output (pure composer)', () => {
    const input = A4({
      chrome: { header: { heightPx: 28 }, footer: { heightPx: 32 } },
    });
    const snap = snapshot([
      { id: 'a', heightPx: 400 },
      { id: 'b', heightPx: 400 },
      { id: 'c', heightPx: 400 },
    ]);
    const a = composeLayout(snap, input);
    const b = composeLayout(snap, input);
    expect(JSON.stringify(a.pages)).toBe(JSON.stringify(b.pages));
  });

  test('zero-height chrome configs are valid (height defaults to 0)', () => {
    const out = composeLayout(
      snapshot([{ id: 'a', heightPx: 800 }]),
      A4({ chrome: { header: { heightPx: 0 }, footer: { heightPx: 0 } } })
    );
    expect(out.pages[0]!.frames[0]!.bounds.height).toBe(1123 - 96 - 96);
    expect(out.pages[0]!.chrome?.header?.heightPx).toBe(0);
    expect(out.pages[0]!.chrome?.footer?.heightPx).toBe(0);
  });

  test('multi-page packing matches expected page count under chrome subtraction', () => {
    // Math:  page content = 1123 - 96 - 96 - 28 - 32 = 871 px
    // Each block is 200 px. floor(871/200) = 4 blocks per page.
    // 10 blocks ÷ 4 = 3 pages (4 + 4 + 2).
    const out = composeLayout(
      snapshot(
        Array.from({ length: 10 }, (_, i) => ({ id: `b${i}`, heightPx: 200 }))
      ),
      A4({ chrome: { header: { heightPx: 28 }, footer: { heightPx: 32 } } })
    );
    expect(out.pages.length).toBe(3);
  });
});
