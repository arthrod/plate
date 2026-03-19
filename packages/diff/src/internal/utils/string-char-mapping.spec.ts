import { StringCharMapping } from './string-char-mapping';

describe('StringCharMapping', () => {
  it('treats nodes as equivalent regardless of key order', () => {
    const map = new StringCharMapping();
    const c1 = map.nodeToChar({ children: [], type: 'a', b: 1 } as any);
    const c2 = map.nodeToChar({ b: 1, children: [], type: 'a' } as any);
    expect(c1).toBe(c2);
  });

  it('ignores undefined values like lodash isEqual', () => {
    const map = new StringCharMapping();
    const c1 = map.nodeToChar({
      children: [],
      type: 'a',
      undefinedKey: undefined,
    } as any);
    const c2 = map.nodeToChar({ children: [], type: 'a' });
    expect(c1).toBe(c2);
  });
});
