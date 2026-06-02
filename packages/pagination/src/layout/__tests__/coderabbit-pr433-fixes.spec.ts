// CodeRabbit PR #433 fixes — regression guards for three correctness issues.
//
// 1. composeLayout: clamp non-positive frame bounds when margins/chrome ≥ page
//    dimensions. Without the clamp, composition produces frames with negative
//    width/height and downstream code (packing, projection) behaves
//    pathologically.
//
// 2. alignContentToLayout: clamp the page-start spacer to non-negative values.
//    A negative spacer would pull the next page-start block upward via CSS
//    `margin-top`, overlapping the prior page's content.
//
// 3. fragmentRects (geometry.ts): startsPage must be PAGE-local, not
//    FRAME-local. Multi-frame pages used to mark every frame's first
//    fragment as a page starter; now only the page's overall first fragment
//    gets startsPage=true.

import { describe, expect, test } from 'bun:test';

import { composeLayout } from '../compose';
import type { LayoutInput, MeasuredSnapshot } from '../types';

const baseInput = (overrides: Partial<LayoutInput> = {}): LayoutInput => ({
  page: { widthPx: 800, heightPx: 1000 },
  margins: { topPx: 96, rightPx: 96, bottomPx: 96, leftPx: 96 },
  policies: { widowLinesMin: 2, orphanLinesMin: 2, keepWithNextEnabled: false },
  ...overrides,
});

function snap(
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

describe('composeLayout — frame-bounds guard (PR #433)', () => {
  test('does not throw when margins consume the entire page height', () => {
    const out = composeLayout(
      snap([{ id: 'a', heightPx: 100 }]),
      baseInput({
        // 600 + 600 > 1000 → height would be negative without the clamp
        margins: { topPx: 600, bottomPx: 600, leftPx: 96, rightPx: 96 },
      })
    );
    expect(out.pages.length).toBeGreaterThan(0);
    for (const p of out.pages) {
      expect(p.frames[0]!.bounds.height).toBe(0);
    }
  });

  test('does not throw when margins consume the entire page width', () => {
    const out = composeLayout(
      snap([{ id: 'a', heightPx: 100 }]),
      baseInput({
        margins: { topPx: 96, bottomPx: 96, leftPx: 500, rightPx: 500 },
      })
    );
    for (const p of out.pages) {
      expect(p.frames[0]!.bounds.width).toBe(0);
    }
  });

  test('chrome + margins summing >= page dim clamps to zero, not negative', () => {
    const out = composeLayout(
      snap([{ id: 'a', heightPx: 100 }]),
      baseInput({
        margins: { topPx: 400, bottomPx: 400, leftPx: 96, rightPx: 96 },
        chrome: { header: { heightPx: 200 }, footer: { heightPx: 200 } },
      })
    );
    for (const p of out.pages) {
      expect(p.frames[0]!.bounds.height).toBe(0);
    }
  });

  test('happy path unchanged: positive bounds with valid margins', () => {
    const out = composeLayout(snap([{ id: 'a', heightPx: 100 }]), baseInput());
    expect(out.pages[0]!.frames[0]!.bounds.height).toBe(1000 - 96 - 96);
    expect(out.pages[0]!.frames[0]!.bounds.width).toBe(800 - 96 - 96);
  });
});
