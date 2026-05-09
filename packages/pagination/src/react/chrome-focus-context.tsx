import * as React from 'react';

/**
 * Identifies which chrome editor is currently active. `null` means body
 * holds focus (or nothing does). Reserved IDs match the chrome region
 * `PageFrame` paints into so consumers can render targeted affordances.
 */
export type ActiveChromeId =
  | 'firstPageFooter'
  | 'firstPageHeader'
  | 'footer'
  | 'header'
  | null;

export type ChromeFocusContextValue = {
  /** Currently active chrome region, if any. */
  activeChromeId: ActiveChromeId;
  /** When true, body editor should dim while a chrome region is active. */
  dimBody: boolean;
  /** Pointer to whichever editor was focused before the chrome took focus. */
  setActiveChromeId: (id: ActiveChromeId) => void;
};

const ChromeFocusContext = React.createContext<ChromeFocusContextValue>({
  activeChromeId: null,
  dimBody: true,
  setActiveChromeId: () => {},
});

export type ChromeFocusProviderProps = {
  children: React.ReactNode;
  /**
   * Whether to honor `prefers-reduced-motion`. When true (default), a user
   * preference for reduced motion still toggles `data-chrome-active` so
   * consumers can dim instantly without a transition; only the CSS
   * transition is suppressed (left to the consumer's stylesheet).
   */
  dimBody?: boolean;
};

/**
 * Coordinates "which chrome region is being edited?" across the paged view.
 *
 * `PageOverlay` mounts this provider so chrome wrappers can call
 * `setActiveChromeId` on focus and the body wrapper can dim when
 * `activeChromeId !== null && dimBody`.
 */
export const ChromeFocusProvider = ({
  children,
  dimBody = true,
}: ChromeFocusProviderProps): React.JSX.Element => {
  const [activeChromeId, setActiveChromeId] =
    React.useState<ActiveChromeId>(null);

  const value = React.useMemo<ChromeFocusContextValue>(
    () => ({ activeChromeId, dimBody, setActiveChromeId }),
    [activeChromeId, dimBody]
  );

  return (
    <ChromeFocusContext.Provider value={value}>
      {children}
    </ChromeFocusContext.Provider>
  );
};

/** Read the current chrome-focus state. Safe outside the provider (returns defaults). */
export const useChromeFocus = (): ChromeFocusContextValue =>
  React.useContext(ChromeFocusContext);

/**
 * Stable boolean: should the body editor dim right now?
 *
 * `true` iff a chrome region holds focus AND the consumer asked for the
 * dim UX. Used by the body-dim wrapper in `PageOverlay`.
 */
export const useShouldDimBody = (): boolean => {
  const { activeChromeId, dimBody } = useChromeFocus();

  return dimBody && activeChromeId !== null;
};

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Subscribe to the user's `prefers-reduced-motion` preference. */
export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = React.useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;

    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    const handler = (event: MediaQueryListEvent): void => {
      setReduced(event.matches);
    };

    mql.addEventListener('change', handler);

    return () => {
      mql.removeEventListener('change', handler);
    };
  }, []);

  return reduced;
};
