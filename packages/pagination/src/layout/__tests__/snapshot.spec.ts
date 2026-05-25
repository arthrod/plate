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

  it('carries the concatenated text of each block (for line measurement)', () => {
    const snap = buildSnapshot(
      [
        { children: [{ text: 'Hello ' }, { text: 'world' }], type: 'p' },
        p('second'),
      ],
      {}
    );
    expect(snap.blocks[0].text).toBe('Hello world');
    expect(snap.blocks[1].text).toBe('second');
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

  it('returns an empty blocks array for an empty value', () => {
    const snap = buildSnapshot([], {});
    expect(snap.blocks).toHaveLength(0);
  });

  it('collects text from deeply nested children', () => {
    const snap = buildSnapshot(
      [
        {
          children: [
            {
              children: [
                { children: [{ text: 'deep' }], type: 'span' },
              ],
              type: 'inner',
            },
          ],
          type: 'p',
        },
      ],
      {}
    );
    expect(snap.blocks[0].text).toBe('deep');
  });

  it('treats a node with no children and no text property as empty string text', () => {
    const snap = buildSnapshot([{ type: 'hr' }], {});
    expect(snap.blocks[0].text).toBe('');
  });

  it('falls back to content-based id when node.id is an empty string', () => {
    // An empty-string id has length 0, so stableId must not use it.
    const snap = buildSnapshot([p('hello', { id: '' })], {});
    expect(snap.blocks[0].id).not.toBe('');
    expect(snap.blocks[0].id).toMatch(/^p#/);
  });

  it('includes the node type in the hash-based id prefix', () => {
    const snapH1 = buildSnapshot(
      [{ children: [{ text: 'hello' }], type: 'h1' }],
      {}
    );
    const snapP = buildSnapshot(
      [{ children: [{ text: 'hello' }], type: 'p' }],
      {}
    );
    // Different type prefix ensures ids differ even when text content is identical.
    expect(snapH1.blocks[0].id).not.toBe(snapP.blocks[0].id);
  });

  it('assigns consecutive 0-based paths to all top-level blocks', () => {
    const snap = buildSnapshot([p('a'), p('b'), p('c'), p('d')], {});
    expect(snap.blocks.map((b) => b.path)).toEqual([[0], [1], [2], [3]]);
  });

  it('concatenates text from multiple inline children', () => {
    const snap = buildSnapshot(
      [
        {
          children: [
            { text: 'Hello ' },
            { bold: true, text: 'bold' },
            { text: ' world' },
          ],
          type: 'p',
        },
      ],
      {}
    );
    expect(snap.blocks[0].text).toBe('Hello bold world');
  });
});
