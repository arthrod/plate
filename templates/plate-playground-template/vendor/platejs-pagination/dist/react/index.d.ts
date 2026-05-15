import { E as BasePaginationApi, F as PageMargins, L as PageNumberConfig, M as Page, N as PageBorder, O as BasePaginationOptions, j as Measurer, k as BasePaginationTransforms } from "../index-CfyQq3q9";
import * as platejs0 from "platejs";
import { SlateEditor, TElement } from "platejs";
import * as React from "react";
import * as platejs_react0 from "platejs/react";
import { PlateEditor } from "platejs/react";

//#region src/react/chrome-shell.d.ts
/**
 * Chrome region kind. Drives the default label and the data attribute used
 * for styling/scraping.
 */
type ChromeKind = 'firstPageFooter' | 'firstPageHeader' | 'footer' | 'header';
type ChromeShellProps = {
  /** Children rendered inside the shell — typically the chrome's content. */
  children: React.ReactNode;
  /**
   * Kind of chrome region. Drives the default label and the
   * `data-plate-pagination-chrome` attribute consumers can hook for styling.
   */
  kind: ChromeKind;
  /** Optional className applied to the shell wrapper. */
  className?: string;
  /** Override the default label (e.g. localized copy). */
  label?: string;
  /**
   * Click handler for the "Exit chrome" affordance. When omitted, the exit
   * button is hidden so consumers without an exit policy don't show a dead
   * button. Wire it to a transform like
   * `editor.tf.deselect()` or focus-moving logic.
   */
  onExit?: () => void;
  /** Inline style merged into the wrapper. */
  style?: React.CSSProperties;
};
/**
 * Selection-aware wrapper for header/footer chrome regions.
 *
 * Renders children plain in the unselected state. Once the user's selection
 * lands inside the chrome (detected via slate-react's `useSelected`), shows
 * a dotted focus border, a label badge, and an optional "Exit chrome"
 * button. Plain reading mode (no selection) is visually unchanged so the
 * paged view stays clean.
 *
 * Author wiring (registry kit):
 * ```tsx
 * import { PlateElement } from 'platejs/react';
 * import { ChromeShell } from '@platejs/pagination/react';
 *
 * export const HeaderElement = (props) => (
 *   <ChromeShell kind="header" onExit={() => props.editor.tf.blur()}>
 *     <PlateElement {...props} />
 *   </ChromeShell>
 * );
 * ```
 */
declare const ChromeShell: ({
  children,
  className,
  kind,
  label,
  onExit,
  style
}: ChromeShellProps) => React.JSX.Element;
//#endregion
//#region src/react/first-page-footer-plugin.d.ts
declare const FirstPageFooterPlugin: platejs_react0.PlatePlugin<platejs0.PluginConfig<"firstPageFooter", {}, {}, {}, {}>>;
//#endregion
//#region src/react/first-page-header-plugin.d.ts
declare const FirstPageHeaderPlugin: platejs_react0.PlatePlugin<platejs0.PluginConfig<"firstPageHeader", {}, {}, {}, {}>>;
//#endregion
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
 * Page Setup dialog — full BasePaginationOptions surface.
 *
 * Replaces the v1 four-margin dialog with: page-size presets, per-axis
 * margins (with unit toggle), header/footer heights, footnote placement
 * toggle, first-page-different toggle, and the page-number slot config
 * (region/align/format/startAt/hideOnFirst).
 *
 * All edits flow through `editor.tf.pagination.*` transforms — no direct
 * `setOption` calls — so consumers that override transforms see the same
 * behavior they get from the toolbar buttons.
 *
 * The host opens this from the toolbar's `Page Setup…` button. v1 ships a
 * native `<dialog>`; the host may swap for a shadcn/Radix Dialog while
 * keeping this state-management contract.
 */
declare const PageSetupDialog: ({
  onClose,
  open
}: {
  onClose: () => void;
  open: boolean;
}) => React.JSX.Element | null;
/**
 * Backwards-compatible alias for the v1 dialog name.
 *
 * Existing imports `import { MarginsDialog } from '@platejs/pagination/react'`
 * keep working; the alias renders the full Page Setup form, which is a
 * superset of the original margin-only UI.
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
   * authored page geometry instead of hardcoded insets. `pageNumber` is the
   * authoritative slot config (region/align/format/startAt/hideOnFirst).
   */
  chrome: {
    footerHeight: number;
    footnoteWell: number;
    headerHeight: number;
    margins: PageMargins;
    pageBorder: PageBorder;
    pageNumber: PageNumberConfig;
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
  /** Total page count in the current document (drives `1/N` formats). */
  totalPages: number;
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
  top,
  totalPages
}: PageFrameProps) => React.JSX.Element;
//#endregion
//#region src/react/page-overlay.d.ts
/**
 * Paged view (variant A — additive, NOT a takeover).
 *
 * - `mode === 'standard'`: renders nothing besides the {@link FootnotePortal}
 *   (which only acts when footnote sub-plugins are wired). The editor stays
 *   in continuous-flow mode with no chrome.
 * - `mode === 'paged'`: renders a paginated stack of {@link PageFrame}
 *   instances BELOW the live `<Editable />`. Each frame uses `PlateStatic`
 *   to render that page's slice of the document. The live editor is NOT
 *   hidden — hiding it via `display:none` causes Plate plugins (cursor,
 *   AI, comments, suggestions) to fire layout-zero callbacks in a tight
 *   loop, which crashes the renderer. Keeping the editor mounted and
 *   visible above the paged stack is the only stable option for variant A
 *   without first re-architecting every consumer's chrome layout.
 *
 * Wrapped in an error boundary so a runaway PlateStatic subtree on one page
 * cannot take the entire app down. Pages past MAX_PAGES_RENDERED are
 * elided with a "+N more" badge — the paginator may produce arbitrary
 * counts but rendering hundreds of static editors is not viable in browser.
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
export { ChromeKind, ChromeShell, ChromeShellProps, FirstPageFooterPlugin, FirstPageHeaderPlugin, FooterPlugin, FootnotePortal, HeaderPlugin, MarginsDialog, PageBreakPlugin, PageFrame, PageFrameProps, PageOverlay, PageSetupDialog, PaginationPlugin, PaginationToolbar, StandardFooterAndPanel, StandardHeaderRail, usePretextMeasurer };
//# sourceMappingURL=index.d.ts.map