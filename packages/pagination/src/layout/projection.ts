// ============================================================
// pagination/layout/projection.ts
//
// Project layout fragments / caret lines into absolute stack coordinates,
// using the MappingIndex + page geometry. Pure. Consumed by split-block
// rendering (fragmentRects) and caret/selection placement (blockLinePosition).
// ============================================================

import type { PageGeometry } from '../react/geometry';
import type { LayoutOutput } from './types';

export type FragmentRect = {
  pageIndex: number;
  fragmentIndex: number;
  lineStart: number;
  lineCount: number;
  left: number;
  top: number;
  width: number;
  height: number;
};

export type LinePosition = {
  pageIndex: number;
  left: number;
  top: number;
};

/**
 * Absolute stack rects for every fragment of a (possibly split) block.
 *
 * Reads `layout.mapping` (the prebuilt {@link MappingIndex}) for the block's
 * fragments and projects each one onto its page's placement frame. Returns
 * one rect per fragment in document order; an unsplit block yields exactly
 * one rect. Empty array when the block is missing from the layout or sits on
 * a page that geometry hasn't placed.
 *
 * @param layout      output of `composeLayout` (carries the mapping index)
 * @param geometry    output of `getPageGeometry` (carries page placements)
 * @param blockIndex  top-level block index (`path[0]`)
 * @returns           one absolute stack-coordinate rect per fragment
 */
export function fragmentRects(
  layout: LayoutOutput,
  geometry: PageGeometry,
  blockIndex: number
): FragmentRect[] {
  const rects: FragmentRect[] = [];

  for (const ref of layout.mapping.fragmentsOfBlock(blockIndex)) {
    const placement = geometry.placements[ref.pageIndex];
    const frame = layout.pages[ref.pageIndex]?.frames[ref.frameIndex];
    if (!placement || !frame) continue;

    rects.push({
      fragmentIndex: ref.fragment.fragmentIndex,
      height: ref.fragment.heightPx,
      left: placement.left + frame.bounds.x,
      lineCount: ref.fragment.lineCount,
      lineStart: ref.fragment.lineStart,
      pageIndex: ref.pageIndex,
      top: placement.top + frame.bounds.y + ref.fragment.y,
      width: frame.bounds.width,
    });
  }

  return rects;
}

/**
 * Absolute stack position of a given (0-based) visual line within a block.
 *
 * Finds which fragment holds the requested `lineIndex` (a block may span
 * multiple page fragments), projects that fragment's origin into stack
 * coordinates, then advances by `(lineIndex - fragment.lineStart) *
 * lineHeightPx` to land on the line itself. Useful for caret + selection
 * placement across page boundaries.
 *
 * @param layout      output of `composeLayout`
 * @param geometry    output of `getPageGeometry`
 * @param blockIndex  top-level block index (`path[0]`)
 * @param line        `{ lineIndex, lineHeightPx }` for the target line
 * @returns           `{ pageIndex, left, top }` in stack coords, or `null`
 *                    if the line falls outside the laid-out range
 */
export function blockLinePosition(
  layout: LayoutOutput,
  geometry: PageGeometry,
  blockIndex: number,
  line: { lineIndex: number; lineHeightPx: number }
): LinePosition | null {
  const ref = layout.mapping.fragmentOfBlockLine(blockIndex, line.lineIndex);
  if (!ref) return null;

  const placement = geometry.placements[ref.pageIndex];
  const frame = layout.pages[ref.pageIndex]?.frames[ref.frameIndex];
  if (!placement || !frame) return null;

  return {
    left: placement.left + frame.bounds.x,
    pageIndex: ref.pageIndex,
    top:
      placement.top +
      frame.bounds.y +
      ref.fragment.y +
      (line.lineIndex - ref.fragment.lineStart) * line.lineHeightPx,
  };
}
