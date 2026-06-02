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
import { CHROME_FONT, CHROME_INK, CHROME_RULE } from './PageNumber';

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
  // Seed the shared chrome defaults so an author who sets no style still gets
  // restrained 11px slate-600 running text (not browser-default 16px black);
  // any authored style overrides via the trailing spread.
  const css = {
    color: CHROME_INK,
    fontFamily: CHROME_FONT,
    fontSize: 11,
    lineHeight: 1,
    ...styleToCss(content?.style),
    width: '100%',
  };

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
          color: CHROME_INK,
          fontFamily: CHROME_FONT,
          fontSize: 11,
          letterSpacing: '0.04em',
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
        alignItems: 'flex-start',
        flexDirection: 'column',
        justifyContent: 'center',
        rowGap: 3,
      }}
    >
      {/* Academic footnote separator: a 1/3-width hairline above a small-caps
          caption, reusing the shared chrome rule + ink. Stays within the single
          reserved lineHeightPx so the composer reserve and overlay paint agree. */}
      <span
        style={{
          borderTop: `1px solid ${CHROME_RULE}`,
          height: 0,
          width: '33%',
        }}
      />
      <span
        style={{
          color: CHROME_INK,
          fontFamily: CHROME_FONT,
          fontSize: 10,
          fontVariant: 'small-caps',
          letterSpacing: '0.08em',
          lineHeight: 1,
          ...styleToCss(config.footnoteStyle),
        }}
      >
        footnote
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
