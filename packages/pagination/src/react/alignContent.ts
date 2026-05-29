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

/**
 * Compute the page-start spacer map — for each block that begins a NEW page
 * (page index > 0), how much CSS `margin-top` is needed so the block snaps
 * to that page's content-frame top in continuous view.
 *
 * Pure: returns the map without touching the DOM. {@link alignContentToLayout}
 * is the side-effecting wrapper.
 *
 * Formula: `page.heightPx - prevBottom + gapPx`, clamped non-negative.
 * (See the inline note for the derivation; margins/chrome cancel exactly out
 * of the original four-term expression — Gemini PR #442.)
 *
 * @param layout  output of `composeLayout`
 * @param input   the same `LayoutInput` used to compose (for `page.heightPx`)
 * @param gapPx   inter-page visual gap (defaults to {@link PAGE_STACK_GAP_PX})
 * @returns       `Map<blockIndex, spacerPx>` — only contains entries for
 *                blocks that start a non-first page
 */
export function computePageStartSpacers(
  layout: LayoutOutput,
  input: LayoutInput,
  gapPx: number = PAGE_STACK_GAP_PX
): Map<number, number> {
  // Gemini PR #442 review (medium): the original formula was
  //   (contentHeight - prevBottom) + margin.bottom + gap + margin.top
  // where contentHeight = page.heightPx - margin.top - margin.bottom.
  // Margins cancel, leaving just:
  //   page.heightPx - prevBottom + gap
  // which makes the geometry self-evident: skip the rest of the prior page
  // (page.heightPx − how-far-the-prior-frame-actually-filled) plus the
  // inter-page visual gap. Still clamped to non-negative for the case
  // where `prevBottom` exceeds page.heightPx (oversized last fragment).
  const spacers = new Map<number, number>();

  for (const page of layout.pages) {
    if (page.index === 0) continue;

    const first = page.frames[0]?.fragments[0];
    if (!first) continue;

    // CodeRabbit PR #442 (major): only the FIRST fragment of a top-level
    // block can receive a page-start spacer. A page that opens with a
    // CONTINUATION fragment (the second/third/Nth slice of a block whose
    // earlier fragments live on the prior page) shares its block's DOM
    // element with those earlier fragments. Applying `margin-top` to that
    // element would push the entire block — including the slice already
    // rendered on the prior page — downward. The spacer here is a no-op
    // anyway: continuations don't need to snap to the next page's content
    // top because their parent block already occupies it.
    if (first.fragmentIndex > 0) continue;

    const prev = layout.pages[page.index - 1]?.frames[0];
    if (!prev) continue;
    const prevBottom = prev.fragments.reduce(
      (max, f) => Math.max(max, f.y + f.heightPx),
      0
    );

    spacers.set(
      first.path[0],
      Math.max(0, input.page.heightPx - prevBottom + gapPx)
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
