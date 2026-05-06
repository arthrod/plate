import * as React from 'react';

import { KEYS, type TElement } from 'platejs';
import { useEditorRef, useEditorContainerRef } from 'platejs/react';

import {
  type BasePaginationConfig,
  BasePaginationPlugin,
} from '../lib/base-pagination-plugin';
import { FootnotePortal } from './footnote-portal';
import { usePageLayout } from './internal/use-page-layout';
import { PageFrame } from './page-frame';

const PAGE_GAP = 24;

/**
 * Render-overlay shell mounted via `render.afterEditable`.
 *
 * Variant A — CodeRabbit Design Choice 1: pages are derived at render time
 * and painted as an overlay on top of the live editor. This component owns
 * the per-page frames and the absolute positioning math; nothing touches
 * Slate state.
 *
 * The container is `pointer-events: none` so the underlying editor receives
 * mouse/keyboard events normally. Each `PageFrame` paints its own chrome
 * (header band, footer band, footnote well) at a Y offset matching the
 * cumulative measured height of preceding pages.
 */
export const PageOverlay = (): React.JSX.Element | null => {
  const editor = useEditorRef();
  const containerRef = useEditorContainerRef();
  const options = editor.getOptions(BasePaginationPlugin) as
    | BasePaginationConfig['options']
    | undefined;

  const safeOptions = useResolvedOptions(options);
  const pages = usePageLayout(
    editor as { id: string; children: TElement[] },
    safeOptions
  );

  if (!safeOptions || pages.length === 0) return null;

  const documentHeader = editor.children.find((n) => n.type === KEYS.header) as
    | TElement
    | undefined;
  const documentFooter = editor.children.find((n) => n.type === KEYS.footer) as
    | TElement
    | undefined;

  const containerRect = containerRef.current?.getBoundingClientRect();
  const offsetTop = containerRect?.top ?? 0;
  const offsetLeft = containerRect?.left ?? 0;

  let cumulative = 0;

  return (
    <>
      <FootnotePortal />
      <div
        data-plate-pagination-overlay=""
        style={{
          left: offsetLeft,
          pointerEvents: 'none',
          position: 'fixed',
          top: offsetTop,
          zIndex: 0,
        }}
      >
        {pages.map((page) => {
          const top = cumulative;
          cumulative += page.rect.height + PAGE_GAP;

          return (
            <PageFrame
              key={page.pageIndex}
              chrome={{
                footerHeight: safeOptions.footerHeight,
                footnoteWell: safeOptions.footnoteWell,
                headerHeight: safeOptions.headerHeight,
              }}
              documentFooter={documentFooter}
              documentHeader={documentHeader}
              page={page}
              top={top}
            />
          );
        })}
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
