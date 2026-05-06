import * as platejs10 from "platejs";
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
    /**
     * Patch the in-flow `<w:pgMar>`-style margins. Only the keys provided
     * are updated; omitted sides keep their current values, so per-axis UI
     * can call e.g. `setMargins({ top: cmToPx(2.5) })` without rebuilding
     * the full margin box.
     */
    setMargins: (patch: Partial<PageMargins>) => void;
    /** Replace the resolved page size (preset key or `{width,height}`). */
    setPageSize: (size: PageSize) => void;
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
//#region src/lib/base-footer-plugin.d.ts
/**
 * Block-level page-footer element.
 *
 * Authored once per document; the render-overlay clones it onto every page
 * and runs the footnote-well allocator above it.
 */
declare const BaseFooterPlugin: platejs10.SlatePlugin<platejs10.PluginConfig<"footer", {}, {}, {}, {}>>;
//#endregion
//#region src/lib/base-header-plugin.d.ts
/**
 * Block-level page-header element.
 *
 * Authored once per document; the render-overlay clones it onto every page.
 */
declare const BaseHeaderPlugin: platejs10.SlatePlugin<platejs10.PluginConfig<"header", {}, {}, {}, {}>>;
//#endregion
//#region src/lib/base-page-break-plugin.d.ts
/**
 * Hard page-break element.
 *
 * The render-overlay paginator splits a page boundary at every break node.
 */
declare const BasePageBreakPlugin: platejs10.SlatePlugin<platejs10.PluginConfig<"pageBreak", {}, {}, {}, {}>>;
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
declare const BasePaginationPlugin: platejs10.SlatePlugin<platejs10.PluginConfig<"pagination", BasePaginationOptions, {
  pagination: {
    getFootnotes: (pageIndex: number) => platejs10.TElement[];
    getPageOf: (path: number[]) => number;
    getPages: () => Page[];
    hasHeader: () => boolean;
    hasFooter: () => boolean;
  };
}, {
  pagination: {
    insertPageBreak: () => void;
    setMargins: (patch: Partial<PageMargins>) => void;
    setPageSize: (size: PageSize) => void;
    setFooter: (content: platejs10.Descendant[]) => void;
    setHeader: (content: platejs10.Descendant[]) => void;
    toggleFooter: () => boolean;
    toggleHeader: () => boolean;
    togglePreview: () => boolean;
  };
}, {}>>;
//#endregion
//#region src/lib/paginate.d.ts
/**
 * Derive the page sequence from a flat list of top-level blocks.
 *
 * Variant A — render-overlay paginator. Walks the doc, calls
 * `measurer.measure(node, ctx)` per block, and bin-packs into page rects
 * honoring the `rect.contentHeight` budget. Page-break voids
 * (`type === KEYS.pageBreak`) are hard splits. Pages are derived; this
 * never mutates Slate state.
 *
 * Top-level `header`, `footer`, and `footnoteDefinition` blocks are
 * skipped — they render via the page chrome / footer well, not the body.
 *
 * @param doc Top-level Slate blocks (`editor.children`).
 * @param rect Resolved page geometry (see `resolvePageRect`).
 * @param ctx Per-document measurement context. `ctx.marksFingerprint` is
 *   the doc-level fallback when a block has no own marks.
 * @param measurer Pluggable height oracle. Inject a fake monospace one
 *   in tests; the React layer wires the DOM-backed measurer.
 */
declare const paginate: (doc: TElement[], rect: PageRect, ctx: PageContext, measurer: Measurer) => Page[];
//#endregion
//#region src/lib/internal/units.d.ts
declare const cmToPx: (cm: number) => number;
declare const inToPx: (inches: number) => number;
declare const pxToCm: (px: number) => number;
declare const pxToIn: (px: number) => number;
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
declare const getPaginationFootnotes: (editor: SlateEditor, pageIndex: number) => platejs10.TElement[];
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
/** Insert a default footer at the last index when none exists. */
declare const ensureFooter: (editor: SlateEditor) => void;
//#endregion
//#region src/lib/transforms/ensureHeader.d.ts
/**
 * Insert a default header at index 0 when none exists.
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
 * footer first and reinserting at the end of the doc.
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
 * header first and reinserting at index 0.
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
export { Page as A, BaseFooterPlugin as C, BasePaginationOptions as D, BasePaginationConfig as E, PageMargins as M, PageRect as N, BasePaginationTransforms as O, PageSize as P, BaseHeaderPlugin as S, BasePaginationApi as T, pxToCm as _, removeNodesByType as a, BasePaginationPlugin as b, ensureFooter as c, hasHeaderBlock as d, getPaginationFootnotes as f, inToPx as g, cmToPx as h, replaceFooter as i, PageContext as j, Measurer as k, enforceHeaderFooterInvariants as l, getPageOfPath as m, toggleFooter as n, insertPageBreak as o, getPaginationPages as p, replaceHeader as r, ensureHeader as s, toggleHeader as t, hasFooterBlock as u, pxToIn as v, allocateFootnotes as w, BasePageBreakPlugin as x, paginate as y };
//# sourceMappingURL=index-BjxU94y9.d.ts.map