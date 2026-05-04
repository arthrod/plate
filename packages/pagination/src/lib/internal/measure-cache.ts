/**
 * In-memory cache for pretext-measured node heights.
 *
 * Variant A cache key per CodeRabbit's binding design choice:
 * `(node.id, marks-fingerprint, font, width)`. Hits short-circuit the
 * measurer; misses run pretext and write back.
 */
export type MeasureCacheKey = {
  font: string;
  marksFingerprint: string;
  nodeId: string;
  width: number;
};

export type MeasureCache = {
  get: (key: MeasureCacheKey) => number | undefined;
  set: (key: MeasureCacheKey, value: number) => void;
};

export const createMeasureCache = (): MeasureCache => {
  // TODO: variant A — back this with a `Map<string, number>` keyed by a
  // canonical join of (nodeId | fingerprint | font | width). Bound the size
  // and evict on document mutation.
  return {
    get: () => {},
    set: () => {},
  };
};
