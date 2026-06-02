// ============================================================
// pagination/lib/BasePaginationPlugin.ts
//
// Slate-first base plugin. Owns the pagination options (page geometry, margins,
// break policies, view mode, atomic/keep-with-next block types) and wires the
// editor.apply override that marks the per-editor layout registry dirty on
// content edits. Measurement + rendering live in the React layer (toPlatePlugin).
//
// The document model is never mutated here — pagination is a derived overlay.
// ============================================================

import type { PluginConfig } from 'platejs';

import { createTSlatePlugin } from 'platejs';

import type {
  ChromeRenderContext,
  LayoutPolicies,
  PageMargins,
  PageSpec,
} from '../layout/types';
import { invalidateLayoutRegistry, shouldInvalidateLayout } from './registry';

/**
 * Page-chrome configuration for the React layer. A chrome band reserves
 * `heightPx` of vertical space at the top (header) or bottom (footer) of each
 * page — the composer subtracts that height from the content frame before
 * packing — and renders the consumer-supplied content via the overlay as an
 * absolute sibling of the editable.
 *
 * PRETEXT-safe: `render` MUST be a pure function that produces a ReactNode from
 * the {@link ChromeRenderContext}. It MUST NOT call DOM APIs, mutate the editor,
 * or read scroll state; the same `(pageIndex, pageCount)` always yields the
 * same content.
 *
 * @public
 */
export type PageChromeOption = {
  heightPx: number;
  render: (ctx: ChromeRenderContext) => unknown;
};

/** How pages are presented while editing. Print authority is the static path. */
export type PaginationViewMode = 'continuous' | 'paged';

/**
 * CSS border style for the advisory page-break rule painted at each interior
 * page boundary in continuous view. `dotted` reads as the lightest "page ends
 * here" hint; `dashed` (default) preserves the original treatment.
 */
export type BreakLineStyle = 'dashed' | 'dotted' | 'solid';

export type PaginationOptions = {
  /**
   * Whether pagination is active. When `false`, the React layer skips layout
   * recompute and renders no page-break overlay, leaving the editor untouched;
   * the document is never mutated either way. Toggle at runtime with
   * `editor.setOption(BasePaginationPlugin, 'enabled', next)`.
   *
   * Optional — `DEFAULT_OPTIONS.enabled = true`, so callers of `.configure({…})`
   * and `.setOption('enabled', …)` can supply any subset of options without
   * being forced to repeat the default. CodeRabbit #434.
   *
   * @default true
   */
  enabled?: boolean;
  page: PageSpec;
  margins: PageMargins;
  policies: LayoutPolicies;
  viewMode: PaginationViewMode;
  /**
   * CSS border style of the advisory page-break rule in continuous view.
   *
   * @default 'dashed'
   */
  breakLineStyle?: BreakLineStyle;
  /** Block types placed whole, never split (tables, images, void). */
  atomicTypes: string[];
  /** Block types kept on the same page as the next block (e.g. headings). */
  keepWithNextTypes: string[];
  /**
   * Page chrome (headers + footers + page numbers). Each band reserves
   * vertical space in the page (composer-enforced) and is rendered inside that
   * reserved rect by the overlay. The chrome rects come from `PageLayout.chrome`
   * — pure composer output — so chrome content is anchored to page geometry,
   * not the viewport. Optional; absent means no chrome.
   */
  chrome?: {
    header?: PageChromeOption;
    footer?: PageChromeOption;
  };
};

export type PaginationConfig = PluginConfig<'pagination', PaginationOptions>;

// A4 @ 96dpi with 1in margins; widow/orphan = 2 lines; continuous by default
// (cheapest, fully native edit surface — paged is the high-fidelity opt-in).
const DEFAULT_OPTIONS: PaginationOptions = {
  atomicTypes: [],
  breakLineStyle: 'dashed',
  // Declared (not omitted) so `usePluginOption(plugin, 'chrome')` resolves a
  // value instead of throwing OPTION_UNDEFINED when no chrome is configured.
  chrome: undefined,
  enabled: true,
  keepWithNextTypes: [],
  margins: { bottomPx: 96, leftPx: 96, rightPx: 96, topPx: 96 },
  page: { heightPx: 1123, preset: 'a4', widthPx: 794 },
  policies: { keepWithNextEnabled: true, orphanLinesMin: 2, widowLinesMin: 2 },
  viewMode: 'continuous',
};

export const BasePaginationPlugin = createTSlatePlugin<PaginationConfig>({
  key: 'pagination',
  options: DEFAULT_OPTIONS,
}).overrideEditor(({ editor, tf: { apply } }) => ({
  transforms: {
    apply(operation) {
      if (shouldInvalidateLayout(operation)) {
        invalidateLayoutRegistry(editor);
      }

      apply(operation);
    },
  },
}));
