// ============================================================
// pagination/measure/measure.ts
//
// Turn an UnmeasuredSnapshot into a MeasuredSnapshot by measuring each block's
// rendered height + line height. The actual DOM read is injected (`MeasureFn`)
// so this assembly + cache layer stays pure and unit-testable; the React layer
// supplies a DOM-backed measurer (offsetHeight + computed line-height).
//
// Caching is keyed by the block's stable content id + the content width, so
// unchanged blocks are not re-measured (premirror's "measure once, cache by
// signature" idea).
// ============================================================

import type {
  MeasuredBlock,
  MeasuredSnapshot,
  UnmeasuredBlock,
  UnmeasuredSnapshot,
} from '../layout/types';

export type BlockMetrics = {
  heightPx: number;
  lineHeightPx: number;
};

export type MeasureFn = (block: UnmeasuredBlock) => BlockMetrics | null;

export type MeasureCache = Map<string, BlockMetrics>;

export type MeasureOptions = {
  /** Content width the blocks are measured at (part of the cache key). */
  widthPx: number;
  /** Persistent cache across calls; pass the same Map to reuse measurements. */
  cache?: MeasureCache;
  /** Line height used when measurement is unavailable. Default 20. */
  fallbackLineHeightPx?: number;
};

function lineCountFrom(heightPx: number, lineHeightPx: number): number {
  if (lineHeightPx <= 0) return 1;

  return Math.max(1, Math.round(heightPx / lineHeightPx));
}

export function measureSnapshot(
  snapshot: UnmeasuredSnapshot,
  measure: MeasureFn,
  options: MeasureOptions
): MeasuredSnapshot {
  const { cache, fallbackLineHeightPx = 20, widthPx } = options;

  const blocks: MeasuredBlock[] = snapshot.blocks.map((block) => {
    // Cache slot is per (block, width): a single id measured at two widths must
    // keep both, or alternating widths thrash one slot and defeat the cache.
    const cacheKey = `${block.id}@${widthPx}`;
    let metrics: BlockMetrics | null = cache?.get(cacheKey) ?? null;

    if (!metrics) {
      metrics = measure(block);
      if (metrics && cache) cache.set(cacheKey, metrics);
    }

    const heightPx = metrics?.heightPx ?? fallbackLineHeightPx;
    const lineHeightPx = metrics?.lineHeightPx ?? fallbackLineHeightPx;

    const measured: MeasuredBlock = {
      heightPx,
      id: block.id,
      lineCount: lineCountFrom(heightPx, lineHeightPx),
      lineHeightPx,
      path: block.path,
    };
    if (block.keepWithNext) measured.keepWithNext = true;
    if (block.breakBefore) measured.breakBefore = true;
    if (block.splittable === false) measured.splittable = false;

    return measured;
  });

  return { blocks };
}
