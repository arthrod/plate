import { A as Page, D as BasePaginationTransforms, E as BasePaginationOptions, N as PageMargins, j as PageBorder, k as Measurer, w as BasePaginationApi } from "../index-fQ6tvSMT";
import * as platejs1 from "platejs";
import { SlateEditor, TElement } from "platejs";
import * as platejs_react1 from "platejs/react";
import { PlateEditor } from "platejs/react";
import * as React from "react";

//#region src/react/footer-plugin.d.ts
declare const FooterPlugin: platejs_react1.PlatePlugin<platejs1.PluginConfig<"footer", {}, {}, {}, {}>>;
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
declare const HeaderPlugin: platejs_react1.PlatePlugin<platejs1.PluginConfig<"header", {}, {}, {}, {}>>;
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
declare const PageBreakPlugin: platejs_react1.PlatePlugin<platejs1.PluginConfig<"pageBreak", {}, {}, {}, {}>>;
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
 * Paged view (variant A — full takeover).
 *
 * - `mode === 'paged'`: hides the live `<Editable />` via a global
 *   `data-plate-pagination-mode="paged"` attribute on `<body>` (consumer
 *   stylesheet uses `body[data-plate-pagination-mode='paged'] [data-slate-editor] { display: none }`)
 *   and stacks `PageFrame`s vertically. Content inside each frame is
 *   rendered via `PlateStatic` (read-only) so users see the document laid
 *   out exactly as it will print.
 * - `mode === 'standard'`: renders absolutely nothing (besides the
 *   {@link FootnotePortal} which hides in-flow footnote definitions when
 *   the option opts in). The editor stays in continuous-flow mode.
 *
 * The `afterEditable` slot is the right home for the paged view because
 * it sits inside the Plate provider (so `usePluginOption`/`useEditorRef`
 * work) and runs after the Editable mounts, so the global attribute hook
 * applies before the live editor would otherwise show through.
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
declare const PaginationPlugin: platejs_react1.PlatePlugin<platejs1.PluginConfig<"pagination", BasePaginationOptions, BasePaginationApi, BasePaginationTransforms, {}>>;
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
 * `render.beforeEditable` slot — intentionally empty.
 *
 * Standard mode (`mode === 'standard'`) shows NO chrome anywhere: the editor
 * is presented as a continuous flow with no header band, no footer band, no
 * footnote well — exactly as if pagination were disabled.
 *
 * Paged mode (`mode === 'paged'`) renders all chrome inside per-page
 * `PageFrame` components painted by the `afterEditable` slot, so this slot
 * stays empty in both modes. Kept exported so the plugin's render contract
 * can grow without breaking imports.
 */
declare const StandardHeaderRail: () => null;
/**
 * `render.afterEditable` slot — also empty when the plugin uses its own
 * paged view via `PageOverlay`.
 *
 * The playground / consumer composition is expected to register
 * `PageOverlay` directly on `afterEditable` when it wants the paged view.
 * The plugin keeps this slot empty by default to avoid double-rendering
 * chrome when a host overrides the slot.
 */
declare const StandardFooterAndPanel: () => null;
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
export { FooterPlugin, FootnotePortal, HeaderPlugin, MarginsDialog, PageBreakPlugin, PageFrame, PageFrameProps, PageOverlay, PaginationPlugin, PaginationToolbar, StandardFooterAndPanel, StandardHeaderRail, usePretextMeasurer };
//# sourceMappingURL=index.d.ts.map