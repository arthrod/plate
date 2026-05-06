import * as React from 'react';

import type { TElement } from 'platejs';

import type { Page } from '../lib/types';

const HEADING_TYPE_RE = /^h([1-6])$/;

export type PageFrameProps = {
  /** Resolved chrome heights from `BasePaginationOptions`. */
  chrome: { footerHeight: number; footnoteWell: number; headerHeight: number };
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
 * footnote well, footer band — plus a faithful mini-rendering of each block
 * in the body so the panel doubles as a content-aware preview.
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
            padding: '8px 16px',
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          {documentHeader ? collectInlineText(documentHeader) : null}
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
            left: 16,
            overflow: 'hidden',
            padding: '4px 0',
            position: 'absolute',
            right: 16,
            top: footnoteWellTop,
          }}
        >
          {page.footnotes.map((def, i) => (
            <div key={(def as { id?: string }).id ?? i}>
              {`[${(def as { identifier?: string }).identifier ?? i + 1}] `}
              {collectInlineText(def)}
            </div>
          ))}
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
            padding: '8px 16px',
            position: 'absolute',
            right: 0,
            top: footerTop,
          }}
        >
          <span>
            {documentFooter ? collectInlineText(documentFooter) : null}
          </span>
          <span style={{ float: 'right' }}>{`${page.pageIndex + 1}`}</span>
        </div>
      ) : null}

      <div
        data-plate-pagination-slot="content"
        style={{
          height: rect.contentHeight,
          left: 24,
          overflow: 'hidden',
          padding: '0 16px',
          position: 'absolute',
          right: 24,
          top: headerOffset + 16,
        }}
      >
        {page.nodes.map((node, i) => (
          <BlockPreview key={(node as { id?: string }).id ?? i} node={node} />
        ))}
      </div>
    </div>
  );
};

const BlockPreview = ({ node }: { node: TElement }): React.JSX.Element => {
  const text = collectInlineText(node);
  const type = node.type;

  if (typeof type === 'string' && HEADING_TYPE_RE.test(type)) {
    const level = Number.parseInt(type.slice(1), 10);
    const sizes = [0, 28, 22, 18, 16, 14, 13];

    return (
      <div
        style={{
          fontSize: sizes[level] ?? 16,
          fontWeight: 700,
          lineHeight: 1.25,
          margin: '12px 0 8px',
        }}
      >
        {text}
      </div>
    );
  }
  if (type === 'blockquote') {
    return (
      <div
        style={{
          borderLeft: '3px solid rgba(15,23,42,0.2)',
          color: 'rgba(15,23,42,0.7)',
          fontSize: 14,
          fontStyle: 'italic',
          lineHeight: 1.5,
          margin: '8px 0',
          paddingLeft: 12,
        }}
      >
        {text}
      </div>
    );
  }
  if (type === 'code_block') {
    return (
      <div
        style={{
          background: 'rgba(15,23,42,0.05)',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 12,
          lineHeight: 1.4,
          margin: '8px 0',
          padding: 8,
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
      </div>
    );
  }

  return (
    <div
      style={{
        fontSize: 14,
        lineHeight: 1.5,
        margin: '6px 0',
      }}
    >
      {text || ' '}
    </div>
  );
};

const collectInlineText = (node: TElement | undefined): string => {
  if (!node) return '';
  let out = '';
  walk(node, (t) => {
    out += t;
  });

  return out;
};

const walk = (
  node: { children?: unknown[]; text?: string },
  visit: (text: string) => void
): void => {
  if (typeof node.text === 'string') {
    visit(node.text);

    return;
  }
  if (!Array.isArray(node.children)) return;
  for (const child of node.children) {
    walk(child as { children?: unknown[]; text?: string }, visit);
  }
};
