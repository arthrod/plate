'use client';

// ============================================================
// pagination/react/chrome/pageSetupChrome.tsx
//
// Build header/footer chrome render options from a document PageSetupConfig.
// Each band is a 3-slot row (left | center | right): the band's text sits left,
// the running page number sits in the slot matching its configured alignment.
// Band heights come from `resolveChromeBands` so the composer (which reserves
// the band) and the overlay (which paints it) always agree. PRETEXT-safe: the
// render functions read only the ChromeRenderContext.
// ============================================================

import * as React from 'react';

import type { PageChromeOption } from '../../lib/BasePaginationPlugin';
import type {
  ChromeTextStyle,
  PageNumberPosition,
  PageSetupConfig,
} from '../../lib/pageSetup';
import type { ChromeRenderContext } from '../../layout/types';

import { pageNumberBand, resolveChromeBands } from '../../lib/resolvePageSetup';

/** CSS for a chrome region's typography. */
function styleToCss(style: ChromeTextStyle | undefined): React.CSSProperties {
  return {
    color: style?.color,
    fontFamily: style?.fontFamily,
    fontSize: style?.fontSize,
    fontStyle: style?.italic ? 'italic' : undefined,
    fontWeight: style?.bold ? 700 : undefined,
  };
}

/** Horizontal alignment a page-number position maps to, or `null` when omitted. */
export function pageNumberAlign(
  position: PageNumberPosition
): 'center' | 'left' | 'right' | null {
  if (position.endsWith('left')) return 'left';
  if (position.endsWith('center')) return 'center';
  if (position.endsWith('right')) return 'right';

  return null;
}

function bandNode(
  band: 'footer' | 'header',
  config: PageSetupConfig,
  ctx: ChromeRenderContext
): React.ReactNode {
  const content = config[band];
  const align =
    pageNumberBand(config.pageNumber) === band
      ? pageNumberAlign(config.pageNumber)
      : null;

  const slots: Record<'center' | 'left' | 'right', React.ReactNode> = {
    center: null,
    left: null,
    right: null,
  };

  const text = content?.text?.trim();
  if (text) {
    slots.left = <span style={styleToCss(content?.style)}>{text}</span>;
  }
  if (align) {
    slots[align] = (
      <span
        data-page-number={ctx.pageIndex + 1}
        style={{
          ...styleToCss(content?.style),
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {`Page ${ctx.pageIndex + 1} of ${ctx.pageCount}`}
      </span>
    );
  }

  return (
    <div
      data-pagination-chrome-band={band}
      style={{
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        width: '100%',
      }}
    >
      <div style={{ flex: 1, textAlign: 'left' }}>{slots.left}</div>
      <div style={{ flex: 1, textAlign: 'center' }}>{slots.center}</div>
      <div style={{ flex: 1, textAlign: 'right' }}>{slots.right}</div>
    </div>
  );
}

/**
 * Header/footer {@link PageChromeOption}s for a page setup, or `undefined` when
 * no band is active. Heights mirror {@link resolveChromeBands} so reserve and
 * paint stay in sync.
 */
export function resolvePageSetupChromeOptions(
  config: PageSetupConfig
): { footer?: PageChromeOption; header?: PageChromeOption } | undefined {
  const bands = resolveChromeBands(config);
  if (!bands) return;

  return {
    ...(bands.header
      ? {
          header: {
            heightPx: bands.header.heightPx,
            render: (ctx: ChromeRenderContext) =>
              bandNode('header', config, ctx),
          },
        }
      : {}),
    ...(bands.footer
      ? {
          footer: {
            heightPx: bands.footer.heightPx,
            render: (ctx: ChromeRenderContext) =>
              bandNode('footer', config, ctx),
          },
        }
      : {}),
  };
}
