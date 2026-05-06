import * as React from 'react';

import type { TElement } from 'platejs';

import { PlateStatic } from 'platejs/static';

import type { Page, PageMargins } from '../lib/types';

import { pageStaticEditor } from './page-static-editor';

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
  };
  /** First-class footer element copied off the document, if any. */
  documentFooter?: TElement;
  /** First-class header element copied off the document, if any. */
  documentHeader?: TElement;
  page: Page;
  /** Vertical position of the page in the overlay coordinate space. */
  top: number;
};

/**
 * Single page chrome rendered by the overlay: header band, content rect,
 * footnote well, footer band — with content rendered via `<PlateStatic>`
 * so marks, lists, links, and any user-registered node types preserve their
 * styling instead of being collapsed to plain text.
 */
export const PageFrame = ({
  chrome,
  documentFooter,
  documentHeader,
  page,
  top,
}: PageFrameProps): React.JSX.Element => {
  const { rect } = page;
  const headerOffset = chrome.headerHeight;
  const footnoteWellTop =
    rect.height - chrome.footerHeight - chrome.footnoteWell;
  const footerTop = rect.height - chrome.footerHeight;

  return (
    <div
      aria-hidden="true"
      data-page-index={page.pageIndex}
      data-plate-pagination-page=""
      style={{
        background: '#ffffff',
        border: '1px solid rgba(15,23,42,0.15)',
        borderRadius: 2,
        boxShadow: '0 1px 2px rgba(15,23,42,0.08)',
        height: rect.height,
        left: 0,
        pointerEvents: 'none',
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
            <PlateStatic editor={pageStaticEditor} value={[documentHeader]} />
          ) : null}
        </div>
      ) : null}

      {chrome.footnoteWell > 0 && page.footnotes.length > 0 ? (
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
          <PlateStatic
            editor={pageStaticEditor}
            value={page.footnotes as TElement[]}
          />
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
          <span>
            {documentFooter ? (
              <PlateStatic editor={pageStaticEditor} value={[documentFooter]} />
            ) : null}
          </span>
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
        <PlateStatic editor={pageStaticEditor} value={page.nodes} />
      </div>
    </div>
  );
};
