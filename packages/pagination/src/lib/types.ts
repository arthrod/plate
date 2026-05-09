import type { Descendant, PluginConfig, TElement } from 'platejs';

import type { PAGINATION_KEY } from './internal/keys';

/** Page geometry in CSS pixels. */
export type PageRect = {
  contentHeight: number;
  contentWidth: number;
  height: number;
  width: number;
};

/** Page margin box in CSS pixels. */
export type PageMargins = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

/** Page sheet border styling in CSS pixels. */
export type PageBorder = {
  color: string;
  radius: number;
  shadow: string;
  style: 'dashed' | 'none' | 'solid';
  width: number;
};

/** Where footnote definitions render in the paginated view. */
export type FootnotePlacement = 'documentEnd' | 'footer';

/** Which chrome band paints the page-number slot. */
export type PageNumberRegion = 'footer' | 'header';

/** Horizontal alignment of the page-number slot inside its chrome band. */
export type PageNumberAlign = 'center' | 'left' | 'right';

/**
 * Display format for the page-number slot.
 *
 * - `'1'` — bare number (`1`, `2`, …)
 * - `'1/N'` — current/total (`1/12`)
 * - `'Page 1 of N'` — verbose form (`Page 1 of 12`)
 */
export type PageNumberFormat = '1' | '1/N' | 'Page 1 of N';

/**
 * Page-number slot configuration.
 *
 * Painted inside the chrome band selected by `region`, aligned per `align`,
 * formatted per `format`. `startAt` offsets the displayed number (1 means the
 * first page reads "1"; 5 would make it read "5"). `hideOnFirst` suppresses
 * the slot on page index 0 (e.g. cover pages).
 */
export type PageNumberConfig = {
  align: PageNumberAlign;
  format: PageNumberFormat;
  hideOnFirst: boolean;
  region: PageNumberRegion;
  startAt: number;
};

/**
 * Visualisation mode.
 *
 * - `standard` — continuous-flow editor: header chrome on top, body, optional
 *   end-of-doc footnote well, hybrid sticky/anchored footer chrome.
 * - `paged` — paged editor with per-page chrome (header, footer, footnote
 *   well) painted via the PageOverlay; print mode reuses the same paginate()
 *   selector to emit real `<section class="page">` elements.
 *
 * `@media print` always forces `paged` regardless of the configured mode so
 * a Standard-mode session prints with proper page breaks.
 */
export type PaginationMode = 'paged' | 'standard';

/**
 * Page size resolves to a preset key (`'A4'`, `'Letter'`, `'Legal'`) or a
 * literal `{ width, height }` in CSS pixels. The string-`(string & {})`
 * branch is reserved for future registry-based presets.
 */
export type PageSize =
  | 'A4'
  | 'Legal'
  | 'Letter'
  | (string & {})
  | { height: number; width: number };

/**
 * Resolved layout context for one paginated page.
 *
 * Variant A (render-overlay) consumes pages as a derived view of the live
 * document; nothing here is persisted in the Slate value.
 */
export type Page = {
  /** Footnote definition nodes allocated to this page's footer well. */
  footnotes: TElement[];
  /** Top-level block nodes that lay out inside this page's content box. */
  nodes: TElement[];
  /** Index in the derived sequence (0-based). */
  pageIndex: number;
  /** Geometry resolved from `BasePaginationConfig.options.pageSize` + margins. */
  rect: PageRect;
};

/**
 * Per-call layout context handed to {@link Measurer.measure}.
 *
 * Variant A pins the cache key on `(node.id, marks-fingerprint, font, width)`.
 */
export type PageContext = {
  /** Resolved CSS `font` shorthand for the body run. */
  font: string;
  /** Hashable fingerprint of marks/styles on this node's leaves. */
  marksFingerprint: string;
  /** Rendered content width in CSS pixels. */
  width: number;
};

/**
 * Measurer contract.
 *
 * Variant A backs this with `@chenglou/pretext` to estimate rendered block
 * height without mounting React. The default exported measurer is a no-op
 * passthrough; the real implementation lives behind
 * `usePretextMeasurer` in `src/react`.
 */
export type Measurer = {
  measure: (node: TElement, ctx: PageContext) => number;
};

/**
 * Public options for the base pagination plugin.
 *
 * Variant A keeps these document-level — no per-page node config — because
 * pages are derived, not authored.
 */
export type BasePaginationOptions = {
  /**
   * When true, page index 0 prefers the document's `firstPageHeader` /
   * `firstPageFooter` blocks over the regular `header` / `footer`. Word's
   * "Different first page" rule. Defaults to `false`.
   */
  firstPageDifferent: boolean;
  /** Footer slot height in CSS pixels. */
  footerHeight: number;
  /**
   * Whether footnote definitions render in each page footer well or remain as
   * end-of-document definition blocks.
   */
  footnotePlacement: FootnotePlacement;
  /** Footnote well height in CSS pixels (allocated bottom of each page). */
  footnoteWell: number;
  /** Header slot height in CSS pixels. */
  headerHeight: number;
  /**
   * Whether the React `PaginationPlugin` should bundle footnote sub-plugins
   * (`FootnoteDefinitionPlugin`, `FootnoteReferencePlugin`,
   * `FootnoteInputPlugin`). Defaults to `true`. Set to `false` when you want
   * pagination without footnote coupling.
   */
  includeFootnoteSubPlugins?: boolean;
  /** Page margin box. */
  margins: PageMargins;
  /**
   * Visualisation mode. Defaults to `standard` (continuous flow); flip to
   * `paged` to render the editor with per-page chrome.
   */
  mode: PaginationMode;
  /** Page sheet border styling. */
  pageBorder: PageBorder;
  /** Page-number slot config — region, alignment, format, offset, first-page hide. */
  pageNumber: PageNumberConfig;
  /** Resolved page size — preset key or literal `{ width, height }` in CSS pixels. */
  pageSize: PageSize;
  /** Side preview panel width in CSS pixels. */
  previewWidth: number;
  /**
   * Whether the side preview panel is visible. Toggled at runtime via
   * `editor.tf.pagination.togglePreview()`. Defaults to `true`.
   */
  previewVisible?: boolean;
};

/** Editor-API surface contributed by `BasePaginationPlugin`. */
export type BasePaginationApi = {
  pagination: {
    getFootnotes: (pageIndex: number) => TElement[];
    getPageOf: (path: number[]) => number;
    getPages: () => Page[];
    /** Whether a top-level `header` block currently exists in the doc. */
    hasHeader: () => boolean;
    /** Whether a top-level `footer` block currently exists in the doc. */
    hasFooter: () => boolean;
  };
};

/** Editor transforms contributed by `BasePaginationPlugin`. */
export type BasePaginationTransforms = {
  pagination: {
    insertPageBreak: () => void;
    /** Move footnote definitions between per-page footer wells and document end. */
    setFootnotePlacement: (placement: FootnotePlacement) => void;
    /** Set the footer band height in CSS pixels (`0` to disable). */
    setFooterHeight: (px: number) => void;
    /** Set the header band height in CSS pixels (`0` to disable). */
    setHeaderHeight: (px: number) => void;
    /**
     * Patch the in-flow `<w:pgMar>`-style margins. Only the keys provided
     * are updated; omitted sides keep their current values, so per-axis UI
     * can call e.g. `setMargins({ top: cmToPx(2.5) })` without rebuilding
     * the full margin box.
     */
    setMargins: (patch: Partial<PageMargins>) => void;
    /** Patch the rendered page sheet border. */
    setPageBorder: (patch: Partial<PageBorder>) => void;
    /**
     * Patch the page-number slot config. Only provided keys are merged; the
     * rest stay at their current values. Pass `{ region: 'header' }` to move
     * the slot to the header band without changing alignment or format.
     */
    setPageNumber: (patch: Partial<PageNumberConfig>) => void;
    /**
     * Toggle the Word-style "Different first page" rule. When `true`,
     * page index 0 prefers `firstPageHeader` / `firstPageFooter` blocks
     * over the regular ones.
     */
    setFirstPageDifferent: (next: boolean) => void;
    /** Switch between continuous-flow and paged visualisations. */
    setMode: (mode: PaginationMode) => void;
    /** Replace the resolved page size (preset key or `{width,height}`). */
    setPageSize: (size: PageSize) => void;
    /** Resize the page preview side panel. */
    setPreviewWidth: (width: number) => void;
    setFooter: (content: Descendant[]) => void;
    setHeader: (content: Descendant[]) => void;
    /** Toggle the document-level footer block; returns new presence. */
    toggleFooter: () => boolean;
    /** Toggle the document-level header block; returns new presence. */
    toggleHeader: () => boolean;
    /** Toggle the side preview panel; returns new visibility. */
    togglePreview: () => boolean;
  };
};

/** Plugin config tuple for `BasePaginationPlugin`. */
export type BasePaginationConfig = PluginConfig<
  typeof PAGINATION_KEY,
  BasePaginationOptions,
  BasePaginationApi,
  BasePaginationTransforms
>;
