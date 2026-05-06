import type { TElement } from 'platejs';

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
  /** Footer slot height in CSS pixels. */
  footerHeight: number;
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
  /** Resolved page size — preset key or literal `{ width, height }` in CSS pixels. */
  pageSize: PageSize;
  /**
   * Whether the side preview panel is visible. Toggled at runtime via
   * `editor.tf.pagination.togglePreview()`. Defaults to `true`.
   */
  previewVisible?: boolean;
};
