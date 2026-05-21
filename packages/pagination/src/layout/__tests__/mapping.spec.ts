import { buildMappingIndex } from '../mapping';
import type { BlockFragment, LayoutOutput, PageLayout } from '../types';

const spec = { widthPx: 794, heightPx: 1123, preset: 'a4' as const };
const bounds = { x: 96, y: 96, width: 602, height: 931 };

function frag(
  path: number[],
  fragmentIndex: number,
  lineStart: number,
  lineCount: number
): BlockFragment {
  return {
    blockId: `b${path[0]}`,
    fragmentIndex,
    heightPx: lineCount * 20,
    lineCount,
    lineStart,
    path,
    y: 0,
  };
}
function page(index: number, fragments: BlockFragment[]): PageLayout {
  return { frames: [{ bounds, fragments }], index, spec };
}
function out(pages: PageLayout[]): LayoutOutput {
  return { metrics: { blocks: 0, pages: pages.length }, pages };
}

// Block 0: whole on page 0. Block 1: split across pages 0,1,2 (lines 0-9,10-19,20-24).
const layout = out([
  page(0, [frag([0], 0, 0, 5), frag([1], 0, 0, 10)]),
  page(1, [frag([1], 1, 10, 10)]),
  page(2, [frag([1], 2, 20, 5)]),
]);

describe('buildMappingIndex', () => {
  it('returns all fragments of a block across pages, in order', () => {
    const idx = buildMappingIndex(layout);
    const refs = idx.fragmentsOfBlock(1);
    expect(refs.map((r) => r.pageIndex)).toEqual([0, 1, 2]);
    expect(refs.map((r) => r.fragment.lineStart)).toEqual([0, 10, 20]);
  });

  it('pageOfBlock returns the first fragment page', () => {
    const idx = buildMappingIndex(layout);
    expect(idx.pageOfBlock(0)).toBe(0);
    expect(idx.pageOfBlock(1)).toBe(0);
    expect(idx.pageOfBlock(99)).toBeNull();
  });

  it('maps a block line to its containing page (caret mapping)', () => {
    const idx = buildMappingIndex(layout);
    expect(idx.pageOfBlockLine(1, 3)).toBe(0); // line 3 → first fragment
    expect(idx.pageOfBlockLine(1, 12)).toBe(1); // line 12 → second fragment
    expect(idx.pageOfBlockLine(1, 24)).toBe(2); // last line → third fragment
    expect(idx.pageOfBlockLine(1, 999)).toBeNull(); // out of range
  });

  it('fragmentOfBlockLine returns the fragment ref containing the line', () => {
    const idx = buildMappingIndex(layout);
    const ref = idx.fragmentOfBlockLine(1, 12);
    expect(ref?.pageIndex).toBe(1);
    expect(ref?.fragment.fragmentIndex).toBe(1);
  });

  it('isSplit reports blocks spanning multiple pages', () => {
    const idx = buildMappingIndex(layout);
    expect(idx.isSplit(0)).toBe(false);
    expect(idx.isSplit(1)).toBe(true);
  });
});
