// CodeRabbit PR #442 review — explicit-id pass-through.
//
// The PR #438 dedupe code naively ran every id (explicit AND fallback)
// through the collision-disambiguation path. Two blocks with the same
// CONSUMER-SUPPLIED `id: 'foo'` would get rewritten to `'foo'` and
// `'foo@1'` — violating the documented contract that explicit ids stay
// untouched. (The consumer's stable id is the consumer's stable id; if
// they hand us two equal ones, that's their bug to surface, not ours
// to silently rename.)
//
// The fix: dedupe ONLY fallback ids. Explicit ids are added to the
// seen-set (so a later fallback can't collide with them) but are
// passed through verbatim.

import { describe, expect, test } from 'bun:test';

import { buildSnapshot } from '../snapshot';

describe('buildSnapshot — explicit ids pass through (CodeRabbit PR #442)', () => {
  test('duplicate explicit string ids remain untouched (no @suffix)', () => {
    const value = [
      { id: 'foo', type: 'p', children: [{ text: 'a' }] },
      { id: 'foo', type: 'p', children: [{ text: 'b' }] },
    ];
    const out = buildSnapshot(value, { atomicTypes: [], keepWithNextTypes: [] });
    expect(out.blocks[0]!.id).toBe('foo');
    expect(out.blocks[1]!.id).toBe('foo'); // NOT 'foo@1'
  });

  test('duplicate explicit numeric ids remain untouched', () => {
    const value = [
      { id: 7, type: 'p', children: [{ text: 'a' }] },
      { id: 7, type: 'p', children: [{ text: 'b' }] },
    ];
    const out = buildSnapshot(value, { atomicTypes: [], keepWithNextTypes: [] });
    expect(out.blocks[0]!.id).toBe('7');
    expect(out.blocks[1]!.id).toBe('7');
  });

  test('explicit id reserves its name against later fallback collisions', () => {
    // The fallback hash for an empty `<p>` is `p#<hash('')>` (some fixed
    // value). If a consumer happens to pick that exact id as an explicit
    // id BEFORE the empty paragraph, the empty paragraph's fallback
    // would collide. The fix registers explicit ids in seenIds so the
    // fallback gets deduped.
    //
    // We can't predict the exact hash, so we test the GENERAL property:
    // when an explicit id matches what a later fallback WOULD produce,
    // they end up distinct.
    const emptyP = { type: 'p', children: [{ text: '' }] };
    const fallbackOut = buildSnapshot([emptyP], {
      atomicTypes: [],
      keepWithNextTypes: [],
    });
    const fallbackId = fallbackOut.blocks[0]!.id;

    const value = [
      { id: fallbackId, type: 'p', children: [{ text: 'explicit-first' }] },
      emptyP,
    ];
    const out = buildSnapshot(value, { atomicTypes: [], keepWithNextTypes: [] });
    expect(out.blocks[0]!.id).toBe(fallbackId);
    expect(out.blocks[1]!.id).not.toBe(fallbackId);
  });

  test('three duplicate fallback ids still dedupe (PR #438 behavior preserved)', () => {
    const value = [
      { type: 'p', children: [{ text: 'same' }] },
      { type: 'p', children: [{ text: 'same' }] },
      { type: 'p', children: [{ text: 'same' }] },
    ];
    const out = buildSnapshot(value, { atomicTypes: [], keepWithNextTypes: [] });
    expect(new Set(out.blocks.map((b) => b.id)).size).toBe(3);
  });

  test('mix: explicit duplicates pass through, fallback duplicates dedupe', () => {
    const value = [
      { id: 'shared', type: 'p', children: [{ text: 'a' }] }, // explicit
      { id: 'shared', type: 'p', children: [{ text: 'b' }] }, // explicit dup
      { type: 'p', children: [{ text: 'fallback' }] }, // fallback
      { type: 'p', children: [{ text: 'fallback' }] }, // fallback dup
    ];
    const out = buildSnapshot(value, { atomicTypes: [], keepWithNextTypes: [] });
    expect(out.blocks[0]!.id).toBe('shared');
    expect(out.blocks[1]!.id).toBe('shared'); // explicit dup preserved
    expect(out.blocks[2]!.id).not.toBe(out.blocks[3]!.id); // fallback deduped
  });
});
