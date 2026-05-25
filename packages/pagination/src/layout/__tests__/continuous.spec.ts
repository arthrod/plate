import { composeLayout } from '../compose';
import { getContinuousBreaks, getContinuousBreakYs } from '../continuous';
import type { LayoutInput, MeasuredBlock, MeasuredSnapshot } from '../types';

const INPUT: LayoutInput = {
  margins: { bottomPx: 96, leftPx: 96, rightPx: 96, topPx: 96 },
  page: { heightPx: 1123, preset: 'a4', widthPx: 794 },
  policies: { keepWithNextEnabled: true, orphanLinesMin: 2, widowLinesMin: 2 },
};

function block(heightPx: number, path: number[]): MeasuredBlock {
  return { heightPx, id: `b${path[0]}`, lineCount: 1, lineHeightPx: 20, path };
}
function snap(...blocks: MeasuredBlock[]): MeasuredSnapshot {
  return { blocks };
}

describe('getContinuousBreakYs', () => {
  it('returns the continuous-flow Y at each interior page boundary', () => {
    // content height = 931. page0=[700]; 400 doesn't fit (1100>931) → page1=[400,400].
    const layout = composeLayout(
      snap(block(700, [0]), block(400, [1]), block(400, [2])),
      INPUT
    );
    // one interior boundary, after the 700px block.
    expect(getContinuousBreakYs(layout)).toEqual([700]);
  });

  it('returns no break lines for a single page', () => {
    const layout = composeLayout(snap(block(100, [0])), INPUT);
    expect(getContinuousBreakYs(layout)).toEqual([]);
  });
});

describe('getContinuousBreaks', () => {
  it('points each interior break at the block that begins the next page', () => {
    // page0=[b0]; b1 doesn't fit (700+400 > 931) → page1=[b1,b2].
    const layout = composeLayout(
      snap(block(700, [0]), block(400, [1]), block(400, [2])),
      INPUT
    );
    // one interior boundary: the next page begins at whole block index 1.
    expect(getContinuousBreaks(layout)).toEqual([
      { blockIndex: 1, lineStart: 0 },
    ]);
  });

  it('returns no breaks for a single page', () => {
    const layout = composeLayout(snap(block(100, [0])), INPUT);
    expect(getContinuousBreaks(layout)).toEqual([]);
  });

  it('produces 2 breaks for 3 pages', () => {
    // Each 900px block exceeds 931/2=465 remaining after the previous, so they
    // each go to their own page.
    const layout = composeLayout(
      snap(block(900, [0]), block(900, [1]), block(900, [2])),
      INPUT
    );
    const breaks = getContinuousBreaks(layout);
    expect(breaks).toHaveLength(2);
    expect(breaks[0]).toEqual({ blockIndex: 1, lineStart: 0 });
    expect(breaks[1]).toEqual({ blockIndex: 2, lineStart: 0 });
  });

  it('lineStart is 0 for whole-block boundaries (place-whole mode)', () => {
    // In place-whole mode, every fragment starts at lineStart=0 (no mid-block
    // split), so every break's lineStart must be 0.
    const layout = composeLayout(
      snap(block(700, [0]), block(700, [1])),
      INPUT
    );
    const breaks = getContinuousBreaks(layout);
    expect(breaks.every((b) => b.lineStart === 0)).toBe(true);
  });

  it('getContinuousBreakYs sums fragment heights across frames correctly', () => {
    // Page 0 contains a 700px block; page 1 contains two 200px blocks.
    // Total page-0 contribution = 700.
    const layout = composeLayout(
      snap(block(700, [0]), block(200, [1]), block(200, [2])),
      INPUT
    );
    const ys = getContinuousBreakYs(layout);
    // Only one interior boundary; cumulative after page 0 = 700.
    expect(ys).toEqual([700]);
  });
});
