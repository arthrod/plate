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
  /**
   * The block's own vertical box spacing (margins + padding + borders) the DOM
   * adds around its text, in CSS px. Added to text height to form the block's
   * flow height for page packing. Optional; defaults to 0 (no spacing).
   */
  boxSpacingPx?: number;
  /**
   * Rendered content footprint, in CSS px, for blocks pretext cannot represent
   * — atomic/non-text blocks (images, tables, embeds) whose height is not their
   * text-line count. When supplied, it (not {@link heightPx}) is the flow-height
   * base for page packing. {@link heightPx}/lineCount stay pretext-derived so
   * line-level mapping is unaffected. Omit for text-flow blocks (pretext owns
   * their height).
   */
  renderedHeightPx?: number;
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

/**
 * Turn an `UnmeasuredSnapshot` into a `MeasuredSnapshot` by running `measure`
 * over every block, with optional LRU-free `MeasureCache` reuse keyed by
 * `(block.id, widthPx)`.
 *
 * The cache key includes the width so a single block measured at two widths
 * (resize, side-by-side editors) keeps both entries instead of overwriting one
 * slot. When measurement returns `null` or no measurer is supplied, the block
 * falls back to `{ heightPx: fallbackLineHeightPx, lineHeightPx: fallbackLineHeightPx }`
 * so composition still gets a valid (advisory) result.
 *
 * Flow height — the value the composer uses for page packing — equals
 * `(renderedHeightPx ?? heightPx) + boxSpacingPx`, emitted on the measured
 * block only when the measurer signals one of those terms. `heightPx` and
 * `lineCount` remain pretext-derived so line-level mapping is unaffected.
 *
 * @param snapshot  output of `buildSnapshot`
 * @param measure   the `MeasureFn` (DOM-backed in production, stub in tests)
 * @param options   `{ widthPx, cache?, fallbackLineHeightPx? }`
 * @returns         `MeasuredSnapshot` ready for `composeLayout`
 */
export function measureSnapshot(
  snapshot: UnmeasuredSnapshot,
  measure: MeasureFn,
  options: MeasureOptions
): MeasuredSnapshot {
  const { cache, fallbackLineHeightPx = 20, widthPx } = options;

  const blocks: MeasuredBlock[] = snapshot.blocks.map((block) => {
    // Cache slot is per (block, width, content-signature):
    //
    //  - `id + width` alone (CR PR #438) covered the resize/side-by-side
    //    case where the same block is measured at multiple widths.
    //
    //  - CR PR #442 (major): an explicit consumer-supplied `id` is stable
    //    ACROSS edits, but the block's measured height isn't — a stable id
    //    re-measured after the text changed would return the OLD cached
    //    height, producing wrong page breaks. The content signature
    //    (`type | text | flags`) closes that gap; the same edit changes
    //    the signature, which evicts the prior slot.
    //
    //  Fallback-id consumers already get this for free because the fallback
    //  id hashes the text — but the signature is the explicit-id path's
    //  invariant too.
    const sig = `${block.type ?? 'unknown'}|${block.text ?? ''}|${
      block.keepWithNext ? 1 : 0
    }|${block.breakBefore ? 1 : 0}|${block.splittable === false ? 0 : 1}`;
    const cacheKey = `${block.id}@${widthPx}@${sig}`;
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
    // Flow height (for packing) = base height + the block's box spacing. The base
    // is the rendered footprint when the measurer supplied one (atomic/non-text
    // blocks pretext can't represent), else the pretext text height. heightPx /
    // lineCount stay pretext-derived so line-level mapping is unaffected.
    const boxSpacingPx = metrics?.boxSpacingPx ?? 0;
    const flowBase = metrics?.renderedHeightPx ?? heightPx;
    if (metrics?.renderedHeightPx != null || boxSpacingPx > 0) {
      measured.flowHeightPx = flowBase + boxSpacingPx;
    }
    if (block.keepWithNext) measured.keepWithNext = true;
    if (block.breakBefore) measured.breakBefore = true;
    if (block.splittable === false) measured.splittable = false;

    return measured;
  });

  return { blocks };
}
