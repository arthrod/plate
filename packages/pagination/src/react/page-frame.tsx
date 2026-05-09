import * as React from 'react';

import type { AnyEditorPlugin, TElement } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import { PlateStatic, createStaticEditor } from 'platejs/static';

import type {
  Page,
  PageBorder,
  PageMargins,
  PageNumberConfig,
} from '../lib/types';

import {
  FIRST_PAGE_FOOTER_KEY,
  FIRST_PAGE_HEADER_KEY,
  FOOTER_KEY,
  HEADER_KEY,
  PAGINATION_KEY,
} from '../lib/internal/keys';
import { PageNumber } from './page-number';

const CHROME_PLUGIN_KEYS = new Set<string>([
  HEADER_KEY,
  FOOTER_KEY,
  FIRST_PAGE_HEADER_KEY,
  FIRST_PAGE_FOOTER_KEY,
]);

// Plugin keys whose `node.component` calls slate-react hooks (`useSlate`,
// `useSelected`, `useReadOnly`, etc.). These hooks require a real `<Slate>`
// provider and crash with `TypeError: e is not iterable` inside
// `createStaticEditor`. Strip the component for them so PlateStatic falls
// back to default `SlateElement` (children render as plain text). Add to
// this set when a new plugin shows up in the static crash logs.
const STATIC_UNSAFE_PLUGIN_KEYS = new Set<string>([
  'ai',
  'aiChat',
  'copilot',
  'dnd',
  'drag_handle',
  'cursor_overlay',
  'block_menu',
  'block_selection',
  'floating_toolbar',
  'fixed_toolbar',
  'mention',
  'mention_input',
  'slash_input',
  'comment',
  'discussion',
  'suggestion',
  'placeholder',
  'block_placeholder',
  'toc',
]);

export type PageFrameProps = {
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
  /** Whether page-0 should swap to first-page chrome nodes when present. */
  firstPageDifferent?: boolean;
  /** First-page footer element when `firstPageDifferent` is on. */
  firstPageFooter?: TElement;
  /** First-page header element when `firstPageDifferent` is on. */
  firstPageHeader?: TElement;
  footnotesInFooter: boolean;
  page: Page;
  /** Page-number config; when set, paints the configured chrome band. */
  pageNumber?: PageNumberConfig;
  /** Total number of pages in the layout (used by `1/N` / `Page 1 of N`). */
  totalPages: number;
  /** Vertical position of the page in the overlay coordinate space. */
  top: number;
};

/**
 * Single page chrome rendered by the overlay: header band, content rect,
 * footnote well, footer band — with content rendered through `PlateStatic`
 * using the live editor's plugin list, minus editor-chrome render hooks.
 */
export const PageFrame = ({
  chrome,
  documentFooter,
  documentHeader,
  editor,
  firstPageDifferent,
  firstPageFooter,
  firstPageHeader,
  footnotesInFooter,
  page,
  pageNumber,
  totalPages,
  top,
}: PageFrameProps): React.JSX.Element => {
  const { rect } = page;
  // Chrome lives inside the margin zones (Word-style): a header occupies
  // up to `margins.top` pixels from the top edge and is anchored to the
  // body boundary; a footer mirrors this at the bottom. The configured
  // `headerHeight` / `footerHeight` clamp the chrome content so its
  // bottom edge meets the body edge cleanly even when margins are deep.
  const isFirstPage = page.pageIndex === 0;
  // First-page chrome falls back to regular chrome when its dedicated node
  // is absent — matches Word's "Different First Page" behavior where the
  // toggle alone does not erase content authored in the regular chrome.
  const headerNode =
    firstPageDifferent && isFirstPage
      ? (firstPageHeader ?? documentHeader)
      : documentHeader;
  const footerNode =
    firstPageDifferent && isFirstPage
      ? (firstPageFooter ?? documentFooter)
      : documentFooter;
  // When no header / footer node exists AND no page-number is configured for
  // that side, collapse the band (dogfood ISSUE-006) so the page reads as
  // "all body" instead of empty whitespace then content.
  const renderHeaderBand = !!headerNode || pageNumber?.side === 'header';
  const renderFooterBand = !!footerNode || pageNumber?.side === 'footer';
  const effectiveHeaderHeight = renderHeaderBand
    ? Math.min(chrome.headerHeight, chrome.margins.top)
    : 0;
  const effectiveFooterHeight = renderFooterBand
    ? Math.min(chrome.footerHeight, chrome.margins.bottom)
    : 0;
  const headerTop = Math.max(0, chrome.margins.top - effectiveHeaderHeight);
  const footerTop = rect.height - chrome.margins.bottom;
  const footnoteWellTop = footerTop - chrome.footnoteWell;
  // Build a static-safe plugin list: keep only element- / leaf-rendering
  // plugins (those that contribute a `node.type` so PlateStatic knows how
  // to render that element) and strip every render slot that could trigger
  // recursive PageOverlay mounts. Plugins without `node.type` (chrome-only
  // plugins like AI, comments, suggestions, drag-handle) tend to depend on
  // live-editor-only state and crash inside PlateStatic; they are dropped
  // here.
  const staticPlugins = React.useMemo(
    () => getElementOnlyStaticPlugins(editor),
    [editor]
  );

  void getStaticPreviewPlugins;
  const pageBorder = chrome.pageBorder;
  const border =
    pageBorder.style === 'none' || pageBorder.width === 0
      ? 'none'
      : `${pageBorder.width}px ${pageBorder.style} ${pageBorder.color}`;

  return (
    <div
      data-page-index={page.pageIndex}
      data-plate-pagination-page=""
      style={{
        background: '#ffffff',
        border,
        borderRadius: pageBorder.radius,
        boxShadow: pageBorder.shadow,
        height: rect.height,
        left: 0,
        position: 'absolute',
        top,
        width: rect.width,
      }}
    >
      {effectiveHeaderHeight > 0 ? (
        <div
          data-plate-pagination-slot="header"
          style={{
            color: 'rgba(15,23,42,0.7)',
            fontSize: 12,
            height: effectiveHeaderHeight,
            left: chrome.margins.left,
            position: 'absolute',
            right: chrome.margins.right,
            top: headerTop,
          }}
        >
          {headerNode ? (
            <StaticPageValue plugins={staticPlugins} value={[headerNode]} />
          ) : null}
          {pageNumber?.side === 'header' ? (
            <PageNumber
              config={pageNumber}
              pageIndex={page.pageIndex}
              totalPages={totalPages}
            />
          ) : null}
        </div>
      ) : null}

      {footnotesInFooter &&
      chrome.footnoteWell > 0 &&
      page.footnotes.length > 0 ? (
        <div
          data-plate-pagination-slot="footnote-well"
          style={{
            borderTop: '1px solid rgba(15,23,42,0.12)',
            color: 'rgba(15,23,42,0.72)',
            fontSize: 11,
            height: chrome.footnoteWell,
            left: chrome.margins.left,
            overflow: 'hidden',
            paddingTop: 6,
            position: 'absolute',
            right: chrome.margins.right,
            top: footnoteWellTop,
          }}
        >
          <StaticPageValue plugins={staticPlugins} value={page.footnotes} />
        </div>
      ) : null}

      {effectiveFooterHeight > 0 ? (
        <div
          data-plate-pagination-slot="footer"
          style={{
            color: 'rgba(15,23,42,0.7)',
            fontSize: 12,
            height: effectiveFooterHeight,
            left: chrome.margins.left,
            position: 'absolute',
            right: chrome.margins.right,
            top: footerTop,
          }}
        >
          {footerNode ? (
            <StaticPageValue plugins={staticPlugins} value={[footerNode]} />
          ) : null}
          {pageNumber?.side === 'footer' ? (
            <PageNumber
              config={pageNumber}
              pageIndex={page.pageIndex}
              totalPages={totalPages}
            />
          ) : null}
        </div>
      ) : null}

      <div
        data-plate-pagination-slot="content"
        style={{
          height: rect.contentHeight,
          left: chrome.margins.left,
          overflow: 'hidden',
          position: 'absolute',
          right: chrome.margins.right,
          top: chrome.margins.top,
        }}
      >
        <StaticPageValue plugins={staticPlugins} value={page.nodes} />
        {!footnotesInFooter && page.footnotes.length > 0 ? (
          <div
            data-plate-pagination-slot="document-end-footnotes"
            style={{
              borderTop: '1px solid rgba(15,23,42,0.15)',
              fontSize: 12,
              marginTop: 16,
              paddingTop: 8,
            }}
          >
            <StaticPageValue plugins={staticPlugins} value={page.footnotes} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const StaticPageValue = ({
  plugins,
  value,
}: {
  plugins: AnyEditorPlugin[];
  value: TElement[];
}): React.JSX.Element => {
  // Render each node in its OWN PlateStatic with its own error boundary.
  // Crashes are common with rich elements (table, image, voids that depend
  // on live editor state). Per-node isolation means a single bad node
  // falls back to plain text without taking the entire page down.
  return (
    <div data-plate-pagination-static-stack="">
      {value.map((node, i) => (
        <PlateStaticBoundary key={`n-${i}`} plugins={plugins} value={[node]}>
          <FallbackPageText value={[node]} />
        </PlateStaticBoundary>
      ))}
    </div>
  );
};

const TryPlateStatic = ({
  plugins,
  value,
}: {
  plugins: AnyEditorPlugin[];
  value: TElement[];
}): React.JSX.Element => {
  const editor = React.useMemo(
    () => createStaticEditor({ plugins, value }),
    [plugins, value]
  );

  return (
    <PlateStatic
      className="slate-editor"
      editor={editor}
      style={{ fontSize: 'inherit', lineHeight: 'inherit' }}
      value={value}
    />
  );
};

class PlateStaticBoundary extends React.Component<
  {
    children: React.ReactNode;
    plugins: AnyEditorPlugin[];
    value: TElement[];
  },
  { error: Error | null }
> {
  constructor(props: PlateStaticBoundary['props']) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  componentDidCatch(): void {
    // Plate plugins regularly call slate-react hooks (`useSlate`,
    // `useSelected`, etc.) that don't exist inside `createStaticEditor`'s
    // context. We expect those crashes per page on every layout cycle —
    // the fallback to plain text is correct behaviour, not an error worth
    // logging. Set `window.__platePaginationLogStaticErrors = true` if you
    // need to debug a specific plugin.
    if (
      typeof window !== 'undefined' &&
      (window as { __platePaginationLogStaticErrors?: boolean })
        .__platePaginationLogStaticErrors === true
    ) {
      console.warn('[plate-pagination] PlateStatic fell back to plain text');
    }
  }

  render(): React.ReactNode {
    if (this.state.error !== null) {
      return this.props.children;
    }

    try {
      return (
        <TryPlateStatic plugins={this.props.plugins} value={this.props.value} />
      );
    } catch {
      return this.props.children;
    }
  }
}

const FallbackPageText = ({
  value,
}: {
  value: TElement[];
}): React.JSX.Element => (
  <div
    data-plate-pagination-fallback=""
    style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}
  >
    {value.map((node, i) => (
      <p key={`pt-${i}`} style={{ margin: '0 0 0.6em 0' }}>
        {collectPlainText(node)}
      </p>
    ))}
  </div>
);

const collectPlainText = (node: TElement): string => {
  let out = '';
  const walk = (n: { children?: unknown[]; text?: string }): void => {
    if (typeof n.text === 'string') {
      out += n.text;

      return;
    }
    if (!Array.isArray(n.children)) return;
    for (const child of n.children) {
      walk(child as { children?: unknown[]; text?: string });
    }
  };

  walk(node);

  return out;
};

const getStaticPreviewPlugins = (editor: PlateEditor): AnyEditorPlugin[] =>
  editor.meta.pluginList
    .map(toStaticPreviewPlugin)
    .filter((plugin): plugin is AnyEditorPlugin => plugin !== null);

/**
 * Static-safe subset of the live editor's plugins.
 *
 * Keeps plugins that have `node.type` (element / leaf renderers) AND a
 * `node.component` (the renderer itself). Skips:
 * - the pagination plugin (would recurse — see comment in `PageFrame`)
 * - any plugin marked `editOnly` (won't run in static mode anyway)
 * - chrome-only plugins (no `node.type`) which tend to depend on live
 *   editor state and crash PlateStatic
 *
 * All render slots (`afterEditable`, `beforeEditable`, etc.) are wiped so
 * PlateStatic does not re-fire pagination's `afterEditable` from inside a
 * page (which would mount another PageOverlay → infinite recursion).
 */
const getElementOnlyStaticPlugins = (
  editor: PlateEditor
): AnyEditorPlugin[] => {
  const out: AnyEditorPlugin[] = [];

  for (const plugin of editor.meta.pluginList) {
    if (plugin.key === PAGINATION_KEY) continue;
    if (plugin.editOnly) continue;
    if (!plugin.node?.type) continue;
    if (!plugin.node.component) continue;

    // Chrome plugins (header / footer / firstPageHeader / firstPageFooter)
    // ship `ChromeShell` as `node.component`, which calls `useSelected` from
    // `slate-react`. That hook crashes inside `PlateStatic` because there
    // is no `<Slate>` provider — the error boundary fires for every page on
    // every layout cycle. Strip `node.component` for chrome plugins so the
    // static path falls back to the default `SlateElement` (children only)
    // and the live editor keeps the affordance UI it had.
    const key = plugin.key as string;
    const isChrome =
      CHROME_PLUGIN_KEYS.has(key) || STATIC_UNSAFE_PLUGIN_KEYS.has(key);

    out.push({
      ...plugin,
      __extensions: [],
      inject: plugin.inject?.nodeProps?.transformProps
        ? {
            ...plugin.inject,
            nodeProps: {
              ...plugin.inject.nodeProps,
              transformProps: undefined,
            },
          }
        : plugin.inject,
      node: isChrome ? { ...plugin.node, component: undefined } : plugin.node,
      render: {
        ...plugin.render,
        aboveEditable: undefined,
        aboveNodes: undefined,
        aboveSlate: undefined,
        afterContainer: undefined,
        afterEditable: undefined,
        beforeContainer: undefined,
        beforeEditable: undefined,
        belowNodes: undefined,
        belowRootNodes: undefined,
        node: undefined,
      },
    } as AnyEditorPlugin);
  }

  return out;
};

const toStaticPreviewPlugin = (
  plugin: AnyEditorPlugin
): AnyEditorPlugin | null => {
  if (plugin.key === PAGINATION_KEY || plugin.editOnly) return null;

  return {
    ...plugin,
    __extensions: [],
    inject: plugin.inject?.nodeProps?.transformProps
      ? {
          ...plugin.inject,
          nodeProps: {
            ...plugin.inject.nodeProps,
            transformProps: undefined,
          },
        }
      : plugin.inject,
    node: {
      ...plugin.node,
      component: undefined,
    },
    render: {
      ...plugin.render,
      aboveEditable: undefined,
      aboveNodes: undefined,
      aboveSlate: undefined,
      afterContainer: undefined,
      afterEditable: undefined,
      beforeContainer: undefined,
      beforeEditable: undefined,
      belowNodes: undefined,
      belowRootNodes: undefined,
      node: undefined,
    },
  } as AnyEditorPlugin;
};
