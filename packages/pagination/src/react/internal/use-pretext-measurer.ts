import { useState } from 'react';

/**
 * Lazy initialiser for the pretext text measurer (CR Design Choice 1 on issue
 * #354). Pretext is a direct dependency so that auto-pagination is reliable,
 * but the heavy font tables only load on first measurement.
 *
 * TODO(#358): variant B — implement:
 *   1. Dynamic-import `@chenglou/pretext` on first call.
 *   2. Cache the loaded module via the `setMeasurer` returned by `useState`
 *      so the consumer re-renders when `ready` flips.
 *   3. Return a stable `measure(text, font)` callback for the auto-paginator.
 *
 * Uses `useState` (not `useRef`) so the future `ready` flip triggers a
 * re-render in the consumer when the dynamic-import resolves.
 */
export type PretextMeasurer = {
  ready: boolean;
  measure: ((text: string) => number) | null;
};

const INITIAL_MEASURER: PretextMeasurer = { ready: false, measure: null };

export const usePretextMeasurer = (): PretextMeasurer => {
  const [measurer] = useState<PretextMeasurer>(INITIAL_MEASURER);

  return measurer;
};
