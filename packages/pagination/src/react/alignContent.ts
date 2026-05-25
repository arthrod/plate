// ============================================================
// pagination/react/alignContent.ts
//
// Align a single continuous editable's content to the composed page frames by
// applying a top-margin "spacer" to each block that starts a page. This is a
// CSS-only side effect on the live DOM — the document model never changes.
//
// The spacer for the first block of page p is the empty space left at the
// bottom of page p-1's content frame, plus the inter-page non-content space
// (bottom margin + page gap + top margin), so the block snaps to page p's
// content-frame top.
// ============================================================

import type { LayoutInput, LayoutOutput } from '../layout/types';
import { topLevelBlockElements } from './domMeasure';
import { PAGE_STACK_GAP_PX } from './geometry';

export function computePageStartSpacers(
  layout: LayoutOutput,
  input: LayoutInput,
  gapPx: number = PAGE_STACK_GAP_PX
): Map<number, number> {
  const contentHeight =
    input.page.heightPx - input.margins.topPx - input.margins.bottomPx;
  const spacers = new Map<number, number>();

  for (const page of layout.pages) {
    if (page.index === 0) continue;

    const first = page.frames[0].fragments[0];
    if (!first) continue;

    const prev = layout.pages[page.index - 1].frames[0];
    const prevBottom = prev.fragments.reduce(
      (max, f) => Math.max(max, f.y + f.heightPx),
      0
    );

    spacers.set(
      first.path[0],
      contentHeight -
        prevBottom +
        input.margins.bottomPx +
        gapPx +
        input.margins.topPx
    );
  }

  return spacers;
}

/**
 * Compute + apply page-start spacers to the editable's top-level blocks (CSS
 * `margin-top` only — no model change). Returns the spacer map.
 */
export function alignContentToLayout(
  editable: HTMLElement,
  layout: LayoutOutput,
  input: LayoutInput,
  gapPx: number = PAGE_STACK_GAP_PX
): Map<number, number> {
  const spacers = computePageStartSpacers(layout, input, gapPx);

  topLevelBlockElements(editable).forEach((el, index) => {
    el.style.marginTop = spacers.has(index) ? `${spacers.get(index)}px` : '';
  });

  return spacers;
}
