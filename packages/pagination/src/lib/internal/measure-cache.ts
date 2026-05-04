import type { Descendant } from 'platejs';

/**
 * Cumulative-height cache keyed by node identity. The auto-paginator reads and
 * writes this cache during the `withNormalizeNode` pass so that a small text
 * edit only re-measures the affected block instead of the whole document.
 *
 * TODO: variant B — back this with `WeakMap<Descendant, number>` plus an
 * invalidation hook driven by the slate operation stream.
 */
export type MeasureCache = {
  get: (node: Descendant) => number | undefined;
  set: (node: Descendant, height: number) => void;
  invalidate: (node: Descendant) => void;
  clear: () => void;
};

export const createMeasureCache = (): MeasureCache => {
  // TODO: variant B — implement with WeakMap and operation-driven invalidation.
  const cache = new WeakMap<Descendant, number>();

  return {
    get: (node) => cache.get(node),
    set: (node, height) => {
      cache.set(node, height);
    },
    invalidate: (node) => {
      cache.delete(node);
    },
    clear: () => {
      // WeakMap has no clear; the variant B implementation will reset by
      // dropping the reference and creating a fresh map.
    },
  };
};
