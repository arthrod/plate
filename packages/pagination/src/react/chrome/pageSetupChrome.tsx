'use client';

// ============================================================
// pagination/react/chrome/pageSetupChrome.tsx
//
// Build header/footer chrome render options from a document PageSetupConfig.
// Each band is a VERTICAL STACK of content-sized lines that mirrors the page
// order:
//   top band    = [ page number (if top) , header ]
//   bottom band  = [ footnote , footer , page number (if bottom) ]
// Header/footer are full-width single lines. Band heights come from
// `resolveChromeBands(config, lineHeightPx)` so the composer (reserve) and the
// overlay (paint) agree — pass the SAME lineHeightPx to both. PRETEXT-safe.
// ============================================================

import * as React from 'react';

import type { PageChromeOption } from '../../lib/BasePaginationPlugin';
import type {
  ChromeContent,
  ChromeTextStyle,
  PageSetupConfig,
} from '../../lib/pageSetup';
import type { ChromeRenderContext } from '../../layout/types';

import { formatPageNumber } from '../../lib/formatPageNumber';
import {
  pageNumberLocation,
  resolveChromeBands,
} from '../../lib/resolvePageSetup';

function styleToCss(style: ChromeTextStyle | undefined): React.CSSProperties {
  return {
    color: style?.color,
    fontFamily: style?.fontFamily,
    fontSize: style?.fontSize,
    fontStyle: style?.italic ? 'italic' : undefined,
    fontWeight: style?.bold ? 700 : undefined,
  };
}

const rowStyle = (lineHeightPx: number): React.CSSProperties => ({
  alignItems: 'center',
  display: 'flex',
  height: lineHeightPx,
  width: '100%',
});

/** A full-width single line of header/footer content (rich html or plain text). */
function contentRow(
  content: ChromeContent | undefined,
  lineHeightPx: number,
  key: string
): React.ReactNode {
  const html = content?.html?.trim();
  const text = content?.text?.trim();
  if (!(html || text)) return null;
  const css = { ...styleToCss(content?.style), width: '100%' };

  return (
    <div key={key} style={rowStyle(lineHeightPx)}>
      {html ? (
        // Author-trusted chrome content.
        <span dangerouslySetInnerHTML={{ __html: html }} style={css} />
      ) : (
        <span style={css}>{text}</span>
      )}
    </div>
  );
}

/** The running page-number line, aligned within its full-width band. */
function pageNumberRow(
  config: PageSetupConfig,
  ctx: ChromeRenderContext,
  lineHeightPx: number
): React.ReactNode {
  if (config.pageNumber.differentFirstPage && ctx.pageIndex === 0) return null;
  const label = formatPageNumber(
    config.pageNumber,
    ctx.pageIndex + 1,
    ctx.pageCount
  );
  if (!label) return null;

  const justifyContent =
    config.pageNumber.align === 'left'
      ? 'flex-start'
      : config.pageNumber.align === 'right'
        ? 'flex-end'
        : 'center';

  return (
    <div key="number" style={{ ...rowStyle(lineHeightPx), justifyContent }}>
      <span
        data-page-number={ctx.pageIndex + 1}
        style={{
          ...styleToCss(config.pageNumberStyle),
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {label}
      </span>
    </div>
  );
}

/** The per-page footnote separator line (above the footer). */
function footnoteRow(
  config: PageSetupConfig,
  lineHeightPx: number
): React.ReactNode {
  return (
    <div
      data-pagination-chrome-band="footnote"
      key="footnote"
      style={{
        ...rowStyle(lineHeightPx),
        borderTop: '1px solid rgb(203 213 225)',
        opacity: 0.8,
      }}
    >
      <span style={{ fontSize: 10, ...styleToCss(config.footnoteStyle) }}>
        Footnotes
      </span>
    </div>
  );
}

const stackStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'flex-start',
  width: '100%',
};

/**
 * Header/footer {@link PageChromeOption}s for a page setup, each a vertical stack
 * of content-sized lines. Pass the same `lineHeightPx` the composer reserved
 * with (see {@link resolveChromeBands}). Returns `undefined` when no band is
 * active.
 */
export function resolvePageSetupChromeOptions(
  config: PageSetupConfig,
  lineHeightPx = 20
): { footer?: PageChromeOption; header?: PageChromeOption } | undefined {
  const bands = resolveChromeBands(config, lineHeightPx);
  if (!bands) return;

  const numberLoc = pageNumberLocation(config);

  return {
    ...(bands.header
      ? {
          header: {
            heightPx: bands.header.heightPx,
            render: (ctx: ChromeRenderContext) => (
              <div data-pagination-chrome-band="header" style={stackStyle}>
                {numberLoc === 'top' &&
                  pageNumberRow(config, ctx, lineHeightPx)}
                {contentRow(config.header, lineHeightPx, 'header')}
              </div>
            ),
          },
        }
      : {}),
    ...(bands.footer
      ? {
          footer: {
            heightPx: bands.footer.heightPx,
            render: (ctx: ChromeRenderContext) => (
              <div data-pagination-chrome-band="footer" style={stackStyle}>
                {config.footnotes === 'footnote' &&
                  footnoteRow(config, lineHeightPx)}
                {contentRow(config.footer, lineHeightPx, 'footer')}
                {numberLoc === 'bottom' &&
                  pageNumberRow(config, ctx, lineHeightPx)}
              </div>
            ),
          },
        }
      : {}),
  };
}
