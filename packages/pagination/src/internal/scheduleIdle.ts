// ============================================================
// pagination/internal/scheduleIdle.ts
// ============================================================
// SSR-safe idle scheduler: uses requestIdleCallback when present,
// falls back to setTimeout(0), and no-ops in non-browser environments.

export const scheduleIdle = (cb: () => void): void => {
  if (typeof window === 'undefined') return; // SSR no-op
  const ric = (
    window as Window &
      typeof globalThis & {
        requestIdleCallback?: (cb: () => void) => number;
      }
  ).requestIdleCallback;
  if (ric) ric(cb);
  else window.setTimeout(cb, 0);
};
