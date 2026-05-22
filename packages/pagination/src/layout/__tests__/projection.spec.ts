import { getPageGeometry } from '../../react/geometry';
import { blockLinePosition, fragmentRects } from '../projection';
import type { BlockFragment, LayoutOutput, PageLayout } from '../types';

const spec = { widthPx: 794, heightPx: 1123, preset: 'a4' as const };
const bounds = { x: 96, y: 96, width: 602, height: 931 };

function frag(
  path: number[],
  parts: {
    fragmentIndex: number;
    lineStart: number;
    lineCount: number;
    y: number;
  }
): BlockFragment {
  const { fragmentIndex, lineCount, lineStart, y } = parts;

  return {
    blockId: `b${path[0]}`,
    fragmentIndex,
    heightPx: lineCount * 20,
    lineCount,
    lineStart,
    path,
    y,
  };
}
function page(index: number, fragments: BlockFragment[]): PageLayout {
  return { frames: [{ bounds, fragments }], index, spec };
}
const layout: LayoutOutput = {
  metrics: { blocks: 2, pages: 2 },
  pages: [
    page(0, [
      frag([0], { fragmentIndex: 0, lineStart: 0, lineCount: 5, y: 0 }),
      frag([1], { fragmentIndex: 0, lineStart: 0, lineCount: 40, y: 100 }),
    ]),
    page(1, [
      frag([1], { fragmentIndex: 1, lineStart: 40, lineCount: 6, y: 0 }),
    ]),
  ],
};
const geo = getPageGeometry(layout, 24);

describe('fragmentRects', () => {
  it('returns absolute stack rects for each fragment of a split block', () => {
    const rects = fragmentRects(layout, geo, 1);
    expect(rects).toHaveLength(2);
    // fragment 0: page0.top(0) + frame.y(96) + frag.y(100) = 196
    expect(rects[0]).toMatchObject({
      pageIndex: 0,
      top: 196,
      left: 96,
      width: 602,
    });
    // fragment 1: page1.top(1147) + 96 + 0 = 1243
    expect(rects[1]).toMatchObject({ pageIndex: 1, top: 1147 + 96 });
  });
});

describe('blockLinePosition', () => {
  it('maps a block line to its absolute stack position', () => {
    // block 1, line 2 (in fragment 0, lineStart 0): top = 196 + (2-0)*20 = 236
    expect(
      blockLinePosition(layout, geo, 1, { lineIndex: 2, lineHeightPx: 20 })
    ).toMatchObject({
      pageIndex: 0,
      top: 236,
    });
    // block 1, line 42 (in fragment 1, lineStart 40): top = 1243 + (42-40)*20 = 1283
    expect(
      blockLinePosition(layout, geo, 1, { lineIndex: 42, lineHeightPx: 20 })
    ).toMatchObject({
      pageIndex: 1,
      top: 1147 + 96 + 40,
    });
  });

  it('returns null for an out-of-range line', () => {
    expect(
      blockLinePosition(layout, geo, 1, { lineIndex: 999, lineHeightPx: 20 })
    ).toBeNull();
  });
});
