import { createMeasureCache } from './measure-cache';

const k = (s: string) => ({
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

  cache.set({ font: 'a', marksFingerprint: '', nodeId: 'x', width: 100 }, 1);
  cache.set({ font: 'a', marksFingerprint: '', nodeId: 'x', width: 200 }, 2);
  cache.set({ font: 'b', marksFingerprint: '', nodeId: 'x', width: 100 }, 3);

  expect(
    cache.get({ font: 'a', marksFingerprint: '', nodeId: 'x', width: 100 })
  ).toBe(1);
  expect(
    cache.get({ font: 'a', marksFingerprint: '', nodeId: 'x', width: 200 })
  ).toBe(2);
  expect(
    cache.get({ font: 'b', marksFingerprint: '', nodeId: 'x', width: 100 })
  ).toBe(3);
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
