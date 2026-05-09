import * as React from 'react';

import type { AnyEditorPlugin, TElement } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import { PlateStatic, createStaticEditor } from 'platejs/static';

import type { Page, PageBorder, PageMargins } from '../lib/types';

import { PAGINATION_KEY } from '../lib/internal/keys';

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
export const PageFrame = ({
  chrome,
  documentFooter,
  documentHeader,
  editor,
  footnotesInFooter,
  page,
  top,
}: PageFrameProps): React.JSX.Element => {
  const { rect } = page;
  const headerOffset = chrome.headerHeight;
  const footnoteWellTop =
    rect.height - chrome.footerHeight - chrome.footnoteWell;
  const footerTop = rect.height - chrome.footerHeight;
  // Pass NO plugins to the static editor. The page-render path is
  // intentionally dumb: it just renders the page's nodes via PlateStatic's
  // default leaf renderer. Including the live editor's plugin graph causes
  // PlateStatic to re-fire every plugin's `afterEditable` slot — which in
  // turn re-mounts PageOverlay (which renders MORE pages) producing N²
  // mounts and a renderer crash. Static-preview plugin sanitization
  // (`getStaticPreviewPlugins`) is preserved below for opt-in re-enable
  // once each plugin's static behaviour is verified.
  const staticPlugins = React.useMemo<AnyEditorPlugin[]>(
    () => [],
    []
  );

  void getStaticPreviewPlugins;
  void editor;
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
      {chrome.headerHeight > 0 ? (
        <div
          data-plate-pagination-slot="header"
          style={{
            borderBottom: '1px dashed rgba(15,23,42,0.1)',
            color: 'rgba(15,23,42,0.55)',
            fontSize: 12,
            height: chrome.headerHeight,
            left: 0,
            paddingBottom: 8,
            paddingLeft: chrome.margins.left,
            paddingRight: chrome.margins.right,
            paddingTop: 8,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          {documentHeader ? (
            <StaticPageValue plugins={staticPlugins} value={[documentHeader]} />
          ) : null}
        </div>
      ) : null}

      {footnotesInFooter &&
      chrome.footnoteWell > 0 &&
      page.footnotes.length > 0 ? (
        <div
          data-plate-pagination-slot="footnote-well"
          style={{
            borderTop: '1px solid rgba(15,23,42,0.1)',
            color: 'rgba(15,23,42,0.7)',
            fontSize: 11,
            height: chrome.footnoteWell,
            left: chrome.margins.left,
            overflow: 'hidden',
            padding: '4px 0',
            position: 'absolute',
            right: chrome.margins.right,
            top: footnoteWellTop,
          }}
        >
          <StaticPageValue plugins={staticPlugins} value={page.footnotes} />
        </div>
      ) : null}

      {chrome.footerHeight > 0 ? (
        <div
          data-plate-pagination-slot="footer"
          style={{
            borderTop: '1px dashed rgba(15,23,42,0.1)',
            color: 'rgba(15,23,42,0.55)',
            fontSize: 12,
            height: chrome.footerHeight,
            left: 0,
            paddingBottom: 8,
            paddingLeft: chrome.margins.left,
            paddingRight: chrome.margins.right,
            paddingTop: 8,
            position: 'absolute',
            right: 0,
            top: footerTop,
          }}
        >
          {documentFooter ? (
            <StaticPageValue plugins={staticPlugins} value={[documentFooter]} />
          ) : null}
          <span style={{ float: 'right' }}>{`${page.pageIndex + 1}`}</span>
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
          top: headerOffset + chrome.margins.top,
        }}
      >
        <StaticPageValue plugins={staticPlugins} value={page.nodes} />
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
  // Try real PlateStatic first (rich rendering of plugin nodes). When the
  // plugin tree contains a node shape PlateStatic cannot iterate (any
  // plugin that escaped the strip in `toStaticPreviewPlugin` and emits a
  // non-iterable value), fall back to a plain-text walk so the page chrome
  // still shows the content. The fallback is intentionally permissive —
  // we'd rather show degraded text than crash the entire paged view.
  return (
    <PlateStaticBoundary plugins={plugins} value={value}>
      <FallbackPageText value={value} />
    </PlateStaticBoundary>
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

  componentDidCatch(error: Error): void {
    // eslint-disable-next-line no-console
    console.warn(
      '[plate-pagination] PlateStatic crashed; falling back to plain text',
      error.message
    );
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
}): React.JSX.Element => {
  return (
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
};

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
