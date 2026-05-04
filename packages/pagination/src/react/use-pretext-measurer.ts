import type { Measurer } from '../lib/types';

/**
 * React hook returning a memoized {@link Measurer} backed by `@chenglou/pretext`.
 *
 * Variant A — CodeRabbit Design Choice 3: the measurer feeds the per-block
 * height oracle keyed by `(node.id, marks-fingerprint, font, width)`. The
 * hook owns the cache so it survives across renders but resets across
 * editor instances.
 */
export const usePretextMeasurer = (): Measurer => {
  // TODO: variant A — wire up `@chenglou/pretext` here, build the cache
  // with `createMeasureCache()`, and resolve canvas font via
  // `fontFromStyle(getComputedStyle(node))` before measure.
  return {
    measure: () => 0,
  };
};
