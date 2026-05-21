import type {
  BlockFragment,
  LayoutOutput,
  PageLayout,
} from '../../layout/types';
import { getPageGeometry } from '../geometry';
import { computeSplitPlan } from '../splitClones';

const spec = { widthPx: 794, heightPx: 1123, preset: 'a4' as const };
const bounds = { x: 96, y: 96, width: 602, height: 931 };

function frag(
  path: number[],
  fragmentIndex: number,
  lineStart: number,
  lineCount: number,
  y: number
): BlockFragment {
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

// Block 0: whole on page 0. Block 1: split across pages 0,1,2.
const layout: LayoutOutput = {
  metrics: { blocks: 2, pages: 3 },
  pages: [
    page(0, [frag([0], 0, 0, 5, 0), frag([1], 0, 0, 10, 100)]),
    page(1, [frag([1], 1, 10, 10, 0)]),
    page(2, [frag([1], 2, 20, 5, 0)]),
  ],
};
const geo = getPageGeometry(layout, 24);

describe('computeSplitPlan', () => {
  it('clips the live block to its first fragment height', () => {
    const plan = computeSplitPlan(layout, geo);
    expect(plan.liveClipHeight.get(1)).toBe(200); // fragment 0 = 10 lines * 20
    expect(plan.liveClipHeight.has(0)).toBe(false); // unsplit block: no clip
  });

  it('emits a clone for every fragment after the first', () => {
    const plan = computeSplitPlan(layout, geo);
    const forBlock1 = plan.clones.filter((c) => c.blockIndex === 1);
    expect(forBlock1.map((c) => c.fragmentIndex)).toEqual([1, 2]);
    expect(plan.clones.some((c) => c.blockIndex === 0)).toBe(false);
  });

  it('positions each clone at its fragment rect with a clip + upward shift', () => {
    const plan = computeSplitPlan(layout, geo);
    const f1 = plan.clones.find((c) => c.fragmentIndex === 1)!;
    // page1.top(1147) + frame.y(96) + frag.y(0)
    expect(f1.top).toBe(1147 + 96);
    expect(f1.left).toBe(96);
    expect(f1.width).toBe(602);
    expect(f1.height).toBe(200);
    // show lines 10+ : shift up by 10 lines * 20px
    expect(f1.translateY).toBe(-200);

    const f2 = plan.clones.find((c) => c.fragmentIndex === 2)!;
    expect(f2.translateY).toBe(-400); // lines 20+
    expect(f2.height).toBe(100);
  });

  it('returns an empty plan when nothing splits', () => {
    const noSplit: LayoutOutput = {
      metrics: { blocks: 1, pages: 1 },
      pages: [page(0, [frag([0], 0, 0, 5, 0)])],
    };
    const plan = computeSplitPlan(noSplit, getPageGeometry(noSplit, 24));
    expect(plan.clones).toHaveLength(0);
    expect(plan.liveClipHeight.size).toBe(0);
  });
});
