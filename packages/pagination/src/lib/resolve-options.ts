import type { BasePaginationOptions } from './types';

/**
 * Defaults for pagination options. Single source of truth for the option
 * shape consumed by `paginate()`, `resolvePageRect()`, and the React
 * overlay. The base plugin spreads these into its `options` block; the
 * React wrapper consumes them via {@link resolvePaginationOptions}
 * instead of re-defining defaults inside a hook.
 */
export const PAGINATION_OPTION_DEFAULTS: BasePaginationOptions = {
  firstPageDifferent: false,
  footerHeight: 48,
  footnotePlacement: 'footer',
  footnoteWell: 0,
  headerHeight: 48,
  includeFootnoteSubPlugins: true,
  margins: {
    bottom: 72,
    left: 72,
    right: 72,
    top: 72,
  },
  mode: 'standard',
  pageSize: 'A4',
  pageBorder: {
    color: 'rgba(15,23,42,0.15)',
    radius: 2,
    shadow: '0 1px 2px rgba(15,23,42,0.08)',
    style: 'solid',
    width: 1,
  },
  pageNumber: {
    align: 'right',
    format: '1',
    hideOnFirst: false,
    region: 'footer',
    startAt: 1,
  },
  previewWidth: 220,
  previewVisible: true,
};

/**
 * Resolve a partial options bag against {@link PAGINATION_OPTION_DEFAULTS}.
 * Used by the React overlay/layout hook so defaults live in `src/lib`
 * rather than being redefined inside a React wrapper.
 */
export const resolvePaginationOptions = (
  partial: Partial<BasePaginationOptions> | undefined
): BasePaginationOptions => {
  const p = partial ?? {};

  return {
    firstPageDifferent:
      p.firstPageDifferent ?? PAGINATION_OPTION_DEFAULTS.firstPageDifferent,
    footerHeight: p.footerHeight ?? PAGINATION_OPTION_DEFAULTS.footerHeight,
    footnotePlacement:
      p.footnotePlacement ?? PAGINATION_OPTION_DEFAULTS.footnotePlacement,
    footnoteWell: p.footnoteWell ?? PAGINATION_OPTION_DEFAULTS.footnoteWell,
    headerHeight: p.headerHeight ?? PAGINATION_OPTION_DEFAULTS.headerHeight,
    includeFootnoteSubPlugins:
      p.includeFootnoteSubPlugins ??
      PAGINATION_OPTION_DEFAULTS.includeFootnoteSubPlugins,
    margins: p.margins ?? PAGINATION_OPTION_DEFAULTS.margins,
    mode: p.mode ?? PAGINATION_OPTION_DEFAULTS.mode,
    pageBorder: p.pageBorder ?? PAGINATION_OPTION_DEFAULTS.pageBorder,
    pageNumber: p.pageNumber
      ? {
          ...PAGINATION_OPTION_DEFAULTS.pageNumber,
          ...p.pageNumber,
        }
      : PAGINATION_OPTION_DEFAULTS.pageNumber,
    pageSize: p.pageSize ?? PAGINATION_OPTION_DEFAULTS.pageSize,
    previewWidth: p.previewWidth ?? PAGINATION_OPTION_DEFAULTS.previewWidth,
    previewVisible:
      p.previewVisible ?? PAGINATION_OPTION_DEFAULTS.previewVisible,
  };
};
