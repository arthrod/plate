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
export const PageOverlay = (): React.JSX.Element | null => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditorRef();
  const mode = usePluginOption(BasePaginationPlugin, 'mode');
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

  const isPaged = mode === 'paged';

  // Toggle a global attribute on `<body>` so consumer stylesheets can hide
  // the live `<Editable />` in paged mode without coupling to the Plate
  // wrapper class hierarchy. Cleared on standard / unmount so the attribute
  // never survives the lifecycle.
  React.useEffect(() => {
    // `useEffect` is client-only, so document is always defined here. The
    // explicit SSR guard is intentionally NOT used — Turbopack's minifier
    // miscompiles `typeof document === 'undefined'` into a swapped operand
    // (`"u" > typeof document`), inverting the runtime check and breaking
    // the DOM mutation in browsers.
    const body = document.body;

    if (isPaged) {
      body.dataset.platePaginationMode = 'paged';
    } else {
      delete body.dataset.platePaginationMode;
    }

    return () => {
      delete body.dataset.platePaginationMode;
    };
  }, [isPaged]);

  if (!mounted) return null;

  const footnoteDefinitionType = editor.getType(FOOTNOTE_DEFINITION_KEY);
  const footnotesInFooter = safeOptions.footnotePlacement === 'footer';
  const footnotePortal = (
    <FootnotePortal
      enabled={footnotesInFooter}
      footnoteDefinitionType={footnoteDefinitionType}
    />
  );

  // Standard mode: no chrome rendered anywhere. The footnote portal hides
  // in-flow footnote definitions when configured, but no header / footer /
  // page boxes are produced.
  if (!isPaged) return footnotePortal;

  if (pages.length === 0) {
    return footnotePortal;
  }

  const headerType = editor.getType(HEADER_KEY);
  const footerType = editor.getType(FOOTER_KEY);
  const documentHeader = (value as TElement[]).find(
    (n) => n.type === headerType
  );
  const documentFooter = (value as TElement[]).find(
    (n) => n.type === footerType
  );

  // Stack pages vertically inside a centered column. Each PageFrame is
  // absolutely positioned within this container so PageFrame's existing
  // chrome math (header band, footer band, footnote well) stays unchanged.
  let runningTop = 0;
  const pageRows = pages.map((page) => {
    const top = runningTop;

    runningTop += page.rect.height + PAGE_GAP;

    return { page, top };
  });
  const stackHeight = Math.max(0, runningTop - PAGE_GAP);
  const pageWidth = pages[0]?.rect.width ?? 0;

  return (
    <>
      {footnotePortal}
      <style data-plate-pagination-style="">{
        `body[data-plate-pagination-mode="paged"] [data-slate-editor]{display:none!important;}`
      }</style>
      <div
        aria-label="Paginated document view"
        data-plate-pagination-paged-view=""
        role="region"
        style={{
          background: 'rgba(248, 250, 252, 1)',
          minHeight: '100vh',
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
      </div>
    </>
  );
};
