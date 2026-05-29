// ============================================================
// pagination/react/geometry.ts
//
// Pure projection of a LayoutOutput into on-screen page placements + per-block
// target positions. Used by the overlay renderer to draw page chrome and to
// align the editable content to page frames. No DOM.
// ============================================================

import type { LayoutOutput } from '../layout/types';

export const PAGE_STACK_GAP_PX = 24;

export type PagePlacement = {
  index: number;
  left: number;
  top: number;
  width: number;
  height: number;
};

export type PageGeometry = {
  placements: PagePlacement[];
  /** Total width of the stacked pages (max page width). */
  width: number;
  /** Total height of the stacked pages (incl. inter-page gaps). */
  height: number;
};

/**
 * Vertically stack pages with a fixed inter-page gap (single-column mode) —
 * the geometry projection used by the continuous-view overlay to position
 * each page's chrome (header / footer) and break-line in stack coordinates.
 *
 * Each placement is `{ left: 0, top, width: spec.widthPx, height: spec.heightPx }`
 * where `top` advances by `spec.heightPx + gapPx` per page. The container's
 * total width is the max page width; total height excludes the trailing gap.
 *
 * @param layout  output of `composeLayout`
 * @param gapPx   inter-page visual gap (defaults to {@link PAGE_STACK_GAP_PX})
 * @returns       `{ placements, width, height }` in stack coordinates
 */
export function getPageGeometry(
  layout: LayoutOutput,
  gapPx: number = PAGE_STACK_GAP_PX
): PageGeometry {
  const placements: PagePlacement[] = [];
  let top = 0;
  let width = 0;

  for (const page of layout.pages) {
    placements.push({
      height: page.spec.heightPx,
      index: page.index,
      left: 0,
      top,
      width: page.spec.widthPx,
    });
    top += page.spec.heightPx + gapPx;
    width = Math.max(width, page.spec.widthPx);
  }

  return { height: Math.max(0, top - gapPx), placements, width };
}

export type BlockPlacement = {
  /** Top-level block index (path[0]). */
  blockIndex: number;
  pageIndex: number;
  /** Absolute top of the block's first fragment, in stack coordinates. */
  targetTop: number;
  /** Whether this block starts a page (first fragment on its page). */
  startsPage: boolean;
};

/**
 * For each top-level block, where its first fragment lands in stack coordinates
 * (page top + content-frame y + fragment y). Drives spacer alignment so each
 * page-starting block snaps to the next page's content-frame top.
 */
export function getBlockPlacements(
  layout: LayoutOutput,
  geometry: PageGeometry
): BlockPlacement[] {
  const byBlock = new Map<number, BlockPlacement>();

  for (const page of layout.pages) {
    const placement = geometry.placements[page.index];
    if (!placement) continue;

    // CodeRabbit PR #433: `startsPage` must be PAGE-local, not frame-local.
    // Multi-frame pages previously marked the first fragment of EVERY frame
    // as a page starter, which falsely promoted later-frame blocks as if
    // they had crossed a page boundary. Track the per-page fragment counter.
    let pageFragmentSeen = 0;
    for (const frame of page.frames) {
      frame.fragments.forEach((fragment) => {
        const blockIndex = fragment.path[0];
        const isFirstOfPage = pageFragmentSeen === 0;
        pageFragmentSeen += 1;
        if (byBlock.has(blockIndex)) return; // keep the first fragment only

        byBlock.set(blockIndex, {
          blockIndex,
          pageIndex: page.index,
          startsPage: isFirstOfPage,
          targetTop: placement.top + frame.bounds.y + fragment.y,
        });
      });
    }
  }

  return [...byBlock.values()].sort((a, b) => a.blockIndex - b.blockIndex);
}
