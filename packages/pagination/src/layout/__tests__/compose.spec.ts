import { composeLayout } from '../compose';
import type { LayoutInput, MeasuredBlock, MeasuredSnapshot } from '../types';

// A4 @ 96dpi, 1in margins → content frame height = 1123 - 192 = 931px.
const INPUT: LayoutInput = {
  page: { widthPx: 794, heightPx: 1123, preset: 'a4' },
  margins: { topPx: 96, rightPx: 96, bottomPx: 96, leftPx: 96 },
  policies: { widowLinesMin: 2, orphanLinesMin: 2, keepWithNextEnabled: true },
};
const FRAME_H = 931;
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
const allFrags = (out: ReturnType<typeof composeLayout>) =>
  out.pages.flatMap((p) => p.frames.flatMap((f) => f.fragments));

describe('composeLayout', () => {
  it('places blocks that fit on a single page, stacked by height', () => {
    const out = composeLayout(snap(block(100), block(100), block(100)), INPUT);
    expect(out.pages).toHaveLength(1);
    const frags = out.pages[0].frames[0].fragments;
    expect(frags.map((f) => f.y)).toEqual([0, 100, 200]);
    expect(frags.every((f) => f.fragmentIndex === 0)).toBe(true);
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

  it('moves a whole non-splittable block to the next page when it does not fit', () => {
    const out = composeLayout(
      snap(block(700), block(400, { splittable: false })),
      INPUT
    );
    expect(out.pages).toHaveLength(2);
    expect(out.pages[0].frames[0].fragments).toHaveLength(1);
    const p2first = out.pages[1].frames[0].fragments[0];
    expect(p2first.breakReason).toBe('block_overflow');
    expect(p2first.y).toBe(0);
  });

  it('splits a splittable block across pages by line height', () => {
    // 2000px / 20 = 100 lines; frame fits floor(931/20)=46 lines.
    const out = composeLayout(snap(block(2000)), INPUT);
    expect(out.pages.length).toBe(3); // 46 + 46 + 8
    const frags = allFrags(out);
    expect(frags.map((f) => f.fragmentIndex)).toEqual([0, 1, 2]);
    expect(frags.map((f) => f.lineStart)).toEqual([0, 46, 92]);
    expect(frags.reduce((n, f) => n + f.lineCount, 0)).toBe(100);
    expect(frags.every((f) => f.blockId === frags[0].blockId)).toBe(true);
  });

  it('places an oversized non-splittable block on its own page (accepts overflow)', () => {
    const out = composeLayout(snap(block(2000, { splittable: false })), INPUT);
    expect(out.pages).toHaveLength(1);
    expect(out.pages[0].frames[0].fragments).toHaveLength(1);
    expect(out.pages[0].frames[0].fragments[0].heightPx).toBe(2000);
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

  it('pushes a block down to avoid an orphan (fewer than orphanMin lines at bottom)', () => {
    // filler leaves only 1 line of room; next block must not orphan a single line.
    const out = composeLayout(snap(block(FRAME_H - LH), block(200)), INPUT);
    expect(out.pages).toHaveLength(2);
    expect(out.pages[1].frames[0].fragments[0].breakReason).toBe(
      'widow_orphan'
    );
  });

  it('is deterministic — identical input yields identical output', () => {
    const mk = () => snap(block(700), block(700), block(2000));
    nextId = 0;
    const a = composeLayout(mk(), INPUT);
    nextId = 0;
    const b = composeLayout(mk(), INPUT);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('emits a single empty page for empty input', () => {
    const out = composeLayout(snap(), INPUT);
    expect(out.pages).toHaveLength(1);
    expect(out.pages[0].frames[0].fragments).toHaveLength(0);
  });
});
