import * as platejs5 from "platejs";
import { Descendant, PluginConfig, SlateEditor, TElement } from "platejs";

//#region src/lib/internal/keys.d.ts

/**
 * Plugin keys hard-coded inside the package so the published `platejs`
 * `KEYS` object isn't required to know about them. The workspace `KEYS`
 * also exposes these (`KEYS.pagination`, `KEYS.pageBreak`) for downstream
 * consumers that prefer the central registry — keep these strings in sync.
 */
declare const PAGINATION_KEY = "pagination";
//#endregion
//#region src/lib/types.d.ts
/** Page geometry in CSS pixels. */
type PageRect = {
  contentHeight: number;
  contentWidth: number;
  height: number;
  width: number;
};
/** Page margin box in CSS pixels. */
type PageMargins = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};
/** Page sheet border styling in CSS pixels. */
type PageBorder = {
  color: string;
  radius: number;
  shadow: string;
  style: 'dashed' | 'none' | 'solid';
  width: number;
};
/** Where footnote definitions render in the paginated view. */
type FootnotePlacement = 'documentEnd' | 'footer';
/** Which chrome band paints the page-number slot. */
type PageNumberRegion = 'footer' | 'header';
/** Horizontal alignment of the page-number slot inside its chrome band. */
type PageNumberAlign = 'center' | 'left' | 'right';
/**
 * Display format for the page-number slot.
 *
 * - `'1'` — bare number (`1`, `2`, …)
 * - `'1/N'` — current/total (`1/12`)
 * - `'Page 1 of N'` — verbose form (`Page 1 of 12`)
 */
type PageNumberFormat = '1' | '1/N' | 'Page 1 of N';
/**
 * Page-number slot configuration.
 *
 * Painted inside the chrome band selected by `region`, aligned per `align`,
 * formatted per `format`. `startAt` offsets the displayed number (1 means the
 * first page reads "1"; 5 would make it read "5"). `hideOnFirst` suppresses
 * the slot on page index 0 (e.g. cover pages).
 */
type PageNumberConfig = {
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
type PaginationMode = 'paged' | 'standard';
/**
 * Page size resolves to a preset key (`'A4'`, `'Letter'`, `'Legal'`) or a
 * literal `{ width, height }` in CSS pixels. The string-`(string & {})`
 * branch is reserved for future registry-based presets.
 */
type PageSize = 'A4' | 'Legal' | 'Letter' | (string & {}) | {
  height: number;
  width: number;
};
/**
 * Resolved layout context for one paginated page.
 *
 * Variant A (render-overlay) consumes pages as a derived view of the live
 * document; nothing here is persisted in the Slate value.
 */
type Page = {
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
type PageContext = {
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
type Measurer = {
  measure: (node: TElement, ctx: PageContext) => number;
};
/**
 * Public options for the base pagination plugin.
 *
 * Variant A keeps these document-level — no per-page node config — because
 * pages are derived, not authored.
 */
type BasePaginationOptions = {
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
type BasePaginationApi = {
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
type BasePaginationTransforms = {
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
type BasePaginationConfig = PluginConfig<typeof PAGINATION_KEY, BasePaginationOptions, BasePaginationApi, BasePaginationTransforms>;
//#endregion
//#region src/lib/allocate-footnotes.d.ts
/**
 * Greedy assignment of footnote definitions to per-page footer wells.
 *
 * Walks each page's blocks, collects every inline `footnoteReference` by its
 * `identifier` field, then attaches the matching definition (looked up in
 * the document-level definition list) to that page. Definitions referenced
 * on multiple pages attach to the first page that references them.
 *
 * Returns a new array of {@link Page} objects with `footnotes` populated.
 * The original `pages` argument is not mutated.
 */
declare const allocateFootnotes: (pages: Page[], footnotes: TElement[]) => Page[];
//#endregion
//#region src/lib/base-first-page-footer-plugin.d.ts
/**
 * Block-level first-page footer element.
 *
 * Authored once per document; rendered in place of the regular `footer` on
 * page index 0 when `BasePaginationOptions.firstPageDifferent === true`.
 * Skipped by the paginator like the regular footer.
 */
declare const BaseFirstPageFooterPlugin: platejs5.SlatePlugin<platejs5.PluginConfig<"firstPageFooter", {}, {}, {}, {}>>;
//#endregion
//#region src/lib/base-first-page-header-plugin.d.ts
/**
 * Block-level first-page header element.
 *
 * Authored once per document; rendered in place of the regular `header` on
 * page index 0 when `BasePaginationOptions.firstPageDifferent === true`.
 * Skipped by the paginator like the regular header so it never lands inside
 * a page's content rect.
 */
declare const BaseFirstPageHeaderPlugin: platejs5.SlatePlugin<platejs5.PluginConfig<"firstPageHeader", {}, {}, {}, {}>>;
//#endregion
//#region src/lib/base-footer-plugin.d.ts
/**
 * Block-level page-footer element.
 *
 * Authored once per document; the render-overlay clones it onto every page
 * and runs the footnote-well allocator above it.
 */
declare const BaseFooterPlugin: platejs5.SlatePlugin<platejs5.PluginConfig<"footer", {}, {}, {}, {}>>;
//#endregion
//#region src/lib/base-header-plugin.d.ts
/**
 * Block-level page-header element.
 *
 * Authored once per document; the render-overlay clones it onto every page.
 */
declare const BaseHeaderPlugin: platejs5.SlatePlugin<platejs5.PluginConfig<"header", {}, {}, {}, {}>>;
//#endregion
//#region src/lib/base-page-break-plugin.d.ts
/**
 * Hard page-break element.
 *
 * The render-overlay paginator splits a page boundary at every break node.
 */
declare const BasePageBreakPlugin: platejs5.SlatePlugin<platejs5.PluginConfig<"pageBreak", {}, {}, {}, {}>>;
//#endregion
//#region src/lib/base-pagination-plugin.d.ts
/**
 * Base orchestrator plugin for paginated layout.
 *
 * Variant A — render-time overlay; pages derived; pretext as height oracle.
 * The Slate document is unchanged; pagination is a render-only projection
 * layered onto the live editor via the Plate `render.afterEditable` slot.
 *
 * Header/footer presence is derived from `editor.children` (single source of
 * truth) — undo and paste survive correctly because we don't mirror the
 * presence to a plugin option that lives outside Slate history.
 *
 * The page-chrome element family (header, footer, page break) is composed
 * here on the Slate base so a Slate-only consumer registering
 * `BasePaginationPlugin` already gets the element schema. React-only deltas
 * (footnote sub-plugins, overlay rendering) live in `src/react`.
 */
declare const BasePaginationPlugin: platejs5.SlatePlugin<platejs5.PluginConfig<"pagination", BasePaginationOptions, {
  pagination: {
    getFootnotes: (pageIndex: number) => platejs5.TElement[];
    getPageOf: (path: number[]) => number;
    getPages: () => Page[];
    hasHeader: () => boolean;
    hasFooter: () => boolean;
  };
}, {
  pagination: {
    insertPageBreak: () => void;
    setFootnotePlacement: (placement: FootnotePlacement) => void;
    setFooterHeight: (px: number) => void;
    setHeaderHeight: (px: number) => void;
    setMargins: (patch: Partial<PageMargins>) => void;
    setPageBorder: (patch: Partial<PageBorder>) => void;
    setPageNumber: (patch: Partial<PageNumberConfig>) => void;
    setFirstPageDifferent: (next: boolean) => void;
    setMode: (mode: PaginationMode) => void;
    setPageSize: (size: PageSize) => void;
    setPreviewWidth: (width: number) => void;
    setFooter: (content: platejs5.Descendant[]) => void;
    setHeader: (content: platejs5.Descendant[]) => void;
    toggleFooter: () => boolean;
    toggleHeader: () => boolean;
    togglePreview: () => boolean;
  };
}, {}>>;
//#endregion
//#region src/lib/paginate.d.ts
type PaginateOptions = Partial<Pick<BasePaginationOptions, 'footnotePlacement'>> & {
  ctx: PageContext;
  doc: TElement[];
  measurer: Measurer;
  rect: PageRect;
};
/**
 * Derive the page sequence from a flat list of top-level blocks.
 *
 * Variant A — render-overlay paginator. Walks the doc, calls
 * `measurer.measure(node, ctx)` per block, and bin-packs into page rects
 * honoring the `rect.contentHeight` budget. Page-break voids
 * (`type === KEYS.pageBreak`) are hard splits. Pages are derived; this
 * never mutates Slate state.
 *
 * Top-level `header` and `footer` blocks are skipped because they render via
 * the page chrome. `footnoteDefinition` blocks are skipped only when
 * footnotes render in page footer wells.
 *
 * @param doc Top-level Slate blocks (`editor.children`).
 * @param rect Resolved page geometry (see `resolvePageRect`).
 * @param ctx Per-document measurement context. `ctx.marksFingerprint` is
 *   the doc-level fallback when a block has no own marks.
 * @param measurer Pluggable height oracle. Inject a fake monospace one
 *   in tests; the React layer wires the DOM-backed measurer.
 */
declare const paginate: ({
  ctx,
  doc,
  footnotePlacement,
  measurer,
  rect
}: PaginateOptions) => Page[];
//#endregion
//#region src/lib/resolve-options.d.ts
/**
 * Defaults for pagination options. Single source of truth for the option
 * shape consumed by `paginate()`, `resolvePageRect()`, and the React
 * overlay. The base plugin spreads these into its `options` block; the
 * React wrapper consumes them via {@link resolvePaginationOptions}
 * instead of re-defining defaults inside a hook.
 */
declare const PAGINATION_OPTION_DEFAULTS: BasePaginationOptions;
/**
 * Resolve a partial options bag against {@link PAGINATION_OPTION_DEFAULTS}.
 * Used by the React overlay/layout hook so defaults live in `src/lib`
 * rather than being redefined inside a React wrapper.
 */
declare const resolvePaginationOptions: (partial: Partial<BasePaginationOptions> | undefined) => BasePaginationOptions;
//#endregion
//#region src/lib/queries/getPageOfPath.d.ts
/**
 * Map a top-level Slate path to its derived page index. Returns `-1` when
 * the path is empty or the top block is not present in the page snapshot.
 */
declare const getPageOfPath: (editor: SlateEditor, path: number[]) => number;
//#endregion
//#region src/lib/queries/getPaginationPages.d.ts
/**
 * Read the latest derived page sequence stored on the editor by the React
 * pagination overlay. Returns an empty array when no pagination cycle has
 * run yet.
 */
declare const getPaginationPages: (editor: SlateEditor) => Page[];
/** Return the footnotes allocated to a given page index. */
declare const getPaginationFootnotes: (editor: SlateEditor, pageIndex: number) => platejs5.TElement[];
//#endregion
//#region src/lib/queries/hasChromeBlock.d.ts
/** Whether a top-level `header` block currently exists in the doc. */
declare const hasHeaderBlock: (editor: SlateEditor) => boolean;
/** Whether a top-level `footer` block currently exists in the doc. */
declare const hasFooterBlock: (editor: SlateEditor) => boolean;
//#endregion
//#region src/lib/transforms/enforceHeaderFooterInvariants.d.ts
/**
 * Single header at index 0; single footer somewhere in the doc. Dedupes
 * stray copies and pulls a misplaced header to the top — keeps paste/undo
 * from producing duplicates without fighting other plugins (notably any
 * trailing-block plugin that requires the last child to be a paragraph).
 *
 * Performs at most one mutation per call and returns `true` when something
 * was changed. The caller (`normalizeNode` override) re-queues by short-
 * circuiting so Slate triggers the next iteration with fresh indices —
 * this prevents stale-index loops and infinite normalization passes.
 *
 * Footer position is intentionally unconstrained: pagination's `paginate()`
 * locates the footer by type, not by tree index, so a trailing paragraph
 * after the footer does not break correctness — and trying to keep the
 * footer "last" would loop with plugins that always append a trailing block.
 */
declare const enforceHeaderFooterInvariants: (editor: SlateEditor) => boolean;
//#endregion
//#region src/lib/transforms/ensureFooter.d.ts
/**
 * Insert an empty footer at the last index when none exists.
 *
 * Empty children — same rationale as `ensureHeader`: the chrome band looks
 * like Google Docs (blank, focusable, optional CSS placeholder hint) rather
 * than persisting the literal word "Footer" inside the document body.
 */
declare const ensureFooter: (editor: SlateEditor) => void;
//#endregion
//#region src/lib/transforms/ensureHeader.d.ts
/**
 * Insert an empty header at index 0 when none exists.
 *
 * The inserted node has empty text so the chrome region looks like Google
 * Docs — a blank, focusable band that displays a placeholder hint via CSS
 * (see `apps/www/src/registry/components/.../header-element.tsx`) instead
 * of the literal word "Header" baked into the document content. Inserting
 * placeholder text inside `editor.children` would persist into DOCX export
 * and round-trip back as authored content.
 *
 * Uses the package-local `HEADER_KEY` constant rather than `KEYS.header`
 * from `platejs` — older published versions of `platejs` are missing the
 * pagination keys in their `KEYS` export, which would silently produce
 * `editor.getType(undefined) === ''` and insert nodes with an empty type.
 */
declare const ensureHeader: (editor: SlateEditor) => void;
//#endregion
//#region src/lib/transforms/insertPageBreak.d.ts
/** Insert a hard page-break void at the current selection. */
declare const insertPageBreak: (editor: SlateEditor) => void;
//#endregion
//#region src/lib/transforms/removeNodesByType.d.ts
/**
 * Remove every top-level child whose `type` matches `type`. Iterates from the
 * end so removed indices don't invalidate the loop.
 */
declare const removeNodesByType: (editor: SlateEditor, type: string) => void;
//#endregion
//#region src/lib/transforms/replaceFooter.d.ts
/**
 * Replace the top-level footer block with `content`, removing any existing
 * footer(s) first and reinserting at the end of the doc.
 *
 * Wrapped in `withoutNormalizing` so the remove + insert lands as one atomic
 * step — otherwise the intermediate "no footer" state can fight with the
 * `enforceHeaderFooterInvariants` normalizer and stall.
 */
declare const replaceFooter: (editor: SlateEditor, content: Descendant[]) => void;
//#endregion
//#region src/lib/transforms/replaceHeader.d.ts
/**
 * Replace the top-level header block with `content`, removing any existing
 * header(s) first and reinserting at index 0.
 *
 * Wrapped in `withoutNormalizing` so the remove + insert lands as one atomic
 * step — otherwise the intermediate "no header" state can fight with the
 * `enforceHeaderFooterInvariants` normalizer and stall.
 */
declare const replaceHeader: (editor: SlateEditor, content: Descendant[]) => void;
//#endregion
//#region src/lib/transforms/toggleFooter.d.ts
/**
 * Toggle the document-level footer block; returns new presence.
 *
 * Runs the insert/remove inside `withoutNormalizing` so the final tree shape
 * is committed in one pass — that gives the `enforceHeaderFooterInvariants`
 * normalizer a stable input to evaluate, instead of a half-applied state.
 */
declare const toggleFooter: (editor: SlateEditor) => boolean;
//#endregion
//#region src/lib/transforms/toggleHeader.d.ts
/**
 * Toggle the document-level header block; returns new presence.
 *
 * Runs the insert/remove inside `withoutNormalizing` so the final tree shape
 * is committed in one pass — that gives the `enforceHeaderFooterInvariants`
 * normalizer a stable input to evaluate, instead of a half-applied state.
 */
declare const toggleHeader: (editor: SlateEditor) => boolean;
//#endregion
export { FootnotePlacement as A, PageRect as B, BaseFirstPageHeaderPlugin as C, BasePaginationConfig as D, BasePaginationApi as E, PageMargins as F, PaginationMode as H, PageNumberAlign as I, PageNumberConfig as L, Page as M, PageBorder as N, BasePaginationOptions as O, PageContext as P, PageNumberFormat as R, BaseFooterPlugin as S, allocateFootnotes as T, PageSize as V, PaginateOptions as _, removeNodesByType as a, BasePageBreakPlugin as b, ensureFooter as c, hasHeaderBlock as d, getPaginationFootnotes as f, resolvePaginationOptions as g, PAGINATION_OPTION_DEFAULTS as h, replaceFooter as i, Measurer as j, BasePaginationTransforms as k, enforceHeaderFooterInvariants as l, getPageOfPath as m, toggleFooter as n, insertPageBreak as o, getPaginationPages as p, replaceHeader as r, ensureHeader as s, toggleHeader as t, hasFooterBlock as u, paginate as v, BaseFirstPageFooterPlugin as w, BaseHeaderPlugin as x, BasePaginationPlugin as y, PageNumberRegion as z };
//# sourceMappingURL=index-CfyQq3q9.d.ts.map