import * as React from 'react';

import type { TElement, TText } from 'platejs';

import type { Page, PageMargins } from '../lib/types';

const HEADING_TYPE_RE = /^h([1-6])$/;
const HEADING_SIZES = [0, 28, 22, 18, 16, 14, 13] as const;

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
 * footnote well, footer band — with content rendered by a small recursive
 * preview renderer that mirrors the live block types and inline marks.
 *
 * The thumbnail is intentionally lossy (no plugin parity), but it preserves
 * heading hierarchy and basic mark styling (bold, italic, code, underline,
 * strikethrough) so the preview reads as a faithful map of the document
 * rather than a flattened text dump.
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
          {documentHeader ? <BlockPreview node={documentHeader} /> : null}
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
          {page.footnotes.map((def, i) => (
            <div key={(def as { id?: string }).id ?? i}>
              {`[${(def as { identifier?: string }).identifier ?? i + 1}] `}
              <InlinePreview node={def} />
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
            {documentFooter ? <InlinePreview node={documentFooter} /> : null}
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
        {page.nodes.map((node, i) => (
          <BlockPreview key={(node as { id?: string }).id ?? i} node={node} />
        ))}
      </div>
    </div>
  );
};

/** Renders a single block with type-aware styling and mark-aware inlines. */
const BlockPreview = ({ node }: { node: TElement }): React.JSX.Element => {
  const type = node.type;

  if (typeof type === 'string' && HEADING_TYPE_RE.test(type)) {
    const level = Number.parseInt(type.slice(1), 10);

    return (
      <div
        style={{
          fontSize: HEADING_SIZES[level] ?? 16,
          fontWeight: 700,
          lineHeight: 1.25,
          margin: '12px 0 8px',
        }}
      >
        <InlinePreview node={node} />
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
        <InlinePreview node={node} />
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
        <InlinePreview node={node} />
      </div>
    );
  }
  if (type === 'ul' || type === 'ol') {
    const Tag = type === 'ol' ? 'ol' : 'ul';

    return (
      <Tag
        style={{
          fontSize: 14,
          lineHeight: 1.5,
          margin: '6px 0',
          paddingLeft: 24,
        }}
      >
        {(node.children as TElement[]).map((child, i) => (
          <li key={(child as { id?: string }).id ?? i}>
            <InlinePreview node={child} />
          </li>
        ))}
      </Tag>
    );
  }

  return (
    <div style={{ fontSize: 14, lineHeight: 1.5, margin: '6px 0' }}>
      <InlinePreview node={node} />
    </div>
  );
};

type InlineNode = (TElement | TText | { children?: unknown[]; text?: string }) &
  Record<string, unknown>;

/**
 * Renders the inline content of `node` with mark-aware styling. Text leaves
 * apply bold/italic/underline/strikethrough/code; nested elements (links,
 * mentions, etc.) recurse so styled inlines flow into the parent line box.
 */
const InlinePreview = ({ node }: { node: InlineNode }): React.JSX.Element => {
  const children = (node.children as InlineNode[] | undefined) ?? [];

  return (
    <>
      {children.map((child, i) => {
        if (typeof child.text === 'string') {
          return <Leaf key={i} leaf={child} />;
        }

        return <InlinePreview key={i} node={child} />;
      })}
    </>
  );
};

const Leaf = ({ leaf }: { leaf: InlineNode }): React.ReactNode => {
  const text = (leaf.text as string) || '';
  if (!text) return null;

  let element: React.ReactNode = text;

  if (leaf.code) {
    element = (
      <code
        style={{
          background: 'rgba(15,23,42,0.06)',
          borderRadius: 2,
          fontFamily: 'ui-monospace, monospace',
          fontSize: '0.92em',
          padding: '0 2px',
        }}
      >
        {element}
      </code>
    );
  }
  if (leaf.bold) element = <strong>{element}</strong>;
  if (leaf.italic) element = <em>{element}</em>;
  if (leaf.underline) element = <u>{element}</u>;
  if (leaf.strikethrough) element = <s>{element}</s>;

  return element;
};
