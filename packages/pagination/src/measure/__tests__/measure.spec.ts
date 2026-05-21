import type { UnmeasuredBlock, UnmeasuredSnapshot } from '../../layout/types';
import { type BlockMetrics, measureSnapshot } from '../measure';

const ub = (
  id: string,
  extra: Partial<UnmeasuredBlock> = {}
): UnmeasuredBlock => ({
  id,
  path: [0],
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
});
