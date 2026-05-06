import * as React from 'react';

import { KEYS, type TElement } from 'platejs';
import { useEditorRef } from 'platejs/react';

import {
  type BasePaginationConfig,
  BasePaginationPlugin,
} from '../lib/base-pagination-plugin';
import { FootnotePortal } from './footnote-portal';
import { usePageLayout } from './internal/use-page-layout';
import { PageFrame } from './page-frame';

/**
 * Render-overlay shell mounted via `render.afterEditable`.
 *
 * Variant A — CodeRabbit Design Choice 1: pages are derived at render time
 * and painted as an overlay panel on top of the live editor. The Slate
 * document is never mutated by this component.
 *
 * The overlay is a fixed-position card on the right of the viewport showing
 * a stack of `PageFrame` thumbnails plus a "Page n of m" indicator. This
 * makes pagination visible without fighting the editor's text rendering.
 */
export const PageOverlay = (): React.JSX.Element | null => {
  const editor = useEditorRef();
  const options = editor.getOptions(BasePaginationPlugin) as
    | BasePaginationConfig['options']
    | undefined;

  const safeOptions = useResolvedOptions(options);
  const pages = usePageLayout(
    editor as { id: string; children: TElement[] },
    safeOptions
  );

  if (pages.length === 0) return null;

  const documentHeader = editor.children.find((n) => n.type === KEYS.header) as
    | TElement
    | undefined;
  const documentFooter = editor.children.find((n) => n.type === KEYS.footer) as
    | TElement
    | undefined;

  const thumbScale = 0.18;
  const stackGap = 12;

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
            gap: stackGap,
          }}
        >
          {pages.map((page) => {
            const previewHeight = page.rect.height * thumbScale;

            return (
              <div
                key={page.pageIndex}
                style={{
                  position: 'relative',
                  width: '100%',
                }}
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
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${thumbScale})`,
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
    }),
    [
      options?.footerHeight,
      options?.footnoteWell,
      options?.headerHeight,
      options?.includeFootnoteSubPlugins,
      options?.margins,
      options?.pageSize,
    ]
  );
