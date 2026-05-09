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

/**
 * Where footnote definitions render in the paginated view.
 *
 * The four canonical OOXML-aligned modes:
 * - `pageBottom` — footer well of the page that holds the reference (Word default).
 * - `beneathText` — directly below the paragraph that holds the reference.
 * - `sectEnd` — accumulated at the section's last page.
 * - `docEnd` — accumulated at the document's last page.
 *
 * The legacy aliases `'footer'` and `'documentEnd'` are accepted for
 * backwards compatibility and map to `pageBottom` / `docEnd` respectively.
 *
 * v1 implements `pageBottom` and `docEnd`. `beneathText` and `sectEnd` are
 * accepted by the type but allocator falls back to `pageBottom` with a
 * one-time console warning until phase 2.
 */
export type FootnotePlacement =
  | 'beneathText'
  | 'docEnd'
  | 'documentEnd'
  | 'footer'
  | 'pageBottom'
  | 'sectEnd';

/** Display format for rendered page numbers. */
export type PageNumberFormat =
  | '1/N'
  | 'decimal'
  | 'letter'
  | 'page-of-n'
  | 'roman';

/** Horizontal alignment slot inside the chrome region. */
export type PageNumberAlign = 'center' | 'left' | 'right';

/** Which chrome band the page number paints into. */
export type PageNumberRegion = 'footer' | 'header';

/**
 * Structured page-number configuration consumed by `<PageNumber>` in
 * `PageFrame`. `null` (or omitted) disables the rendered page number — pages
 * still exist, they just don't paint a number into chrome.
 */
export type PageNumberConfig = {
  /** Horizontal slot inside the chrome region. */
  align: PageNumberAlign;
  /** Format token. `decimal` → `1`, `roman` → `I`, etc. */
  format: PageNumberFormat;
  /** Suppress on `pageIndex === 0`. Word's "Different first page" default. */
  hideOnFirst: boolean;
  /** Which chrome band paints the number. */
  region: PageNumberRegion;
  /** First page's printed number (Word's `pgNumType.start`). Defaults to 1. */
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
   * When any header / footer / first-page chrome holds the editor selection,
   * the body editor visually dims to ~50% opacity with a 200ms transition.
   * This is how Word and Pages signal "you are editing chrome, not body".
   * Defaults to `true`. Honors `prefers-reduced-motion`.
   */
  chromeFocusDimsBody?: boolean;
  /**
   * When `firstPageDifferent` is true and this content is set, page index 0
   * paints this footer chrome instead of the document-level `footer` block.
   * If unset, page 0 paints no footer chrome (matches Word's default for
   * "Different first page" with empty title-page footer).
   */
  firstPageFooter?: Descendant[];
  /**
   * When `firstPageDifferent` is true and this content is set, page index 0
   * paints this header chrome instead of the document-level `header` block.
   * If unset, page 0 paints no header chrome.
   */
  firstPageHeader?: Descendant[];
  /**
   * Word/Pages "Different first page" toggle. When `true`, page index 0
   * resolves chrome via `firstPageHeader`/`firstPageFooter` (or no chrome if
   * unset) instead of the document-level `header`/`footer` blocks. Pages
   * past the first always use the document-level chrome.
   */
  firstPageDifferent?: boolean;
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
  /**
   * Structured page-number configuration. `null` or omitted disables the
   * rendered page-number entirely. When set, `<PageNumber>` is painted into
   * the configured chrome band as a non-editable React element (never a
   * Slate void), so body selection cannot delete or move it.
   */
  pageNumber?: PageNumberConfig | null;
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
    /** Toggle / set body-dim-on-chrome-focus UX. Defaults to `true`. */
    setChromeFocusDimsBody: (value: boolean) => void;
    /** Toggle Word's "Different first page" rule. */
    setFirstPageDifferent: (value: boolean) => void;
    /** Replace the first-page footer chrome content. Pass `null` to clear. */
    setFirstPageFooter: (content: Descendant[] | null) => void;
    /** Replace the first-page header chrome content. Pass `null` to clear. */
    setFirstPageHeader: (content: Descendant[] | null) => void;
    /** Move footnote definitions between per-page footer wells and document end. */
    setFootnotePlacement: (placement: FootnotePlacement) => void;
    /**
     * Patch the in-flow `<w:pgMar>`-style margins. Only the keys provided
     * are updated; omitted sides keep their current values, so per-axis UI
     * can call e.g. `setMargins({ top: cmToPx(2.5) })` without rebuilding
     * the full margin box.
     */
    setMargins: (patch: Partial<PageMargins>) => void;
    /** Patch the rendered page sheet border. */
    setPageBorder: (patch: Partial<PageBorder>) => void;
    /** Switch between continuous-flow and paged visualisations. */
    setMode: (mode: PaginationMode) => void;
    /**
     * Replace or clear the structured page-number config. Pass `null` to
     * disable the painted page number entirely.
     */
    setPageNumber: (config: PageNumberConfig | null) => void;
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

/**
 * Canonicalize a {@link FootnotePlacement} value to its OOXML-aligned form,
 * collapsing the legacy aliases. Used by the allocator and renderer so
 * downstream code only has to switch on the four canonical modes.
 */
export const canonicalFootnotePlacement = (
  placement: FootnotePlacement
): 'beneathText' | 'docEnd' | 'pageBottom' | 'sectEnd' => {
  switch (placement) {
    case 'documentEnd':
    case 'docEnd': {
      return 'docEnd';
    }
    case 'footer':
    case 'pageBottom': {
      return 'pageBottom';
    }
    case 'beneathText':
    case 'sectEnd': {
      return placement;
    }
    default: {
      return 'pageBottom';
    }
  }
};

/** Plugin config tuple for `BasePaginationPlugin`. */
export type BasePaginationConfig = PluginConfig<
  typeof PAGINATION_KEY,
  BasePaginationOptions,
  BasePaginationApi,
  BasePaginationTransforms
>;
