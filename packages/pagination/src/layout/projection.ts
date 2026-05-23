// ============================================================
// pagination/layout/projection.ts
//
// Project layout fragments / caret lines into absolute stack coordinates,
// using the MappingIndex + page geometry. Pure. Consumed by split-block
// rendering (fragmentRects) and caret/selection placement (blockLinePosition).
// ============================================================

import type { PageGeometry } from '../react/geometry';
import { buildMappingIndex } from './mapping';
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

/** Absolute stack rects for every fragment of a (possibly split) block. */
export function fragmentRects(
  layout: LayoutOutput,
  geometry: PageGeometry,
  blockIndex: number
): FragmentRect[] {
  const mapping = buildMappingIndex(layout);
  const rects: FragmentRect[] = [];

  for (const ref of mapping.fragmentsOfBlock(blockIndex)) {
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

/** Absolute stack position of a given (0-based) line within a block. */
export function blockLinePosition(
  layout: LayoutOutput,
  geometry: PageGeometry,
  blockIndex: number,
  lineIndex: number,
  lineHeightPx: number
): LinePosition | null {
  const mapping = buildMappingIndex(layout);
  const ref = mapping.fragmentOfBlockLine(blockIndex, lineIndex);
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
      (lineIndex - ref.fragment.lineStart) * lineHeightPx,
  };
}
