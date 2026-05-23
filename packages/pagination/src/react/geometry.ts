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

/** Vertically stack pages with a fixed gap (single-column mode). */
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

    for (const frame of page.frames) {
      frame.fragments.forEach((fragment, fragmentPos) => {
        const blockIndex = fragment.path[0];
        if (byBlock.has(blockIndex)) return; // keep the first fragment only

        byBlock.set(blockIndex, {
          blockIndex,
          pageIndex: page.index,
          startsPage: fragmentPos === 0,
          targetTop: placement.top + frame.bounds.y + fragment.y,
        });
      });
    }
  }

  return [...byBlock.values()].sort((a, b) => a.blockIndex - b.blockIndex);
}
