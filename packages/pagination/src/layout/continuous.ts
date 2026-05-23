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
 * The continuous-flow Y (px, relative to content top) at each interior page
 * boundary — i.e. the cumulative content height at the end of every page except
 * the last. N pages produce N-1 break Ys; the document end is not a break.
 */
export function getContinuousBreakYs(layout: LayoutOutput): number[] {
  const breakYs: number[] = [];
  let cumulative = 0;

  for (let i = 0; i < layout.pages.length - 1; i++) {
    cumulative += pageHeight(layout.pages[i]);
    breakYs.push(cumulative);
  }

  return breakYs;
}
