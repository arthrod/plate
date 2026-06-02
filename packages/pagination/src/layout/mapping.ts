// ============================================================
// pagination/layout/mapping.ts
//
// Bidirectional-ish index over a LayoutOutput: locate which page/fragment a
// top-level block (or a line within it) lands on. This is the foundation for
// (a) rendering blocks that split across pages and (b) projecting the caret /
// selection onto pages.
// ============================================================

import type { BlockFragment, PageLayout } from './types';

export type FragmentRef = {
  pageIndex: number;
  frameIndex: number;
  fragment: BlockFragment;
};

export type MappingIndex = {
  /** All fragments of a top-level block (path[0]), in document/page order. */
  fragmentsOfBlock: (blockIndex: number) => FragmentRef[];
  /** Page index of a block's first fragment, or null if absent. */
  pageOfBlock: (blockIndex: number) => number | null;
  /** Page index containing a given (0-based) line of a block, or null. */
  pageOfBlockLine: (blockIndex: number, lineIndex: number) => number | null;
  /** Fragment ref containing a given line of a block, or null. */
  fragmentOfBlockLine: (
    blockIndex: number,
    lineIndex: number
  ) => FragmentRef | null;
  /** Whether the block spans more than one page. */
  isSplit: (blockIndex: number) => boolean;
};

/**
 * Build a {@link MappingIndex} over a composed page list — a once-per-layout
 * scan that lets consumers ask "which page is block N on?" and "which fragment
 * holds line L of block N?" in O(refs-of-block) without re-scanning every page.
 *
 * The returned index is the only safe way to project block + line locations
 * onto pages, because it stores the POSITIONAL index of each page in the
 * `pages` array (see CodeRabbit PR #438). Consumers downstream dereference
 * `layout.pages[ref.pageIndex]` and `geometry.placements[ref.pageIndex]` as
 * array offsets, so deriving the index from `page.index` (which the composer
 * is free to renumber for skipped covers etc.) would silently drop projections
 * the moment those two diverge.
 *
 * @param pages  the ordered page list from `composeLayout`
 * @returns      lookup interface; see {@link MappingIndex}
 */
export function buildMappingIndex(pages: PageLayout[]): MappingIndex {
  const byBlock = new Map<number, FragmentRef[]>();

  // CodeRabbit PR #438: store the POSITIONAL pages-array index, not
  // `page.index`. Consumers downstream dereference `layout.pages[ref.pageIndex]`
  // and `geometry.placements[ref.pageIndex]` as array offsets. If a future
  // composer ever emits non-contiguous `page.index` values (skipped covers,
  // re-numbering), the two diverge and projections silently drop.
  pages.forEach((page, positionalIndex) => {
    page.frames.forEach((frame, frameIndex) => {
      for (const fragment of frame.fragments) {
        const blockIndex = fragment.path[0];
        const refs = byBlock.get(blockIndex);
        const ref: FragmentRef = {
          fragment,
          frameIndex,
          pageIndex: positionalIndex,
        };
        if (refs) refs.push(ref);
        else byBlock.set(blockIndex, [ref]);
      }
    });
  });

  const fragmentsOfBlock = (blockIndex: number): FragmentRef[] =>
    byBlock.get(blockIndex) ?? [];

  const fragmentOfBlockLine = (
    blockIndex: number,
    lineIndex: number
  ): FragmentRef | null => {
    for (const ref of fragmentsOfBlock(blockIndex)) {
      const { lineCount, lineStart } = ref.fragment;
      if (lineIndex >= lineStart && lineIndex < lineStart + lineCount) {
        return ref;
      }
    }

    return null;
  };

  return {
    fragmentOfBlockLine,
    fragmentsOfBlock,
    isSplit: (blockIndex) => {
      const refs = fragmentsOfBlock(blockIndex);

      return new Set(refs.map((r) => r.pageIndex)).size > 1;
    },
    pageOfBlock: (blockIndex) =>
      fragmentsOfBlock(blockIndex)[0]?.pageIndex ?? null,
    pageOfBlockLine: (blockIndex, lineIndex) =>
      fragmentOfBlockLine(blockIndex, lineIndex)?.pageIndex ?? null,
  };
}
