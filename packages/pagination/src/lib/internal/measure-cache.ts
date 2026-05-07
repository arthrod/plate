/**
 * In-memory cache for measured node heights.
 *
 * Variant A cache key per CodeRabbit Design Choice 3:
 * `(node.id, marks-fingerprint, font, width)` plus a `contentHash` so an
 * in-place text edit (Slate mutates `children` without rotating the
 * `node.id`) invalidates the cache entry.
 *
 * The cache is bounded — when it exceeds {@link DEFAULT_MAX_ENTRIES}, the
 * oldest insertion is evicted. Eviction uses Map insertion order so it is
 * effectively LRU on writes (the caller treats every miss as an "access").
 */
export type MeasureCacheKey = {
  /** Hash of the block's plain text + type — invalidates on edit. */
  contentHash: string;
  font: string;
  marksFingerprint: string;
  nodeId: string;
  width: number;
};

export type MeasureCache = {
  clear: () => void;
  get: (key: MeasureCacheKey) => number | undefined;
  set: (key: MeasureCacheKey, value: number) => void;
  size: () => number;
};

export const DEFAULT_MAX_ENTRIES = 5000;

export const createMeasureCache = (
  maxEntries = DEFAULT_MAX_ENTRIES
): MeasureCache => {
  const store = new Map<string, number>();

  // `\x1f` (Unit Separator) is reserved for record-internal field separation
  // and never appears in user-visible text, so we avoid collisions when
  // `nodeId` or `font` legitimately contain spaces (font family names like
  // "Helvetica Neue" do).
  const composeKey = (k: MeasureCacheKey): string =>
    `${k.nodeId}\x1f${k.marksFingerprint}\x1f${k.font}\x1f${k.width}\x1f${k.contentHash}`;

  return {
    clear: () => store.clear(),
    get: (key) => store.get(composeKey(key)),
    set: (key, value) => {
      const composed = composeKey(key);

      if (store.has(composed)) {
        store.delete(composed);
      } else if (store.size >= maxEntries) {
        const oldest = store.keys().next().value;

        if (oldest !== undefined) store.delete(oldest);
      }

      store.set(composed, value);
    },
    size: () => store.size,
  };
};

/**
 * djb2 hash of a string — small, fast, no deps, plenty of entropy for
 * cache key disambiguation.
 */
export const hashString = (s: string): string => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }

  return h.toString(36);
};
