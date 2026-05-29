// CodeRabbit PR #442 (batch 2 of 11:27 review) — two layer-pure regressions:
//
// 1. measureSnapshot's cache key must include the block's text/flags
//    signature. An explicit consumer id is stable across edits, but the
//    block's measured height isn't; without the signature the same id
//    re-measured after the text changed would return the stale height
//    and produce wrong page breaks.
//
// 2. computePageStartSpacers must NOT emit a spacer for a page that opens
//    with a CONTINUATION fragment (fragmentIndex > 0). The continuation
//    shares its DOM element with the prior page's leading fragments;
//    applying margin-top would push the whole block (including its prior-
//    page slice) downward.

import { describe, expect, test } from 'bun:test';

import { composeLayout } from '../compose';
import { computePageStartSpacers } from '../../react/alignContent';
import { measureSnapshot } from '../../measure/measure';
import type {
  LayoutInput,
  LayoutOutput,
  MeasureCache,
  PageLayout,
  UnmeasuredSnapshot,
} from '../types';

const input: LayoutInput = {
  page: { widthPx: 800, heightPx: 1000 },
  margins: { topPx: 96, rightPx: 96, bottomPx: 96, leftPx: 96 },
  policies: { widowLinesMin: 2, orphanLinesMin: 2, keepWithNextEnabled: false },
};

describe('measureSnapshot — content-aware cache key (CR PR #442 batch 2)', () => {
  test('same id with different text gets re-measured, not cache-hit', () => {
    const cache: MeasureCache = new Map();
    let calls = 0;

    const v1: UnmeasuredSnapshot = {
      blocks: [{ id: 'stable', path: [0], text: 'short', type: 'p' }],
    };
    const v2: UnmeasuredSnapshot = {
      blocks: [
        {
          id: 'stable',
          path: [0],
          text: 'much longer text that would wrap to many more lines',
          type: 'p',
        },
      ],
    };

    measureSnapshot(v1, () => ({ heightPx: ((++calls), 20), lineHeightPx: 20 }), {
      widthPx: 600,
      cache,
    });
    measureSnapshot(v2, () => ({ heightPx: ((++calls), 100), lineHeightPx: 20 }), {
      widthPx: 600,
      cache,
    });

    // Both calls must have hit the measurer — otherwise the second `id:
    // 'stable'` would have stale-cache-hit on v1's `20px`.
    expect(calls).toBe(2);
  });

  test('same id + same text + same width stays cached (one measure call)', () => {
    const cache: MeasureCache = new Map();
    let calls = 0;
    const snap: UnmeasuredSnapshot = {
      blocks: [{ id: 'stable', path: [0], text: 'same', type: 'p' }],
    };
    const measure = () => {
      calls += 1;
      return { heightPx: 20, lineHeightPx: 20 };
    };

    measureSnapshot(snap, measure, { widthPx: 600, cache });
    measureSnapshot(snap, measure, { widthPx: 600, cache });
    measureSnapshot(snap, measure, { widthPx: 600, cache });

    expect(calls).toBe(1);
  });

  test('same id + same text + different widths produces two cache entries', () => {
    const cache: MeasureCache = new Map();
    let calls = 0;
    const snap: UnmeasuredSnapshot = {
      blocks: [{ id: 'stable', path: [0], text: 'same', type: 'p' }],
    };
    const measure = () => {
      calls += 1;
      return { heightPx: 20, lineHeightPx: 20 };
    };

    measureSnapshot(snap, measure, { widthPx: 600, cache });
    measureSnapshot(snap, measure, { widthPx: 400, cache });

    expect(calls).toBe(2);
    expect(cache.size).toBe(2);
  });

  test('keepWithNext flag flip invalidates the cache slot', () => {
    const cache: MeasureCache = new Map();
    let calls = 0;
    const measure = () => {
      calls += 1;
      return { heightPx: 20, lineHeightPx: 20 };
    };

    const baseBlock = {
      id: 'stable',
      path: [0] as [number],
      text: 'same',
      type: 'h1',
    };
    measureSnapshot(
      { blocks: [baseBlock] },
      measure,
      { widthPx: 600, cache }
    );
    measureSnapshot(
      { blocks: [{ ...baseBlock, keepWithNext: true }] },
      measure,
      { widthPx: 600, cache }
    );

    expect(calls).toBe(2);
  });
});

describe('computePageStartSpacers — skip continuations (CR PR #442 batch 2)', () => {
  // Build a synthetic layout where page 2 opens with a continuation
  // fragment of the same top-level block (index 0) that started page 1.
  // The composer doesn't expose split mid-block today, so we hand-build
  // the PageLayout array — this is the protected invariant.
  test('a continuation fragment on page 2 does not get a spacer', () => {
    const pages: PageLayout[] = [
      {
        index: 0,
        spec: input.page,
        frames: [
          {
            bounds: { x: 96, y: 96, width: 608, height: 808 },
            fragments: [
              {
                blockId: 'big',
                path: [0],
                fragmentIndex: 0,
                lineStart: 0,
                lineCount: 30,
                y: 0,
                heightPx: 600,
              },
            ],
          },
        ],
      },
      {
        index: 1,
        spec: input.page,
        frames: [
          {
            bounds: { x: 96, y: 96, width: 608, height: 808 },
            fragments: [
              {
                blockId: 'big',
                path: [0],
                fragmentIndex: 1, // CONTINUATION — second fragment of block 0
                lineStart: 30,
                lineCount: 10,
                y: 0,
                heightPx: 200,
              },
            ],
          },
        ],
      },
    ];
    const layout: LayoutOutput = {
      pages,
      mapping: {
        fragmentsOfBlock: () => [],
        fragmentOfBlockLine: () => null,
        isSplit: () => true,
        pageOfBlock: () => 0,
        pageOfBlockLine: () => 0,
      },
      metrics: { totalPages: 2, totalLines: 40, overflows: 0 },
    };
    const spacers = computePageStartSpacers(layout, input);
    expect(spacers.has(0)).toBe(false); // NO spacer on the continued block
  });

  test('a page-start fragment for a NEW block still gets its spacer', () => {
    const pages: PageLayout[] = [
      {
        index: 0,
        spec: input.page,
        frames: [
          {
            bounds: { x: 96, y: 96, width: 608, height: 808 },
            fragments: [
              {
                blockId: 'a',
                path: [0],
                fragmentIndex: 0,
                lineStart: 0,
                lineCount: 30,
                y: 0,
                heightPx: 700,
              },
            ],
          },
        ],
      },
      {
        index: 1,
        spec: input.page,
        frames: [
          {
            bounds: { x: 96, y: 96, width: 608, height: 808 },
            fragments: [
              {
                blockId: 'b',
                path: [1], // NEW block
                fragmentIndex: 0,
                lineStart: 0,
                lineCount: 10,
                y: 0,
                heightPx: 200,
              },
            ],
          },
        ],
      },
    ];
    const layout: LayoutOutput = {
      pages,
      mapping: {
        fragmentsOfBlock: () => [],
        fragmentOfBlockLine: () => null,
        isSplit: () => false,
        pageOfBlock: () => 0,
        pageOfBlockLine: () => 0,
      },
      metrics: { totalPages: 2, totalLines: 40, overflows: 0 },
    };
    const spacers = computePageStartSpacers(layout, input);
    expect(spacers.has(1)).toBe(true); // NEW block on page 2 DOES get its spacer
  });

  test('compose-produced layout — first block of every page is a NEW block', () => {
    // Sanity: with the composer's current "place whole" behavior, every
    // page-start IS a new block (fragmentIndex 0) so the guard never fires
    // in the happy path.
    const snapshot = {
      blocks: Array.from({ length: 5 }, (_, i) => ({
        id: `b${i}`,
        path: [i] as [number],
        heightPx: 350,
        flowHeightPx: 350,
        lineHeightPx: 24,
        lineCount: Math.round(350 / 24),
      })),
    };
    const out = composeLayout(snapshot, input);
    const spacers = computePageStartSpacers(out, input);
    expect(spacers.size).toBe(out.pages.length - 1);
  });
});
