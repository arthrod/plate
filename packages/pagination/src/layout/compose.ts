// ============================================================
// pagination/layout/compose.ts
//
// Pure, deterministic page composition. Given a measured snapshot (block
// heights + line metrics) and layout input (page/margins/policies), produce a
// LayoutOutput of pages → frames → block fragments. No DOM, no document
// mutation — same input always yields identical output.
//
// Block-level adaptation of premirror's line-fill composer: a top-level Slate
// block is the atomic unit, and a tall splittable block is fragmented across
// pages by its measured line height.
// ============================================================

import type {
  BlockFragment,
  BreakReason,
  FrameLayout,
  LayoutInput,
  LayoutOutput,
  MeasuredBlock,
  MeasuredSnapshot,
  PageLayout,
  Rect,
} from './types';

/**
 * How many of `remainingLines` may sit at the bottom of the current page given
 * `cap` lines of physical room, honoring widow/orphan minimums. Returns 0 to
 * push the whole (remaining) block to the next page.
 */
function linesToPlace(
  remainingLines: number,
  cap: number,
  widowMin: number,
  orphanMin: number
): number {
  if (cap >= remainingLines) return remainingLines;
  if (cap <= 0) return 0;
  // Orphan guard: too few lines would be stranded at the bottom.
  if (cap < orphanMin) return 0;
  // Widow guard: ensure the next page keeps at least `widowMin` lines.
  if (remainingLines - cap < widowMin) {
    const alt = remainingLines - widowMin;
    return alt >= orphanMin ? alt : 0;
  }
  return cap;
}

export function composeLayout(
  snapshot: MeasuredSnapshot,
  input: LayoutInput
): LayoutOutput {
  const { margins, page, policies } = input;
  const bounds: Rect = {
    x: margins.leftPx,
    y: margins.topPx,
    width: page.widthPx - margins.leftPx - margins.rightPx,
    height: page.heightPx - margins.topPx - margins.bottomPx,
  };
  const frameHeight = bounds.height;
  const widowMin = policies.widowLinesMin;
  const orphanMin = policies.orphanLinesMin;

  const pages: PageLayout[] = [];
  let fragments: BlockFragment[] = [];
  let pageIndex = 0;
  let currentY = 0;
  let pendingReason: BreakReason | undefined;

  const flushPage = () => {
    const frame: FrameLayout = { bounds, fragments };
    pages.push({ frames: [frame], index: pageIndex, spec: page });
    pageIndex += 1;
    currentY = 0;
    fragments = [];
  };
  const breakToNewPage = (reason: BreakReason) => {
    flushPage();
    pendingReason = reason;
  };
  const push = (frag: Omit<BlockFragment, 'breakReason'>) => {
    const breakReason = fragments.length === 0 ? pendingReason : undefined;
    fragments.push({ ...frag, breakReason });
    pendingReason = undefined;
  };

  const placeBlock = (b: MeasuredBlock) => {
    const splittable = b.splittable !== false;

    if (b.heightPx <= frameHeight - currentY) {
      push({
        blockId: b.id,
        fragmentIndex: 0,
        heightPx: b.heightPx,
        lineCount: b.lineCount,
        lineStart: 0,
        path: b.path,
        y: currentY,
      });
      currentY += b.heightPx;

      return;
    }

    if (!splittable) {
      // Move the whole block to a fresh page (unless already at the top, in
      // which case it overflows the page — nothing better we can do).
      if (fragments.length > 0) breakToNewPage('block_overflow');
      push({
        blockId: b.id,
        fragmentIndex: 0,
        heightPx: b.heightPx,
        lineCount: b.lineCount,
        lineStart: 0,
        path: b.path,
        y: currentY,
      });
      currentY += b.heightPx;

      return;
    }

    // Splittable: emit fragments across pages by measured line height.
    const lineHeight = b.lineHeightPx;
    const total = b.lineCount;
    let placed = 0;
    let fragmentIndex = 0;

    while (placed < total) {
      const cap = Math.floor((frameHeight - currentY) / lineHeight);
      const remainingLines = total - placed;
      let fit = linesToPlace(remainingLines, cap, widowMin, orphanMin);

      if (fit <= 0) {
        if (fragments.length === 0) {
          // Fresh page and still nothing fits (block taller than a full frame):
          // force at least one chunk to make progress.
          fit = cap >= remainingLines ? remainingLines : Math.max(1, cap);
        } else {
          breakToNewPage(
            cap > 0 && cap < orphanMin ? 'widow_orphan' : 'block_overflow'
          );
          continue;
        }
      }

      const heightPx = fit * lineHeight;
      push({
        blockId: b.id,
        fragmentIndex,
        heightPx,
        lineCount: fit,
        lineStart: placed,
        path: b.path,
        y: currentY,
      });
      placed += fit;
      fragmentIndex += 1;
      currentY += heightPx;

      if (placed < total) flushPage();
    }
  };

  const blocks = snapshot.blocks;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];

    if (b.breakBefore && fragments.length > 0) breakToNewPage('manual_break');

    if (
      policies.keepWithNextEnabled &&
      b.keepWithNext &&
      i + 1 < blocks.length &&
      fragments.length > 0
    ) {
      const combined = b.heightPx + blocks[i + 1].heightPx;
      const remaining = frameHeight - currentY;
      if (combined > remaining && combined <= frameHeight) {
        breakToNewPage('keep_with_next');
      }
    }

    placeBlock(b);
  }

  // Emit the final (or only/empty) page.
  flushPage();

  return { metrics: { blocks: blocks.length, pages: pages.length }, pages };
}
