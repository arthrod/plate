import * as React from 'react';

import type { TElement } from 'platejs';
import {
  useEditorRef,
  useEditorValue,
  usePluginOption,
} from 'platejs/react';

import {
  type BasePaginationConfig,
  BasePaginationPlugin,
} from '../lib/base-pagination-plugin';
import { FOOTER_KEY, HEADER_KEY } from '../lib/internal/keys';
import { FootnotePortal } from './footnote-portal';
import { usePageLayout } from './internal/use-page-layout';
import { PageFrame } from './page-frame';

const THUMB_SCALE = 0.18;
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
 */
export const PageOverlay = (): React.JSX.Element | null => {
  const editor = useEditorRef();
  const visible = usePluginOption(BasePaginationPlugin, 'previewVisible');
  const pageSize = usePluginOption(BasePaginationPlugin, 'pageSize');
  const margins = usePluginOption(BasePaginationPlugin, 'margins');
  const headerVisible = usePluginOption(
    BasePaginationPlugin,
    'headerVisible'
  );
  const footerVisible = usePluginOption(
    BasePaginationPlugin,
    'footerVisible'
  );
  const value = useEditorValue();

  void pageSize;
  void margins;
  void headerVisible;
  void footerVisible;

  const options = editor.getOptions(BasePaginationPlugin) as
    | BasePaginationConfig['options']
    | undefined;

  const safeOptions = useResolvedOptions(options);
  const pages = usePageLayout(
    {
      children: value as unknown as TElement[],
      id: editor.id,
    },
    safeOptions
  );

  if (!visible || pages.length === 0) {
    return <FootnotePortal />;
  }

  const documentHeader = (value as TElement[]).find(
    (n) => n.type === HEADER_KEY
  );
  const documentFooter = (value as TElement[]).find(
    (n) => n.type === FOOTER_KEY
  );

  return (
    <>
      <FootnotePortal />
      <div
        data-plate-pagination-overlay=""
        style={{
          background: 'rgba(248, 250, 252, 0.96)',
          border: '1px solid rgba(15,23,42,0.12)',
          borderRadius: 8,
          bottom: 16,
          boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
          color: 'rgba(15,23,42,0.85)',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 12,
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          padding: 12,
          position: 'fixed',
          right: 16,
          top: 16,
          width: 220,
          zIndex: 50,
        }}
      >
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
            const previewHeight = page.rect.height * THUMB_SCALE;
            const previewWidth = page.rect.width * THUMB_SCALE;

            return (
              <div
                key={page.pageIndex}
                style={{ width: '100%' }}
              >
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
                      transform: `scale(${THUMB_SCALE})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <PageFrame
                      chrome={{
                        footerHeight: safeOptions.footerHeight,
                        footnoteWell: safeOptions.footnoteWell,
                        headerHeight: safeOptions.headerHeight,
                      }}
                      documentFooter={documentFooter}
                      documentHeader={documentHeader}
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

const useResolvedOptions = (
  options: BasePaginationConfig['options'] | undefined
): BasePaginationConfig['options'] =>
  React.useMemo<BasePaginationConfig['options']>(
    () => ({
      footerHeight: options?.footerHeight ?? 48,
      footnoteWell: options?.footnoteWell ?? 0,
      headerHeight: options?.headerHeight ?? 48,
      includeFootnoteSubPlugins: options?.includeFootnoteSubPlugins ?? true,
      margins: options?.margins ?? {
        bottom: 72,
        left: 72,
        right: 72,
        top: 72,
      },
      pageSize: options?.pageSize ?? 'A4',
      previewVisible: options?.previewVisible ?? true,
    }),
    [
      options?.footerHeight,
      options?.footnoteWell,
      options?.headerHeight,
      options?.includeFootnoteSubPlugins,
      options?.margins,
      options?.pageSize,
      options?.previewVisible,
    ]
  );
