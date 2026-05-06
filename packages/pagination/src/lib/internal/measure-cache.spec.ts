import { createMeasureCache, hashString } from './measure-cache';

const k = (s: string, contentHash = '') => ({
  contentHash,
  font: '16px sans-serif',
  marksFingerprint: '',
  nodeId: s,
  width: 600,
});

it('returns undefined on miss and stores on set', () => {
  const cache = createMeasureCache();

  expect(cache.get(k('a'))).toBeUndefined();
  cache.set(k('a'), 42);
  expect(cache.get(k('a'))).toBe(42);
});

it('keys distinguish width and font', () => {
  const cache = createMeasureCache();

  cache.set(
    {
      contentHash: '',
      font: 'a',
      marksFingerprint: '',
      nodeId: 'x',
      width: 100,
    },
    1
  );
  cache.set(
    {
      contentHash: '',
      font: 'a',
      marksFingerprint: '',
      nodeId: 'x',
      width: 200,
    },
    2
  );
  cache.set(
    {
      contentHash: '',
      font: 'b',
      marksFingerprint: '',
      nodeId: 'x',
      width: 100,
    },
    3
  );

  expect(
    cache.get({
      contentHash: '',
      font: 'a',
      marksFingerprint: '',
      nodeId: 'x',
      width: 100,
    })
  ).toBe(1);
  expect(
    cache.get({
      contentHash: '',
      font: 'a',
      marksFingerprint: '',
      nodeId: 'x',
      width: 200,
    })
  ).toBe(2);
  expect(
    cache.get({
      contentHash: '',
      font: 'b',
      marksFingerprint: '',
      nodeId: 'x',
      width: 100,
    })
  ).toBe(3);
});

it('treats different content hashes as different entries', () => {
  const cache = createMeasureCache();

  cache.set(k('x', 'h1'), 10);
  cache.set(k('x', 'h2'), 20);

  expect(cache.get(k('x', 'h1'))).toBe(10);
  expect(cache.get(k('x', 'h2'))).toBe(20);
});

it('evicts the oldest entry when bounded', () => {
  const cache = createMeasureCache(2);

  cache.set(k('a'), 1);
  cache.set(k('b'), 2);
  cache.set(k('c'), 3);

  expect(cache.get(k('a'))).toBeUndefined();
  expect(cache.get(k('b'))).toBe(2);
  expect(cache.get(k('c'))).toBe(3);
});

it('hashString is deterministic and varies with input', () => {
  expect(hashString('hello')).toBe(hashString('hello'));
  expect(hashString('hello')).not.toBe(hashString('hellp'));
});
