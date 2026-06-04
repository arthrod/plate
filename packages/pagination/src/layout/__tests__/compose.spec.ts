import { composeLayout } from '../compose';
import type { LayoutInput, MeasuredBlock, MeasuredSnapshot } from '../types';

// A4 @ 96dpi, 1in margins → content frame height = 1123 - 192 = 931px.
const INPUT: LayoutInput = {
  page: { widthPx: 794, heightPx: 1123, preset: 'a4' },
  margins: { topPx: 96, rightPx: 96, bottomPx: 96, leftPx: 96 },
  policies: { widowLinesMin: 2, orphanLinesMin: 2, keepWithNextEnabled: true },
};
const LH = 20;

let nextId = 0;
function block(
  heightPx: number,
  extra: Partial<MeasuredBlock> = {}
): MeasuredBlock {
  const id = `b${nextId++}`;
  return {
    id,
    path: [nextId],
    heightPx,
    lineHeightPx: LH,
    lineCount: Math.max(1, Math.round(heightPx / LH)),
    ...extra,
  };
}
function snap(...blocks: MeasuredBlock[]): MeasuredSnapshot {
  return { blocks };
}

describe('composeLayout (place-whole / option C)', () => {
  it('places blocks that fit on a single page, stacked by height', () => {
    const out = composeLayout(snap(block(100), block(100), block(100)), INPUT);
    expect(out.pages).toHaveLength(1);
    const frags = out.pages[0].frames[0].fragments;
    expect(frags.map((f) => f.y)).toEqual([0, 100, 200]);
    // every block is one whole fragment.
    expect(frags.every((f) => f.fragmentIndex === 0)).toBe(true);
    expect(frags.every((f) => f.lineStart === 0)).toBe(true);
    expect(out.metrics).toEqual({ pages: 1, blocks: 3 });
  });

  it('exposes the content frame bounds (page minus margins)', () => {
    const out = composeLayout(snap(block(100)), INPUT);
    expect(out.pages[0].frames[0].bounds).toEqual({
      x: 96,
      y: 96,
      width: 794 - 192,
      height: 931,
    });
  });

  it('moves a block whole to the next page when it does not fit the remaining space', () => {
    const out = composeLayout(snap(block(700), block(400)), INPUT);
    expect(out.pages).toHaveLength(2);
    expect(out.pages[0].frames[0].fragments).toHaveLength(1);
    const p2first = out.pages[1].frames[0].fragments[0];
    expect(p2first.breakReason).toBe('block_overflow');
    expect(p2first.y).toBe(0);
    expect(p2first.heightPx).toBe(400);
  });

  it('places a block taller than a full page on its own page, accepting overflow', () => {
    const out = composeLayout(snap(block(2000)), INPUT);
    expect(out.pages).toHaveLength(1);
    const frags = out.pages[0].frames[0].fragments;
    expect(frags).toHaveLength(1);
    expect(frags[0].heightPx).toBe(2000);
    expect(frags[0].fragmentIndex).toBe(0);
  });

  it('respects manual page breaks (breakBefore)', () => {
    const out = composeLayout(
      snap(block(100), block(100, { breakBefore: true })),
      INPUT
    );
    expect(out.pages).toHaveLength(2);
    expect(out.pages[1].frames[0].fragments[0].breakReason).toBe(
      'manual_break'
    );
  });

  it('keeps a keepWithNext block with the following block', () => {
    // filler fills most of page 1 → A(100,keepWithNext)+B(100)=200 > remaining.
    const out = composeLayout(
      snap(block(800), block(100, { keepWithNext: true }), block(100)),
      INPUT
    );
    expect(out.pages).toHaveLength(2);
    expect(out.pages[0].frames[0].fragments).toHaveLength(1); // only filler
    const p2 = out.pages[1].frames[0].fragments;
    expect(p2).toHaveLength(2); // A + B together
    expect(p2[0].breakReason).toBe('keep_with_next');
  });

  it('is deterministic — identical input yields identical output', () => {
    const mk = () => snap(block(700), block(700), block(2000));
    nextId = 0;
    const a = composeLayout(mk(), INPUT);
    nextId = 0;
    const b = composeLayout(mk(), INPUT);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('packs by flowHeightPx (margin-aware) when present, not just text height', () => {
    // Text height 400 each → 800 ≤ 931 would fit one page. Flow height 600 each
    // (DOM margins) → 1200 > 931, so the second block must overflow to page 2.
    nextId = 0;
    const out = composeLayout(
      snap(
        block(400, { flowHeightPx: 600, path: [0] }),
        block(400, { flowHeightPx: 600, path: [1] })
      ),
      INPUT
    );
    expect(out.pages).toHaveLength(2);
    expect(out.mapping.pageOfBlock(1)).toBe(1); // block 1 begins page 2
  });

  it('falls back to heightPx for packing when flowHeightPx is absent', () => {
    nextId = 0;
    const out = composeLayout(snap(block(400), block(400)), INPUT);
    expect(out.pages).toHaveLength(1);
  });

  it('emits a single empty page for empty input', () => {
    const out = composeLayout(snap(), INPUT);
    expect(out.pages).toHaveLength(1);
    expect(out.pages[0].frames[0].fragments).toHaveLength(0);
  });

  it('includes a MappingIndex in LayoutOutput, built during composition', () => {
    const out = composeLayout(
      snap(block(700, { path: [0] }), block(400, { path: [1] })),
      INPUT
    );
    // 700 fits page 0; 400 overflows to page 1.
    expect(out.mapping.pageOfBlock(0)).toBe(0);
    expect(out.mapping.pageOfBlock(1)).toBe(1);
  });

  it('accumulates currentY using flowHeightPx so y offsets are flow-based', () => {
    // Three blocks each with flowHeightPx=200 (text 100, spacing 100).
    // All fit on one page (3×200=600 < 931). y offsets should advance by 200.
    nextId = 0;
    const out = composeLayout(
      snap(
        block(100, { flowHeightPx: 200, path: [0] }),
        block(100, { flowHeightPx: 200, path: [1] }),
        block(100, { flowHeightPx: 200, path: [2] })
      ),
      INPUT
    );
    expect(out.pages).toHaveLength(1);
    const frags = out.pages[0].frames[0].fragments;
    expect(frags.map((f) => f.y)).toEqual([0, 200, 400]);
  });

  it('produces consecutive page indices on a 3-page layout', () => {
    // Three large blocks, each needing its own page.
    nextId = 0;
    const out = composeLayout(
      snap(
        block(900, { path: [0] }),
        block(900, { path: [1] }),
        block(900, { path: [2] })
      ),
      INPUT
    );
    expect(out.pages).toHaveLength(3);
    expect(out.pages.map((p) => p.index)).toEqual([0, 1, 2]);
    expect(out.metrics).toEqual({ pages: 3, blocks: 3 });
  });

  it('does not set breakReason on blocks that are not the first on a new page', () => {
    // Two blocks fit page 0. Third overflows to page 1.
    nextId = 0;
    const out = composeLayout(
      snap(
        block(400, { path: [0] }),
        block(400, { path: [1] }),
        block(400, { path: [2] })
      ),
      INPUT
    );
    // Second block on page 0 has no breakReason (same page continuation).
    expect(out.pages[0].frames[0].fragments[1].breakReason).toBeUndefined();
    // First block on page 1 has breakReason (moved to a new page).
    expect(out.pages[1].frames[0].fragments[0].breakReason).toBe(
      'block_overflow'
    );
  });

  it('places a block at y=0 when it is the first on a fresh page after overflow', () => {
    nextId = 0;
    const out = composeLayout(
      snap(block(900, { path: [0] }), block(100, { path: [1] })),
      INPUT
    );
    expect(out.pages).toHaveLength(2);
    const p2frag = out.pages[1].frames[0].fragments[0];
    expect(p2frag.y).toBe(0);
  });

  it('places an oversized block at y=0 on the page it starts on', () => {
    nextId = 0;
    const out = composeLayout(snap(block(5000, { path: [0] })), INPUT);
    expect(out.pages[0].frames[0].fragments[0].y).toBe(0);
  });

  it('a block exactly equal to frame height fits without triggering overflow', () => {
    // frameHeight = 931. A 931px block must fit on the current page.
    nextId = 0;
    const out = composeLayout(snap(block(931, { path: [0] })), INPUT);
    expect(out.pages).toHaveLength(1);
  });
});
