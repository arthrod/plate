import type { UnmeasuredBlock, UnmeasuredSnapshot } from '../../layout/types';
import { type BlockMetrics, measureSnapshot } from '../measure';

const ub = (
  id: string,
  extra: Partial<UnmeasuredBlock> = {}
): UnmeasuredBlock => ({
  id,
  path: [0],
  text: '',
  type: 'p',
  ...extra,
});
const snap = (...blocks: UnmeasuredBlock[]): UnmeasuredSnapshot => ({ blocks });

describe('measureSnapshot', () => {
  it('measures each block and derives lineCount', () => {
    const measure = () => ({ heightPx: 100, lineHeightPx: 20 });
    const out = measureSnapshot(snap(ub('a'), ub('b')), measure, {
      widthPx: 600,
    });
    expect(out.blocks).toHaveLength(2);
    expect(out.blocks[0]).toMatchObject({
      id: 'a',
      heightPx: 100,
      lineHeightPx: 20,
      lineCount: 5,
    });
  });

  it('rounds lineCount and clamps to at least 1', () => {
    const measure = () => ({ heightPx: 25, lineHeightPx: 20 });
    const out = measureSnapshot(snap(ub('a')), measure, { widthPx: 600 });
    expect(out.blocks[0].lineCount).toBe(1); // round(1.25) = 1

    const measure2 = () => ({ heightPx: 8, lineHeightPx: 20 });
    const out2 = measureSnapshot(snap(ub('a')), measure2, { widthPx: 600 });
    expect(out2.blocks[0].lineCount).toBe(1); // clamp
  });

  it('reuses cached metrics for the same id + width (no re-measure)', () => {
    const cache = new Map();
    let calls = 0;
    const measure = () => {
      calls += 1;
      return { heightPx: 100, lineHeightPx: 20 };
    };
    measureSnapshot(snap(ub('a')), measure, { cache, widthPx: 600 });
    measureSnapshot(snap(ub('a')), measure, { cache, widthPx: 600 });
    expect(calls).toBe(1);
  });

  it('re-measures when width changes', () => {
    const cache = new Map();
    let calls = 0;
    const measure = () => {
      calls += 1;
      return { heightPx: 100, lineHeightPx: 20 };
    };
    measureSnapshot(snap(ub('a')), measure, { cache, widthPx: 600 });
    measureSnapshot(snap(ub('a')), measure, { cache, widthPx: 500 });
    expect(calls).toBe(2);
  });

  it('keeps each (id, width) cached when widths alternate (no thrash)', () => {
    const cache = new Map();
    let calls = 0;
    const measure = () => {
      calls += 1;
      return { heightPx: 100, lineHeightPx: 20 };
    };
    measureSnapshot(snap(ub('a')), measure, { cache, widthPx: 600 });
    measureSnapshot(snap(ub('a')), measure, { cache, widthPx: 500 });
    // width 600 was already measured — must be a cache hit, not a re-measure.
    measureSnapshot(snap(ub('a')), measure, { cache, widthPx: 600 });
    expect(calls).toBe(2);
  });

  it('carries over pagination hints from the unmeasured block', () => {
    const measure = () => ({ heightPx: 100, lineHeightPx: 20 });
    const out = measureSnapshot(
      snap(
        ub('a', { keepWithNext: true, breakBefore: true, splittable: false })
      ),
      measure,
      { widthPx: 600 }
    );
    expect(out.blocks[0]).toMatchObject({
      keepWithNext: true,
      breakBefore: true,
      splittable: false,
    });
  });

  it('packs by pretext heightPx + box spacing when no rendered footprint', () => {
    const measure = () => ({ heightPx: 100, lineHeightPx: 20, boxSpacingPx: 24 });
    const out = measureSnapshot(snap(ub('a')), measure, { widthPx: 600 });
    expect(out.blocks[0].flowHeightPx).toBe(124); // 100 + 24
  });

  it('packs atomic blocks by renderedHeightPx, keeping line mapping on pretext height', () => {
    // An image/table: pretext sees ~2 lines of caption text (40px) but the block
    // renders 300px tall. Packing must use the rendered footprint; line mapping
    // (heightPx/lineCount) stays pretext-derived.
    const measure = () => ({
      boxSpacingPx: 16,
      heightPx: 40,
      lineHeightPx: 20,
      renderedHeightPx: 300,
    });
    const out = measureSnapshot(snap(ub('img', { splittable: false })), measure, {
      widthPx: 600,
    });
    expect(out.blocks[0]).toMatchObject({
      flowHeightPx: 316, // renderedHeightPx (300) + boxSpacing (16)
      heightPx: 40, // pretext text height — unchanged
      lineCount: 2, // derived from pretext height, not the rendered footprint
    });
  });

  it('falls back to a default line when measurement returns null', () => {
    const measure = (): BlockMetrics | null => null;
    const out = measureSnapshot(snap(ub('a')), measure, {
      fallbackLineHeightPx: 24,
      widthPx: 600,
    });
    expect(out.blocks[0]).toMatchObject({
      heightPx: 24,
      lineHeightPx: 24,
      lineCount: 1,
    });
  });

  it('does NOT set flowHeightPx for a plain text block with no box spacing', () => {
    // A block with only heightPx/lineHeightPx and no boxSpacingPx or
    // renderedHeightPx must leave flowHeightPx absent so compose falls back to
    // heightPx, keeping block-level line mapping correct.
    const measure = () => ({ heightPx: 80, lineHeightPx: 20 });
    const out = measureSnapshot(snap(ub('a')), measure, { widthPx: 600 });
    expect(out.blocks[0].flowHeightPx).toBeUndefined();
  });

  it('sets flowHeightPx when renderedHeightPx is 0 (zero-height atomic)', () => {
    // renderedHeightPx=0 is explicitly present, so flowHeightPx must be set.
    const measure = () => ({
      boxSpacingPx: 8,
      heightPx: 0,
      lineHeightPx: 20,
      renderedHeightPx: 0,
    });
    const out = measureSnapshot(snap(ub('void', { splittable: false })), measure, {
      widthPx: 600,
    });
    // 0 (rendered) + 8 (box) = 8
    expect(out.blocks[0].flowHeightPx).toBe(8);
  });

  it('cache key avoids collision when block id contains the "@" separator character', () => {
    // If a block id is e.g. "a@600" and another block has id "a" at width 600,
    // they would produce the same key "a@600@600" vs "a@600" — only if our key
    // is "id@width". We verify two distinct ids + same width produce two calls.
    const cache = new Map();
    let calls = 0;
    const measure = () => {
      calls++;
      return { heightPx: 100, lineHeightPx: 20 };
    };
    // First block id="x@600", second id="x" — different ids, same width.
    measureSnapshot(
      snap(ub('x@600'), ub('x')),
      measure,
      { cache, widthPx: 600 }
    );
    // Both should be measured separately (2 unique cache keys).
    expect(calls).toBe(2);
    // Second call with same blocks must be fully cached (0 additional calls).
    measureSnapshot(
      snap(ub('x@600'), ub('x')),
      measure,
      { cache, widthPx: 600 }
    );
    expect(calls).toBe(2);
  });

  it('uses default 20px fallback lineHeight when fallbackLineHeightPx is not supplied', () => {
    const measure = (): BlockMetrics | null => null;
    const out = measureSnapshot(snap(ub('a')), measure, { widthPx: 600 });
    // Default fallbackLineHeightPx is 20.
    expect(out.blocks[0].heightPx).toBe(20);
    expect(out.blocks[0].lineHeightPx).toBe(20);
  });

  it('lineCount is 1 when lineHeightPx is 0 (guard against division by zero)', () => {
    // lineHeightPx=0 must not produce NaN or Infinity.
    const measure = () => ({ heightPx: 100, lineHeightPx: 0 });
    const out = measureSnapshot(snap(ub('a')), measure, { widthPx: 600 });
    expect(out.blocks[0].lineCount).toBe(1);
  });
});
