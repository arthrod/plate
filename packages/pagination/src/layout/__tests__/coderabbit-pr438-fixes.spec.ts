// CodeRabbit PR #438 fixes — regression guards for two correctness issues:
//
// 1. buildMappingIndex must store the POSITIONAL pages-array index in
//    FragmentRef.pageIndex, not `page.index`. Consumers dereference with
//    `layout.pages[ref.pageIndex]`, so any drift between page.index and the
//    array position silently drops projections.
//
// 2. buildSnapshot's fallback stableId can collide for sibling blocks with
//    identical (type, text) — e.g. two empty paragraphs. The same id
//    corrupts the (id, width) measure cache and breaks fragment grouping.
//    Fallback ids must be deduplicated within a snapshot; real author-
//    supplied ids stay untouched.

import { describe, expect, test } from 'bun:test';

import { composeLayout } from '../compose';
import { buildMappingIndex } from '../mapping';
import { buildSnapshot } from '../snapshot';
import type { LayoutInput, MeasuredSnapshot, PageLayout } from '../types';

const baseInput = (overrides: Partial<LayoutInput> = {}): LayoutInput => ({
  page: { widthPx: 800, heightPx: 1000 },
  margins: { topPx: 96, rightPx: 96, bottomPx: 96, leftPx: 96 },
  policies: { widowLinesMin: 2, orphanLinesMin: 2, keepWithNextEnabled: false },
  ...overrides,
});

describe('buildMappingIndex — positional page index (PR #438)', () => {
  test('FragmentRef.pageIndex matches the position in the layout.pages array', () => {
    const snapshot: MeasuredSnapshot = {
      blocks: Array.from({ length: 6 }, (_, i) => ({
        id: `b${i}`,
        path: [i],
        heightPx: 350,
        flowHeightPx: 350,
        lineHeightPx: 24,
        lineCount: Math.round(350 / 24),
      })),
    };
    const out = composeLayout(snapshot, baseInput());
    expect(out.pages.length).toBeGreaterThanOrEqual(2);

    for (
      let blockIndex = 0;
      blockIndex < snapshot.blocks.length;
      blockIndex++
    ) {
      const refs = out.mapping.fragmentsOfBlock(blockIndex);
      for (const ref of refs) {
        const pageAtPosition = out.pages[ref.pageIndex];
        expect(pageAtPosition).toBeDefined();
        const found = pageAtPosition!.frames[0]!.fragments.find(
          (f) => f.path[0] === blockIndex
        );
        expect(found).toBeDefined();
      }
    }
  });

  test('mapping is positional when page.index is non-contiguous (synthetic)', () => {
    const pages: PageLayout[] = [
      {
        index: 10,
        spec: { widthPx: 800, heightPx: 1000 },
        frames: [
          {
            bounds: { x: 96, y: 96, width: 608, height: 808 },
            fragments: [
              {
                blockId: 'a',
                path: [0],
                fragmentIndex: 0,
                lineStart: 0,
                lineCount: 1,
                y: 0,
                heightPx: 24,
              },
            ],
          },
        ],
      },
      {
        index: 25,
        spec: { widthPx: 800, heightPx: 1000 },
        frames: [
          {
            bounds: { x: 96, y: 96, width: 608, height: 808 },
            fragments: [
              {
                blockId: 'b',
                path: [1],
                fragmentIndex: 0,
                lineStart: 0,
                lineCount: 1,
                y: 0,
                heightPx: 24,
              },
            ],
          },
        ],
      },
    ];
    const mapping = buildMappingIndex(pages);
    expect(mapping.pageOfBlock(0)).toBe(0);
    expect(mapping.pageOfBlock(1)).toBe(1);
    const refsForBlockA = mapping.fragmentsOfBlock(0);
    expect(pages[refsForBlockA[0]!.pageIndex]).toBe(pages[0]);
  });
});

describe('buildSnapshot — fallback stableId collision-safe (PR #438)', () => {
  test('two empty paragraphs of identical type get distinct ids', () => {
    const value = [
      { type: 'p', children: [{ text: '' }] },
      { type: 'p', children: [{ text: '' }] },
    ];
    const out = buildSnapshot(value, {
      atomicTypes: [],
      keepWithNextTypes: [],
    });
    expect(out.blocks).toHaveLength(2);
    expect(out.blocks[0]!.id).not.toBe(out.blocks[1]!.id);
  });

  test('three identical paragraphs all get distinct ids', () => {
    const value = [
      { type: 'p', children: [{ text: 'same text' }] },
      { type: 'p', children: [{ text: 'same text' }] },
      { type: 'p', children: [{ text: 'same text' }] },
    ];
    const out = buildSnapshot(value, {
      atomicTypes: [],
      keepWithNextTypes: [],
    });
    expect(new Set(out.blocks.map((b) => b.id)).size).toBe(3);
  });

  test('author-supplied real ids are left untouched (no @suffix)', () => {
    const value = [
      { id: 'my-explicit-id', type: 'p', children: [{ text: 'x' }] },
      { id: 'other-explicit-id', type: 'p', children: [{ text: 'x' }] },
    ];
    const out = buildSnapshot(value, {
      atomicTypes: [],
      keepWithNextTypes: [],
    });
    expect(out.blocks[0]!.id).toBe('my-explicit-id');
    expect(out.blocks[1]!.id).toBe('other-explicit-id');
  });

  test('mix of explicit + fallback: explicit untouched, fallback dedupes', () => {
    const value = [
      { id: 'fixed', type: 'p', children: [{ text: 'a' }] },
      { type: 'p', children: [{ text: 'b' }] },
      { type: 'p', children: [{ text: 'b' }] },
    ];
    const out = buildSnapshot(value, {
      atomicTypes: [],
      keepWithNextTypes: [],
    });
    expect(out.blocks[0]!.id).toBe('fixed');
    expect(out.blocks[1]!.id).not.toBe(out.blocks[2]!.id);
  });
});
