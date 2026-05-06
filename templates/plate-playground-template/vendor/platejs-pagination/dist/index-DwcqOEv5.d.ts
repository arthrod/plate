import * as platejs3 from "platejs";
import { Descendant, KEYS, PluginConfig, TElement } from "platejs";

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
  /**
   * Page size token. `'A4'` and `'Letter'` are pre-resolved; any other string
   * is treated as a downstream registration key.
   */
  pageSize: 'A4' | 'Letter' | (string & {});
};
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
declare const BaseFooterPlugin: platejs3.SlatePlugin<platejs3.PluginConfig<"footer", {}, {}, {}, {}>>;
//#endregion
//#region src/lib/base-header-plugin.d.ts
/**
 * Block-level page-header element.
 *
 * Authored once per document; the render-overlay clones it onto every page.
 */
declare const BaseHeaderPlugin: platejs3.SlatePlugin<platejs3.PluginConfig<"header", {}, {}, {}, {}>>;
//#endregion
//#region src/lib/base-page-break-plugin.d.ts
/**
 * Hard page-break element.
 *
 * The render-overlay paginator splits a page boundary at every break node.
 */
declare const BasePageBreakPlugin: platejs3.SlatePlugin<platejs3.PluginConfig<"pageBreak", {}, {}, {}, {}>>;
//#endregion
//#region src/lib/base-pagination-plugin.d.ts
type BasePaginationApi = {
  pagination: {
    getFootnotes: (pageIndex: number) => TElement[];
    getPageOf: (path: number[]) => number;
    getPages: () => Page[];
  };
};
type BasePaginationTransforms = {
  pagination: {
    insertPageBreak: () => void;
    setFooter: (content: Descendant[]) => void;
    setHeader: (content: Descendant[]) => void;
  };
};
type BasePaginationConfig = PluginConfig<typeof KEYS.pagination, BasePaginationOptions, BasePaginationApi, BasePaginationTransforms>;
/**
 * Base orchestrator plugin for paginated layout.
 *
 * Variant A — render-time overlay; pages derived; pretext as height oracle.
 * The Slate document is unchanged; pagination is a render-only projection
 * layered onto the live editor via the Plate `render.afterEditable` slot.
 *
 * The page-chrome element family (header, footer, page break) is composed
 * here on the Slate base so a Slate-only consumer registering
 * `BasePaginationPlugin` already gets the element schema. React-only deltas
 * (footnote sub-plugins, overlay rendering) live in `src/react`.
 *
 * The API/transforms surface bridges to the per-editor `WeakMap` populated
 * by `usePageLayout` on the React side; in a pure-Slate environment the API
 * resolves to `[]`/`-1` until a measurer-equipped consumer wires pages in.
 */
declare const BasePaginationPlugin: platejs3.SlatePlugin<PluginConfig<"pagination", BasePaginationOptions, {
  pagination: {
    getFootnotes: (pageIndex: number) => TElement[];
    getPageOf: (path: number[]) => number;
    getPages: () => Page[];
  };
}, {
  pagination: {
    insertPageBreak: () => void;
    setFooter: (content: Descendant[]) => void;
    setHeader: (content: Descendant[]) => void;
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
export { BasePaginationTransforms as a, BaseFooterPlugin as c, Measurer as d, Page as f, PageRect as h, BasePaginationPlugin as i, allocateFootnotes as l, PageMargins as m, BasePaginationApi as n, BasePageBreakPlugin as o, PageContext as p, BasePaginationConfig as r, BaseHeaderPlugin as s, paginate as t, BasePaginationOptions as u };
//# sourceMappingURL=index-DwcqOEv5.d.ts.map