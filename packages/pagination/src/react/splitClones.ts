// ============================================================
// pagination/react/splitClones.ts
//
// Approach #1 — per-fragment clipped clones. A block taller than a page can't
// be shown straddling page boxes by the single Editable, so:
//   - the LIVE block is clipped to its first fragment's height (stays in flow,
//     editable), and
//   - each later fragment is drawn as a read-only clone, clipped to its lines
//     and shifted up so the right slice shows, positioned on its page.
//
// `computeSplitPlan` is the pure planning step (testable); the DOM application
// (cloning nodes + positioning) lives in renderSplitClones.
// ============================================================

import { buildMappingIndex } from '../layout/mapping';
import { fragmentRects } from '../layout/projection';
import type { LayoutOutput } from '../layout/types';
import { topLevelBlockElements } from './domMeasure';
import type { PageGeometry } from './geometry';

export type SplitRenderOptions = {
  contentHeightPx: number;
  marginTopPx: number;
  marginLeftPx: number;
  contentWidthPx: number;
};

export type CloneSpec = {
  blockIndex: number;
  fragmentIndex: number;
  pageIndex: number;
  /** Absolute stack rect of the clip window. */
  top: number;
  left: number;
  width: number;
  height: number;
  /** Upward shift (px) applied to the cloned content to reveal this slice. */
  translateY: number;
};

export type SplitRenderPlan = {
  clones: CloneSpec[];
  /** blockIndex → height (px) to clip the live (in-flow) block to. */
  liveClipHeight: Map<number, number>;
};

export function computeSplitPlan(
  layout: LayoutOutput,
  geometry: PageGeometry
): SplitRenderPlan {
  const clones: CloneSpec[] = [];
  const liveClipHeight = new Map<number, number>();

  const blockIndices = new Set<number>();
  for (const page of layout.pages) {
    for (const frame of page.frames) {
      for (const fragment of frame.fragments)
        blockIndices.add(fragment.path[0]);
    }
  }

  for (const blockIndex of blockIndices) {
    const rects = fragmentRects(layout, geometry, blockIndex);
    if (rects.length <= 1) continue; // not split

    // Live block keeps the first fragment; clip it to that height.
    liveClipHeight.set(blockIndex, rects[0].height);

    for (let i = 1; i < rects.length; i++) {
      const rect = rects[i];
      const lineHeightPx = rect.height / Math.max(1, rect.lineCount);
      clones.push({
        blockIndex,
        fragmentIndex: rect.fragmentIndex,
        height: rect.height,
        left: rect.left,
        pageIndex: rect.pageIndex,
        top: rect.top,
        translateY: -(rect.lineStart * lineHeightPx),
        width: rect.width,
      });
    }
  }

  return { clones, liveClipHeight };
}

function makeCloneWindow(
  source: HTMLElement,
  id: string,
  rect: { top: number; left: number; width: number; height: number },
  translateY: number
): HTMLElement {
  const win = document.createElement('div');
  win.setAttribute('data-pagination-clone', id);
  Object.assign(win.style, {
    height: `${rect.height}px`,
    left: `${rect.left}px`,
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    top: `${rect.top}px`,
    width: `${rect.width}px`,
  });

  const inner = source.cloneNode(true) as HTMLElement;
  inner.removeAttribute('contenteditable');
  for (const node of inner.querySelectorAll('[contenteditable]')) {
    node.removeAttribute('contenteditable');
  }
  inner.style.maxHeight = '';
  inner.style.overflow = '';
  inner.style.marginTop = '';
  inner.style.width = `${rect.width}px`;
  inner.style.transform = `translateY(${translateY}px)`;

  win.append(inner);

  return win;
}

/**
 * Render blocks that span pages as clipped read-only clones, slicing in REAL
 * measured pixels (the live block's rendered top/height + page geometry) rather
 * than the layout's uniform-line estimate — this keeps the live→clone and
 * clone→clone junctions seamless. The live block stays editable, clipped to the
 * portion that fits its first page; each later page gets a clone of the next
 * slice. Idempotent.
 */
export function renderSplitClones(
  editable: HTMLElement,
  overlay: HTMLElement,
  layout: LayoutOutput,
  geometry: PageGeometry,
  options: SplitRenderOptions
): void {
  const { contentHeightPx, contentWidthPx, marginLeftPx, marginTopPx } =
    options;
  const mapping = buildMappingIndex(layout);
  const blocks = topLevelBlockElements(editable);

  // Reset clips so we measure true (unclipped) heights, and clear old clones.
  for (const el of blocks) {
    el.style.maxHeight = '';
    el.style.overflow = '';
  }
  overlay.replaceChildren();

  const originTop = overlay.getBoundingClientRect().top;
  const pageContentTop = (p: number) =>
    geometry.placements[p].top + marginTopPx;
  const pageContentLeft = (p: number) =>
    geometry.placements[p].left + marginLeftPx;

  blocks.forEach((el, blockIndex) => {
    if (!mapping.isSplit(blockIndex)) return;

    const blockTop = el.getBoundingClientRect().top;
    const realTop = blockTop - originTop;
    const realHeight = el.scrollHeight;

    // Line boundaries (relative to block top) so slices never cut a line.
    const lineBottoms = collectLineBottoms(el, blockTop, realHeight);
    // Largest line bottom that fits within `limit` and advances past `from`.
    const snap = (limit: number, from: number) => {
      let best = 0;
      for (const b of lineBottoms) if (b <= limit + 0.5 && b > from) best = b;

      return best > from ? best : Math.min(realHeight, limit);
    };

    let pageIndex = geometry.placements.findIndex(
      (p) =>
        realTop >= p.top + marginTopPx - 1 &&
        realTop < p.top + marginTopPx + contentHeightPx + 1
    );
    if (pageIndex < 0) pageIndex = 0;

    // Live block keeps the lines that fit the rest of its starting page.
    let offset = snap(pageContentTop(pageIndex) + contentHeightPx - realTop, 0);
    el.style.maxHeight = `${Math.max(0, offset)}px`;
    el.style.overflow = 'hidden';

    let cloneIndex = 1;
    for (
      let p = pageIndex + 1;
      offset < realHeight - 0.5 && p < geometry.placements.length;
      p++
    ) {
      const end = snap(offset + contentHeightPx, offset);
      overlay.append(
        makeCloneWindow(
          el,
          `${blockIndex}:${cloneIndex}`,
          {
            height: end - offset,
            left: pageContentLeft(p),
            top: pageContentTop(p),
            width: contentWidthPx,
          },
          -offset
        )
      );
      offset = end;
      cloneIndex += 1;
    }
  });
}

/** Cumulative line bottoms (px, relative to block top) via Range client rects. */
function collectLineBottoms(
  el: HTMLElement,
  blockTop: number,
  realHeight: number
): number[] {
  const range = document.createRange();
  range.selectNodeContents(el);

  const bottoms: number[] = [];
  for (const rect of range.getClientRects()) {
    const bottom = rect.bottom - blockTop;
    if (bottom <= 0) continue;
    if (bottoms.length === 0 || bottom - bottoms[bottoms.length - 1] > 1) {
      bottoms.push(bottom);
    }
  }
  if (bottoms.length === 0 || bottoms[bottoms.length - 1] < realHeight - 1) {
    bottoms.push(realHeight);
  }

  return bottoms;
}
