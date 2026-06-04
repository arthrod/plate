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

import type { LayoutPolicies, PageMargins, PageSpec } from '../layout/types';
import { invalidateLayoutRegistry, shouldInvalidateLayout } from './registry';

/** How pages are presented while editing. Print authority is the static path. */
export type PaginationViewMode = 'continuous' | 'paged';

export type PaginationOptions = {
  /**
   * Whether pagination is active. When `false`, the React layer skips layout
   * recompute and renders no page-break overlay, leaving the editor untouched;
   * the document is never mutated either way. Toggle at runtime with
   * `editor.setOption(BasePaginationPlugin, 'enabled', next)`.
   *
   * @default true
   */
  enabled: boolean;
  page: PageSpec;
  margins: PageMargins;
  policies: LayoutPolicies;
  viewMode: PaginationViewMode;
  /** Block types placed whole, never split (tables, images, void). */
  atomicTypes: string[];
  /** Block types kept on the same page as the next block (e.g. headings). */
  keepWithNextTypes: string[];
};

export type PaginationConfig = PluginConfig<'pagination', PaginationOptions>;

// A4 @ 96dpi with 1in margins; widow/orphan = 2 lines; continuous by default
// (cheapest, fully native edit surface — paged is the high-fidelity opt-in).
const DEFAULT_OPTIONS: PaginationOptions = {
  atomicTypes: [],
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
