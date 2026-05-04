import { useState } from 'react';

import type { Measurer } from '../lib/types';

const NOOP_MEASURER: Measurer = {
  measure: () => 0,
};

/**
 * React hook returning a memoized {@link Measurer}.
 *
 * Variant A — CodeRabbit Design Choice 3: the measurer feeds the per-block
 * height oracle keyed by `(node.id, marks-fingerprint, font, width)`. The
 * hook owns the cache so it survives across renders but resets across
 * editor instances.
 *
 * TODO: re-add `@chenglou/pretext` as a dependency when the measurer lands —
 * dynamic-import it inside this hook so the consumer pays no runtime cost
 * until measurement is actually wired. The current return is a no-op stub
 * with `useState` so the future `ready` flip causes the consumer to re-render.
 */
export const usePretextMeasurer = (): Measurer => {
  const [measurer] = useState<Measurer>(() => NOOP_MEASURER);

  return measurer;
};
