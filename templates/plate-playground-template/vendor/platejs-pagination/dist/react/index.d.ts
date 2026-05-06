import { a as BasePaginationTransforms, d as Measurer, f as Page, n as BasePaginationApi, u as BasePaginationOptions } from "../index-DflHVnvF";
import * as platejs0 from "platejs";
import { TElement } from "platejs";
import * as platejs_react0 from "platejs/react";
import * as React from "react";

//#region src/react/footer-plugin.d.ts
declare const FooterPlugin: platejs_react0.PlatePlugin<platejs0.PluginConfig<"footer", {}, {}, {}, {}>>;
//#endregion
//#region src/react/footnote-portal.d.ts
/**
 * Variant A — CodeRabbit Design Choice 2: footnote definitions stay in the
 * Slate tree so editing/selection/keyboard nav are unaffected, but in-flow
 * appearances are hidden via CSS while the visible representation lives in
 * the per-page footer well painted by `PageFrame`.
 *
 * This component injects the global stylesheet rule that hides
 * footnote-definition blocks from the editor body. The visible copy in the
 * footer well is a snapshot rendered by `PageFrame`; bidirectional editing
 * inside the well is intentionally out of scope for variant A — `print`
 * mode (follow-up) renders real DOM in the well via a `createPortal`.
 */
declare const FootnotePortal: () => React.JSX.Element;
//#endregion
//#region src/react/header-plugin.d.ts
declare const HeaderPlugin: platejs_react0.PlatePlugin<platejs0.PluginConfig<"header", {}, {}, {}, {}>>;
//#endregion
//#region src/react/page-break-plugin.d.ts
declare const PageBreakPlugin: platejs_react0.PlatePlugin<platejs0.PluginConfig<"pageBreak", {}, {}, {}, {}>>;
//#endregion
//#region src/react/page-frame.d.ts
type PageFrameProps = {
  /** Resolved chrome heights from `BasePaginationOptions`. */
  chrome: {
    footerHeight: number;
    footnoteWell: number;
    headerHeight: number;
  };
  /** First-class footer element copied off the document, if any. */
  documentFooter?: TElement;
  /** First-class header element copied off the document, if any. */
  documentHeader?: TElement;
  page: Page;
  /** Vertical position of the page in the overlay coordinate space. */
  top: number;
};
/**
 * Single page chrome rendered by the overlay: header band, content rect,
 * footnote well, footer band — plus a faithful mini-rendering of each block
 * in the body so the panel doubles as a content-aware preview.
 */
declare const PageFrame: ({
  chrome,
  documentFooter,
  documentHeader,
  page,
  top
}: PageFrameProps) => React.JSX.Element;
//#endregion
//#region src/react/page-overlay.d.ts
/**
 * Render-overlay shell mounted via `render.afterEditable`.
 *
 * Variant A — CodeRabbit Design Choice 1: pages are derived at render time
 * and painted as a side-panel preview on top of the live editor. The Slate
 * document is never mutated by this component.
 *
 * Visibility is controlled by the plugin option `previewVisible`, toggled
 * via `editor.tf.pagination.togglePreview()`. When hidden the component
 * still mounts (so the toggle stays reactive) but renders nothing.
 *
 * Updates reactively as the document changes via `useEditorValue`.
 */
declare const PageOverlay: () => React.JSX.Element | null;
//#endregion
//#region src/react/pagination-plugin.d.ts
/**
 * React-side pagination plugin (variant A).
 *
 * - Lifts the page-chrome element plugins (header, footer, page break) to the
 *   React surface. The Slate-side composition lives on `BasePaginationPlugin`.
 * - Optionally bundles the footnote sub-plugins (default `true`); set
 *   `options.includeFootnoteSubPlugins = false` to opt out of footnote
 *   coupling.
 * - Mounts the {@link PageOverlay} via `render.afterEditable` so pages are
 *   painted as a derived overlay on top of the live editor (CodeRabbit
 *   Design Choice 1).
 * - Mounts {@link FootnotePortal} alongside the overlay to hide in-flow
 *   `footnoteDefinition` blocks (CodeRabbit Design Choice 2). The visible
 *   copy is rendered inside each page's footnote well by `PageFrame`.
 */
declare const PaginationPlugin: platejs_react0.PlatePlugin<platejs0.PluginConfig<"pagination", BasePaginationOptions, BasePaginationApi, BasePaginationTransforms, {}>>;
//#endregion
//#region src/react/use-pretext-measurer.d.ts
/**
 * Returns a {@link Measurer} backed by a canvas-based text-width oracle plus
 * the per-instance {@link MeasureCache}.
 *
 * Cache key matches CodeRabbit Design Choice 3:
 * `(node.id, marks-fingerprint, font, width)`. The hook owns the cache so
 * measured heights survive React re-renders. The cache resets when the
 * editor instance changes (the hook receives a new `editorId` per editor).
 *
 * The interface mirrors the future `@chenglou/pretext`-backed measurer; only
 * the internals change when pretext is wired in. Until then, this DOM-based
 * estimator is more than accurate enough for paginating typical prose.
 */
declare const usePretextMeasurer: (editorId?: string) => Measurer;
//#endregion
export { FooterPlugin, FootnotePortal, HeaderPlugin, PageBreakPlugin, PageFrame, PageFrameProps, PageOverlay, PaginationPlugin, usePretextMeasurer };
//# sourceMappingURL=index.d.ts.map