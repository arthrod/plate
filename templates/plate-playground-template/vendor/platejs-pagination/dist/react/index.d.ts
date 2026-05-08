import { A as Page, D as BasePaginationTransforms, E as BasePaginationOptions, N as PageMargins, j as PageBorder, k as Measurer, w as BasePaginationApi } from "../index-fQ6tvSMT";
import * as platejs0 from "platejs";
import { SlateEditor, TElement } from "platejs";
import * as platejs_react0 from "platejs/react";
import { PlateEditor } from "platejs/react";
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
declare const FootnotePortal: ({
  enabled,
  footnoteDefinitionType
}: {
  enabled: boolean;
  footnoteDefinitionType: string;
}) => React.JSX.Element | null;
//#endregion
//#region src/react/header-plugin.d.ts
declare const HeaderPlugin: platejs_react0.PlatePlugin<platejs0.PluginConfig<"header", {}, {}, {}, {}>>;
//#endregion
//#region src/react/margins-dialog.d.ts
/**
 * Dialog UI for editing the four-sided margin box.
 *
 * Reads / writes through `editor.tf.pagination.setMargins(patch)`. The unit
 * selector is purely presentational — internally the plugin always stores
 * margins in CSS pixels (matching `<w:pgMar>` semantics for export).
 *
 * The host opens this dialog from the toolbar when the user picks
 * `Custom…`. v1 ships a minimal native `<dialog>`; the host may swap for a
 * shadcn/Radix Dialog while keeping this state-management contract.
 */
declare const MarginsDialog: ({
  onClose,
  open
}: {
  onClose: () => void;
  open: boolean;
}) => React.JSX.Element | null;
//#endregion
//#region src/react/page-break-plugin.d.ts
declare const PageBreakPlugin: platejs_react0.PlatePlugin<platejs0.PluginConfig<"pageBreak", {}, {}, {}, {}>>;
//#endregion
//#region src/react/page-frame.d.ts
type PageFrameProps = {
  /**
   * Resolved chrome heights and margin box from `BasePaginationOptions`.
   * Margins are passed through so header/footer/content slots respect the
   * authored page geometry instead of hardcoded insets.
   */
  chrome: {
    footerHeight: number;
    footnoteWell: number;
    headerHeight: number;
    margins: PageMargins;
    pageBorder: PageBorder;
  };
  /** First-class footer element copied off the document, if any. */
  documentFooter?: TElement;
  /** First-class header element copied off the document, if any. */
  documentHeader?: TElement;
  editor: PlateEditor;
  footnotesInFooter: boolean;
  page: Page;
  /** Vertical position of the page in the overlay coordinate space. */
  top: number;
};
/**
 * Single page chrome rendered by the overlay: header band, content rect,
 * footnote well, footer band — with content rendered through `PlateStatic`
 * using the live editor's plugin list, minus editor-chrome render hooks.
 */
declare const PageFrame: ({
  chrome,
  documentFooter,
  documentHeader,
  editor,
  footnotesInFooter,
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
 *
 * Hydration: the underlying measurer falls back to font-derived heights on
 * SSR which can disagree with client-side layout, so the panel waits for
 * `useEffect` (client-only) before painting. This avoids React #418 hydration
 * mismatches when the page count differs between server and client.
 */
declare const PageOverlay: () => React.JSX.Element | null;
declare const computeThumbScale: (pageWidth: number, panelInnerWidth?: number) => number;
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
//#region src/react/pagination-toolbar.d.ts
/**
 * Single toolbar dropdown that owns BOTH the visualisation mode and the
 * paper preset. Picking a paper preset implies paged mode; picking
 * `Standard` flips to continuous flow.
 *
 * `Custom…` opens the margins dialog (toggled by raising the
 * `onCustomRequested` callback). The dialog itself is rendered by the host
 * application — keeping this component portable across UI libraries.
 */
declare const PaginationToolbar: ({
  onCustomRequested
}: {
  onCustomRequested?: () => void;
}) => React.JSX.Element;
//#endregion
//#region src/react/standard-frame.d.ts
/**
 * Header chrome for `mode: 'standard'` — rendered via `render.beforeEditable`
 * so it sits above the live `<Editable />` without wrapping it.
 *
 * Returns `null` in paged mode (PageOverlay paints chrome inside each frame
 * instead).
 */
declare const StandardHeaderRail: () => React.JSX.Element | null;
/**
 * `render.afterEditable` slot — owns:
 * - end-of-doc footnote well (standard mode only),
 * - hybrid sticky/anchored footer chrome (standard mode only),
 * - the existing page-thumbnail side panel (paged mode only — delegates
 *   to `PageOverlay`).
 */
declare const StandardFooterAndPanel: () => React.JSX.Element | null;
//#endregion
//#region src/react/use-pretext-measurer.d.ts
/**
 * Returns a {@link Measurer} backed by `@chenglou/pretext` and a per-instance
 * height cache.
 *
 * For each block the measurer scrapes the rendered DOM element via
 * `editor.api.toDOMNode(node)` and reads `getComputedStyle(...).font`. The
 * `system-ui` family is rewritten to `Inter` because pretext's accuracy
 * tables cover named families only. Mixed-mark blocks fall through to
 * `prepareRichInline()` so per-run font weights/styles measure correctly.
 *
 * Cache key is `(node.id, marksFingerprint, font, width, contentHash)`. The
 * `contentHash` invalidates the entry when text changes without the
 * `node.id` rotating (Slate mutates `children` in place).
 */
declare const usePretextMeasurer: (editor: SlateEditor) => Measurer;
//#endregion
export { FooterPlugin, FootnotePortal, HeaderPlugin, MarginsDialog, PageBreakPlugin, PageFrame, PageFrameProps, PageOverlay, PaginationPlugin, PaginationToolbar, StandardFooterAndPanel, StandardHeaderRail, computeThumbScale, usePretextMeasurer };
//# sourceMappingURL=index.d.ts.map