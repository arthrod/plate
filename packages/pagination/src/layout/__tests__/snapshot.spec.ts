import { buildSnapshot } from '../snapshot';

const p = (text: string, extra: Record<string, unknown> = {}) => ({
  children: [{ text }],
  type: 'p',
  ...extra,
});

describe('buildSnapshot', () => {
  it('maps each top-level node to a block with its path', () => {
    const snap = buildSnapshot([p('a'), p('b'), p('c')], {});
    expect(snap.blocks.map((b) => b.path)).toEqual([[0], [1], [2]]);
    expect(snap.blocks.map((b) => b.type)).toEqual(['p', 'p', 'p']);
  });

  it('uses node.id as the stable id when present', () => {
    const snap = buildSnapshot([p('a', { id: 'fixed-1' })], {});
    expect(snap.blocks[0].id).toBe('fixed-1');
  });

  it('derives a stable, content-based id when node.id is absent', () => {
    const a = buildSnapshot([p('hello')], {}).blocks[0].id;
    const b = buildSnapshot([p('hello')], {}).blocks[0].id;
    const c = buildSnapshot([p('different')], {}).blocks[0].id;
    expect(a).toBe(b); // same content → same id (deterministic, cache-friendly)
    expect(a).not.toBe(c); // different content → different id
  });

  it('marks atomic types as non-splittable', () => {
    const snap = buildSnapshot(
      [p('x'), { children: [{ text: '' }], type: 'img' }],
      { atomicTypes: ['img'] }
    );
    expect(snap.blocks[0].splittable).toBeUndefined(); // p → splittable (default)
    expect(snap.blocks[1].splittable).toBe(false);
  });

  it('marks keepWithNext from type or node attr', () => {
    const snap = buildSnapshot(
      [
        { children: [{ text: 'Heading' }], type: 'h1' },
        p('x', { keepWithNext: true }),
        p('y'),
      ],
      { keepWithNextTypes: ['h1'] }
    );
    expect(snap.blocks[0].keepWithNext).toBe(true); // by type
    expect(snap.blocks[1].keepWithNext).toBe(true); // by attr
    expect(snap.blocks[2].keepWithNext).toBeUndefined();
  });

  it('reads breakBefore from the node attr', () => {
    const snap = buildSnapshot([p('a'), p('b', { breakBefore: true })], {});
    expect(snap.blocks[0].breakBefore).toBeUndefined();
    expect(snap.blocks[1].breakBefore).toBe(true);
  });
});
