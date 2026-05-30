// Gemini PR #442 review — unit-level regression guards for two of the four
// fixes (the DOM-anchored ones are covered by the live dogfood path).
//
// 1. snapshot.stableId must accept numeric (and other non-string) ids that
//    are non-nullish. Previously a strict `typeof === 'string'` check forced
//    every numerically-ided block onto the content-hash fallback path, which
//    thrashes the (id, width) measure cache on edits even though the
//    consumer ALREADY has a stable identity.
//
// (2 covered indirectly: computePageStartSpacers is a thin algebraic
// simplification — its result equals the old result whenever the old
// result was non-negative, which is the only condition the old code ever
// observed. The clamp behavior is exercised by the existing
// coderabbit-pr433-fixes spec.)

import { describe, expect, test } from 'bun:test';

import { buildSnapshot } from '../snapshot';

describe('snapshot.stableId — accept non-string ids (Gemini PR #442)', () => {
  test('numeric ids are preserved as the stable id', () => {
    const value = [
      { id: 42, type: 'p', children: [{ text: 'a' }] },
      { id: 99, type: 'p', children: [{ text: 'b' }] },
    ];
    const out = buildSnapshot(value, {
      atomicTypes: [],
      keepWithNextTypes: [],
    });
    expect(out.blocks[0]!.id).toBe('42');
    expect(out.blocks[1]!.id).toBe('99');
  });

  test('numeric zero is treated as a valid id (not falsy fallback)', () => {
    const value = [{ id: 0, type: 'p', children: [{ text: 'x' }] }];
    const out = buildSnapshot(value, {
      atomicTypes: [],
      keepWithNextTypes: [],
    });
    expect(out.blocks[0]!.id).toBe('0');
  });

  test('null and undefined still trigger the fallback hash', () => {
    const value = [
      { id: null, type: 'p', children: [{ text: 'a' }] },
      { id: undefined, type: 'p', children: [{ text: 'b' }] },
      { type: 'p', children: [{ text: 'c' }] },
    ];
    const out = buildSnapshot(value, {
      atomicTypes: [],
      keepWithNextTypes: [],
    });
    for (const b of out.blocks) {
      // Fallback shape is "${type}#${hash}", possibly suffixed by the
      // dedupe step. No raw "null"/"undefined" should leak through.
      expect(b.id).toMatch(/^p#[0-9a-z]+/);
    }
  });

  test('empty string id falls back (length-zero guard)', () => {
    const value = [{ id: '', type: 'p', children: [{ text: 'x' }] }];
    const out = buildSnapshot(value, {
      atomicTypes: [],
      keepWithNextTypes: [],
    });
    expect(out.blocks[0]!.id).not.toBe('');
    expect(out.blocks[0]!.id).toMatch(/^p#/);
  });

  test('mixed numeric + string ids both preserved', () => {
    const value = [
      { id: 1, type: 'p', children: [{ text: 'a' }] },
      { id: 'two', type: 'p', children: [{ text: 'b' }] },
      { id: 3, type: 'p', children: [{ text: 'c' }] },
    ];
    const out = buildSnapshot(value, {
      atomicTypes: [],
      keepWithNextTypes: [],
    });
    expect(out.blocks.map((b) => b.id)).toEqual(['1', 'two', '3']);
  });
});
