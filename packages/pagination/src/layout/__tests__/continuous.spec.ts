import { composeLayout } from '../compose';
import { getContinuousBreakYs } from '../continuous';
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
