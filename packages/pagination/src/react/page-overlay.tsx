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

const STACK_GAP = 12;

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
export const PageOverlay = (): React.JSX.Element | null => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditorRef();
  const visible = usePluginOption(BasePaginationPlugin, 'previewVisible');
  const pageSize = usePluginOption(BasePaginationPlugin, 'pageSize');
  const pageBorder = usePluginOption(BasePaginationPlugin, 'pageBorder');
  const previewWidth = usePluginOption(BasePaginationPlugin, 'previewWidth');
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
        pageBorder,
        pageSize,
        previewWidth,
        previewVisible: visible,
      }),
    [
      footerHeight,
      footnotePlacement,
      footnoteWell,
      headerHeight,
      includeFootnoteSubPlugins,
      margins,
      pageBorder,
      pageSize,
      previewWidth,
      visible,
    ]
  );
  const pages = usePageLayout(
    editor,
    value as unknown as TElement[],
    safeOptions
  );

  if (!mounted) return null;
  const footnoteDefinitionType = editor.getType(FOOTNOTE_DEFINITION_KEY);
  const footnotesInFooter = safeOptions.footnotePlacement === 'footer';
  const footnotePortal = (
    <FootnotePortal
      enabled={footnotesInFooter}
      footnoteDefinitionType={footnoteDefinitionType}
    />
  );

  if (!visible || pages.length === 0) {
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
  const handleResizePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (event.button !== 0) return;

    event.preventDefault();

    const startX = event.clientX;
    const startWidth = safeOptions.previewWidth;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const width = clampPreviewWidth(startWidth + startX - moveEvent.clientX);

      editor.setOption(BasePaginationPlugin, 'previewWidth', width);
    };
    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <>
      {footnotePortal}
      <div
        aria-label="Page preview"
        data-plate-pagination-overlay=""
        role="region"
        style={{
          background: 'rgba(248, 250, 252, 0.96)',
          border: '1px solid rgba(15,23,42,0.12)',
          borderRadius: 8,
          bottom: 16,
          boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
          color: 'rgba(15,23,42,0.85)',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 12,
          maxHeight: 'calc(100vh - 96px)',
          overflowY: 'auto',
          padding: 12,
          position: 'fixed',
          right: 16,
          top: 80,
          width: clampPreviewWidth(safeOptions.previewWidth),
          zIndex: 50,
        }}
      >
        <div
          aria-label="Resize page preview"
          aria-orientation="vertical"
          aria-valuemax={MAX_PREVIEW_WIDTH}
          aria-valuemin={MIN_PREVIEW_WIDTH}
          aria-valuenow={clampPreviewWidth(safeOptions.previewWidth)}
          data-plate-pagination-resize-handle=""
          onPointerDown={handleResizePointerDown}
          role="separator"
          style={{
            bottom: 0,
            cursor: 'ew-resize',
            left: -4,
            position: 'absolute',
            top: 0,
            touchAction: 'none',
            width: 8,
          }}
        />
        <div
          style={{
            alignItems: 'center',
            color: 'rgba(15,23,42,0.55)',
            display: 'flex',
            fontSize: 11,
            fontWeight: 600,
            justifyContent: 'space-between',
            letterSpacing: 0.4,
            marginBottom: 8,
            textTransform: 'uppercase',
          }}
        >
          <span>Pages</span>
          <span>{`${pages.length}`}</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: STACK_GAP,
          }}
        >
          {pages.map((page) => {
            const scale = computeThumbScale(
              page.rect.width,
              safeOptions.previewWidth - PANEL_PADDING_X
            );
            const previewHeight = page.rect.height * scale;
            const previewWidth = page.rect.width * scale;

            return (
              <div key={`page-${page.pageIndex}`} style={{ width: '100%' }}>
                <div
                  style={{
                    color: 'rgba(15,23,42,0.55)',
                    fontSize: 10,
                    marginBottom: 4,
                  }}
                >
                  {`Page ${page.pageIndex + 1}`}
                </div>
                <div
                  style={{
                    height: previewHeight,
                    overflow: 'hidden',
                    position: 'relative',
                    width: previewWidth,
                  }}
                >
                  <div
                    style={{
                      height: page.rect.height,
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                      width: page.rect.width,
                    }}
                  >
                    <PageFrame
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
                      top={0}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const MAX_THUMB_SCALE = 0.18;
const PANEL_PADDING_X = 24;
const MAX_PREVIEW_WIDTH = 420;
const MIN_PREVIEW_WIDTH = 180;

const clampPreviewWidth = (width: number): number =>
  Math.min(MAX_PREVIEW_WIDTH, Math.max(MIN_PREVIEW_WIDTH, width));

export const computeThumbScale = (
  pageWidth: number,
  panelInnerWidth = 196
): number => {
  if (pageWidth <= 0) return MAX_THUMB_SCALE;

  return Math.min(MAX_THUMB_SCALE, panelInnerWidth / pageWidth);
};
