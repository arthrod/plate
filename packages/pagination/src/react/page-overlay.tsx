import * as React from 'react';

import type { TElement } from 'platejs';

import { useEditorRef, useEditorValue, usePluginOption } from 'platejs/react';

import {
  type BasePaginationConfig,
  BasePaginationPlugin,
} from '../lib/base-pagination-plugin';
import {
  FOOTER_KEY,
  FOOTNOTE_DEFINITION_KEY,
  HEADER_KEY,
} from '../lib/internal/keys';
import { resolvePaginationOptions } from '../lib/resolve-options';
import { FootnotePortal } from './footnote-portal';
import { usePageLayout } from './internal/use-page-layout';
import { PageFrame } from './page-frame';

const PAGE_GAP = 24;
const MAX_PAGES_RENDERED = 12;

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
export const PageOverlay = (): React.JSX.Element | null => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditorRef();
  const mode = usePluginOption(BasePaginationPlugin, 'mode');

  // Diagnostics: surface render count + observed mode so we can confirm
  // whether the hook is reflecting `setMode` from outside React.
  if (typeof window !== 'undefined') {
    const w = window as unknown as {
      __plateOverlayRenders?: number;
      __plateOverlayLastMode?: unknown;
    };

    w.__plateOverlayRenders = (w.__plateOverlayRenders ?? 0) + 1;
    w.__plateOverlayLastMode = mode;
  }
  const pageSize = usePluginOption(BasePaginationPlugin, 'pageSize');
  const pageBorder = usePluginOption(BasePaginationPlugin, 'pageBorder');
  const margins = usePluginOption(BasePaginationPlugin, 'margins');
  const footerHeight = usePluginOption(BasePaginationPlugin, 'footerHeight');
  const footnotePlacement = usePluginOption(
    BasePaginationPlugin,
    'footnotePlacement'
  );
  const footnoteWell = usePluginOption(BasePaginationPlugin, 'footnoteWell');
  const headerHeight = usePluginOption(BasePaginationPlugin, 'headerHeight');
  const includeFootnoteSubPlugins = usePluginOption(
    BasePaginationPlugin,
    'includeFootnoteSubPlugins'
  );
  const previewVisible = usePluginOption(
    BasePaginationPlugin,
    'previewVisible'
  );
  const previewWidth = usePluginOption(BasePaginationPlugin, 'previewWidth');
  const value = useEditorValue();

  const safeOptions = React.useMemo<BasePaginationConfig['options']>(
    () =>
      resolvePaginationOptions({
        footerHeight,
        footnotePlacement,
        footnoteWell,
        headerHeight,
        includeFootnoteSubPlugins,
        margins,
        mode,
        pageBorder,
        pageSize,
        previewVisible,
        previewWidth,
      }),
    [
      footerHeight,
      footnotePlacement,
      footnoteWell,
      headerHeight,
      includeFootnoteSubPlugins,
      margins,
      mode,
      pageBorder,
      pageSize,
      previewVisible,
      previewWidth,
    ]
  );

  const pages = usePageLayout(
    editor,
    value as unknown as TElement[],
    safeOptions
  );

  if (typeof window !== 'undefined') {
    const w = window as unknown as {
      __plateOverlayPages?: number;
      __plateOverlayMounted?: boolean;
    };

    w.__plateOverlayPages = pages.length;
  }

  const isPaged = mode === 'paged';

  if (!mounted) return null;

  const footnoteDefinitionType = editor.getType(FOOTNOTE_DEFINITION_KEY);
  const footnotesInFooter = safeOptions.footnotePlacement === 'footer';
  const footnotePortal = (
    <FootnotePortal
      enabled={footnotesInFooter}
      footnoteDefinitionType={footnoteDefinitionType}
    />
  );

  if (!isPaged) return footnotePortal;
  if (pages.length === 0) return footnotePortal;

  const headerType = editor.getType(HEADER_KEY);
  const footerType = editor.getType(FOOTER_KEY);
  const documentHeader = (value as TElement[]).find(
    (n) => n.type === headerType
  );
  const documentFooter = (value as TElement[]).find(
    (n) => n.type === footerType
  );

  const visiblePages = pages.slice(0, MAX_PAGES_RENDERED);
  const truncatedCount = Math.max(0, pages.length - visiblePages.length);

  let runningTop = 0;
  const pageRows = visiblePages.map((page) => {
    const top = runningTop;

    runningTop += page.rect.height + PAGE_GAP;

    return { page, top };
  });
  const stackHeight = Math.max(0, runningTop - PAGE_GAP);
  const pageWidth = visiblePages[0]?.rect.width ?? 0;

  return (
    <PaginationErrorBoundary fallback={footnotePortal}>
      {footnotePortal}
      <div
        aria-label="Paginated document view"
        data-plate-pagination-paged-view=""
        role="region"
        style={{
          background: 'rgba(248, 250, 252, 1)',
          marginTop: 24,
          padding: '24px 0',
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          data-plate-pagination-stack=""
          style={{
            height: stackHeight,
            margin: '0 auto',
            position: 'relative',
            width: pageWidth,
          }}
        >
          {pageRows.map(({ page, top }) => (
            <PageFrame
              key={`page-${page.pageIndex}`}
              chrome={{
                footerHeight: safeOptions.footerHeight,
                footnoteWell: safeOptions.footnoteWell,
                headerHeight: safeOptions.headerHeight,
                margins: safeOptions.margins,
                pageBorder: safeOptions.pageBorder,
              }}
              documentFooter={documentFooter}
              documentHeader={documentHeader}
              editor={editor}
              footnotesInFooter={footnotesInFooter}
              page={page}
              top={top}
            />
          ))}
        </div>
        {truncatedCount > 0 ? (
          <div
            data-plate-pagination-truncation=""
            style={{
              color: 'rgba(15,23,42,0.6)',
              fontSize: 12,
              padding: '12px 0',
              textAlign: 'center',
            }}
          >
            {`+${truncatedCount} more page${truncatedCount === 1 ? '' : 's'} not shown`}
          </div>
        ) : null}
      </div>
    </PaginationErrorBoundary>
  );
};

type ErrorBoundaryState = { error: Error | null };

/**
 * Catches render errors inside the paged stack so a single bad page does
 * not take down the editor. Falls back to the same `footnotePortal` the
 * happy path returns when there is nothing else to render.
 */
class PaginationErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: {
    children: React.ReactNode;
    fallback: React.ReactNode;
  }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[plate-pagination] paged-view crashed', error, info);
  }

  render(): React.ReactNode {
    if (this.state.error !== null) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
