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

export function buildMappingIndex(pages: PageLayout[]): MappingIndex {
  const byBlock = new Map<number, FragmentRef[]>();

  pages.forEach((page) => {
    page.frames.forEach((frame, frameIndex) => {
      for (const fragment of frame.fragments) {
        const blockIndex = fragment.path[0];
        const refs = byBlock.get(blockIndex);
        const ref: FragmentRef = {
          fragment,
          frameIndex,
          pageIndex: page.index,
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
