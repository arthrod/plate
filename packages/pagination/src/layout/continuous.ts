// ============================================================
// pagination/layout/continuous.ts
//
// Continuous-mode projection: where page boundaries fall in the single, un-spaced
// editable flow. Used by the continuous view to draw thin advisory break-lines at
// each page boundary without inserting any gaps (content stays in normal flow).
// ============================================================

import type { LayoutOutput } from './types';

/** Total measured height of a page's fragments (continuous-flow contribution). */
function pageHeight(page: LayoutOutput['pages'][number]): number {
  let sum = 0;
  for (const frame of page.frames) {
    for (const fragment of frame.fragments) sum += fragment.heightPx;
  }

  return sum;
}

/**
 * The cumulative flow Y (px, relative to content top) at each interior page
 * boundary — i.e. the sum of `fragment.heightPx` values for all pages up to
 * (but not including) the last page. N pages produce N-1 break Ys; the
 * document end is not a break.
 *
 * Note: `fragment.heightPx` stores the block's *flow* height (text height +
 * DOM box spacing when `flowHeightPx` was supplied by the measurer). So these
 * Y values include any per-block margin/padding/border accumulated across
 * earlier pages. They are closer to the real DOM boundary than pure
 * pretext-text heights, but still drift because adjacent-block margin
 * collapse is not modelled. Prefer {@link getContinuousBreaks}, which names
 * the boundary block so the overlay can anchor to that block's live DOM top —
 * the only way to land exactly on a real block edge.
 */
export function getContinuousBreakYs(layout: LayoutOutput): number[] {
  const breakYs: number[] = [];


  for (let i = 0; i < layout.pages.length - 1; i++) {
    cumulative += pageHeight(layout.pages[i]);
    breakYs.push(cumulative);
  }

  return breakYs;
}

/** A page boundary expressed as the block (and line) that begins the next page. */
export type ContinuousBreak = {
  /** Top-level block index (Slate `path[0]`) that begins the page after this break. */
  blockIndex: number;
  /**
   * First line within that block where the next page starts. `0` is a clean
   * whole-block boundary; `> 0` means the block is split across the boundary
   * (line-split mode), and the overlay offsets by `lineStart × lineHeight`.
   */
  lineStart: number;
};

/**
 * Each interior page boundary, named by the block that begins the next page.
 *
 * pretext owns the decision — which block (and line) starts each page comes
 * straight from composition. The continuous overlay anchors its advisory rule
 * to that boundary block's live DOM top, so the line always lands on a real
 * block edge instead of a text-only pixel sum that ignores DOM margins.
 *
 * N pages produce N-1 breaks; the document end is not a break.
 */
export function getContinuousBreaks(layout: LayoutOutput): ContinuousBreak[] {
  const breaks: ContinuousBreak[] = [];

  for (let i = 1; i < layout.pages.length; i++) {
    const first = layout.pages[i].frames[0]?.fragments[0];
    if (!first) continue;

    breaks.push({ blockIndex: first.path[0], lineStart: first.lineStart });
  }

  return breaks;
}
