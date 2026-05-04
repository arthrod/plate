import { useRef } from 'react';

/**
 * Lazy initialiser for the pretext text measurer (CR Design Choice 1 on issue
 * #354). Pretext is a direct dependency so that auto-pagination is reliable,
 * but the heavy font tables only load on first measurement.
 *
 * TODO: variant B — implement:
 *   1. Dynamic-import `@chenglou/pretext` on first call.
 *   2. Cache the loaded module in a `useRef` so subsequent renders reuse it.
 *   3. Return a stable `measure(text, font)` callback for the auto-paginator.
 */
export type PretextMeasurer = {
  ready: boolean;
  measure: ((text: string) => number) | null;
};

export const usePretextMeasurer = (): PretextMeasurer => {
  const ref = useRef<PretextMeasurer>({ ready: false, measure: null });

  return ref.current;
};
