// ============================================================
// pagination/layout/compose.ts
//
// Pure, deterministic page composition. Given a measured snapshot (block
// heights + line metrics) and layout input (page/margins/policies), produce a
// LayoutOutput of pages → frames → block fragments. No DOM, no document
// mutation — same input always yields identical output.
//
// Block-level, place-whole composer (option C): a top-level Slate block is the
// atomic unit. A block that fits the remaining space is placed; otherwise it
// moves whole to the next page. A block taller than a full page is placed whole
// and overflows its page (no mid-block splitting, no clones).
// ============================================================

import { buildMappingIndex } from './mapping';
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
 * Compose a {@link LayoutOutput} from a measured snapshot.
 *
 * Pure and deterministic — same input yields identical pages. Block-level,
 * place-whole: a top-level block is the atomic unit. A block that fits the
 * remaining space is placed; otherwise it moves whole to the next page. A
 * block taller than a full frame is placed at the top and overflows.
 *
 * `LayoutInput.chrome` (optional) shrinks the per-page content frame by
 * `header.heightPx + footer.heightPx` before packing and emits matching
 * per-page chrome rects on every {@link PageLayout}. See
 * `docs/plans/2026-05-29-pagination-chrome-derived-projection.md` for the
 * full chrome design.
 *
 * Margin / chrome guard (CodeRabbit PR #433): if margins + chrome sum
 * to >= the page's dimension, the content frame would be zero or negative
 * width/height — composition cannot proceed in that regime. We clamp
 * width and height to `0` and continue (blocks fall onto subsequent pages
 * until the input shrinks back into validity); we do NOT throw, because
 * the input is consumer-driven and a runtime exception would crash the
 * editor on benign edge inputs (e.g. transient layout where margins are
 * being typed). The clamp is observable via
 * `output.pages[i].frames[0].bounds.{width,height}`.
 */
export function composeLayout(
  snapshot: MeasuredSnapshot,
  input: LayoutInput
): LayoutOutput {
  const { margins, page, policies } = input;
  // Chrome shrinks the content frame BEFORE packing. Header sits between top
  // margin and content; footer sits between content and bottom margin. Both
  // are optional — undefined === 0.
  const headerHeightPx = input.chrome?.header?.heightPx ?? 0;
  const footerHeightPx = input.chrome?.footer?.heightPx ?? 0;
  // Clamp to non-negative so an invalid margin/chrome config (margins +
  // chrome >= page dimension) doesn't poison composition with a negative
  // frame. See JSDoc above for the rationale.
  const contentWidthPx = Math.max(
    0,
    page.widthPx - margins.leftPx - margins.rightPx
  );
  const contentHeightPx = Math.max(
    0,
    page.heightPx -
      margins.topPx -
      margins.bottomPx -
      headerHeightPx -
      footerHeightPx
  );
  const bounds: Rect = {
    x: margins.leftPx,
    y: margins.topPx + headerHeightPx,
    width: contentWidthPx,
    height: contentHeightPx,
  };
  const frameHeight = bounds.height;

  // Chrome rects are layout-wide constants (identical on every page), but we
  // emit them per-page so the React overlay can resolve a page's chrome to
  // document-Y via the page index without a second lookup. Undefined when no
  // chrome was configured. Per the type contract: x/widthPx are content-aligned
  // (inside left/right margins); y is page-local.
  const chromeRectsForPage = input.chrome
    ? {
        header: input.chrome.header
          ? {
              x: margins.leftPx,
              y: margins.topPx,
              heightPx: headerHeightPx,
              widthPx: contentWidthPx,
            }
          : undefined,
        footer: input.chrome.footer
          ? {
              x: margins.leftPx,
              y: page.heightPx - margins.bottomPx - footerHeightPx,
              heightPx: footerHeightPx,
              widthPx: contentWidthPx,
            }
          : undefined,
      }
    : undefined;

  const pages: PageLayout[] = [];
  let fragments: BlockFragment[] = [];
  let pageIndex = 0;
  let currentY = 0;
  let pendingReason: BreakReason | undefined;

  const flushPage = () => {
    const frame: FrameLayout = { bounds, fragments };
    pages.push({
      frames: [frame],
      index: pageIndex,
      spec: page,
      ...(chromeRectsForPage ? { chrome: chromeRectsForPage } : {}),
    });
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

  // Packing uses the rendered flow height (text + DOM box spacing) so the engine
  // fills a page like the real DOM does. Falls back to text height when the
  // measurer didn't supply margins. lineCount stays text-only for line mapping.
  const flowOf = (b: MeasuredBlock) => b.flowHeightPx ?? b.heightPx;

  const placeBlock = (b: MeasuredBlock) => {
    // Place the block whole. If it doesn't fit the remaining space and we're not
    // already at the top of a fresh page, move it whole to the next page. A
    // block taller than a full frame is placed at the top and overflows.
    const flow = flowOf(b);
    if (flow > frameHeight - currentY && fragments.length > 0) {
      breakToNewPage('block_overflow');
    }

    push({
      blockId: b.id,
      fragmentIndex: 0,
      heightPx: flow,
      lineCount: b.lineCount,
      lineStart: 0,
      path: b.path,
      y: currentY,
    });
    currentY += flow;
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
      const combined = flowOf(b) + flowOf(blocks[i + 1]);
      const remaining = frameHeight - currentY;
      if (combined > remaining && combined <= frameHeight) {
        breakToNewPage('keep_with_next');
      }
    }

    placeBlock(b);
  }

  // Emit the final (or only/empty) page.
  flushPage();

  return {
    mapping: buildMappingIndex(pages),
    metrics: { blocks: blocks.length, pages: pages.length },
    pages,
  };
}
