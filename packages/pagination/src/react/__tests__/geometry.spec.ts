import { buildMappingIndex } from '../../layout/mapping';
import type { LayoutOutput, PageLayout } from '../../layout/types';
import { getBlockPlacements, getPageGeometry } from '../geometry';

const spec = { widthPx: 794, heightPx: 1123, preset: 'a4' as const };
const bounds = { x: 96, y: 96, width: 602, height: 931 };

function page(index: number, fragments: any[]): PageLayout {
  return { frames: [{ bounds, fragments }], index, spec };
}
function out(pages: PageLayout[]): LayoutOutput {
  return {
    mapping: buildMappingIndex(pages),
    metrics: { blocks: 0, pages: pages.length },
    pages,
  };
}

describe('getPageGeometry', () => {
  it('stacks pages vertically with the gap', () => {
    const geo = getPageGeometry(out([page(0, []), page(1, [])]), 24);
    expect(geo.placements.map((p) => p.top)).toEqual([0, 1123 + 24]);
    expect(geo.width).toBe(794);
    expect(geo.height).toBe(1123 + 24 + 1123); // gap not counted after last
  });
});

describe('getBlockPlacements', () => {
  it('maps each block to its first fragment top in stack coords', () => {
    const layout = out([
      page(0, [
        {
          blockId: 'a',
          path: [0],
          fragmentIndex: 0,
          lineStart: 0,
          lineCount: 1,
          y: 0,
          heightPx: 100,
        },
        {
          blockId: 'b',
          path: [1],
          fragmentIndex: 0,
          lineStart: 0,
          lineCount: 1,
          y: 100,
          heightPx: 100,
        },
      ]),
      page(1, [
        {
          blockId: 'c',
          path: [2],
          fragmentIndex: 0,
          lineStart: 0,
          lineCount: 1,
          y: 0,
          heightPx: 100,
        },
      ]),
    ]);
    const geo = getPageGeometry(layout, 24);
    const placements = getBlockPlacements(layout, geo);

    expect(placements.map((p) => p.blockIndex)).toEqual([0, 1, 2]);
    // block a: page0 top(0) + frame.y(96) + frag.y(0) = 96
    expect(placements[0]).toMatchObject({
      pageIndex: 0,
      targetTop: 96,
      startsPage: true,
    });
    // block b: 0 + 96 + 100 = 196, not page start
    expect(placements[1]).toMatchObject({
      pageIndex: 0,
      targetTop: 196,
      startsPage: false,
    });
    // block c: page1 top(1147) + 96 + 0 = 1243, page start
    expect(placements[2]).toMatchObject({
      pageIndex: 1,
      targetTop: 1123 + 24 + 96,
      startsPage: true,
    });
  });
});
