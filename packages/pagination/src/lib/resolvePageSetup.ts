// ============================================================
// pagination/lib/resolvePageSetup.ts
//
// Pure bridge from the document-level PageSetupConfig to the engine's
// LayoutInput. The chrome is a two-band model (top + bottom) but each band is a
// STACK of content-sized lines:
//   top    = [ page number (if top) , header ]
//   bottom = [ footnote , footer , page number (if bottom) ]
// Each line is one text line tall (`lineHeightPx`), so the band hugs its content
// instead of reserving a fixed slab. No DOM, no React.
// ============================================================

import type { LayoutInput, LayoutPolicies } from '../layout/types';
import type { PageSetupConfig } from './pageSetup';

import { hasChromeContent } from './pageSetup';

/** Fallback line height (px) when the React layer doesn't pass a measured one. */
const DEFAULT_LINE_PX = 20;

/** Which band the page-number line sits in, or `null` when it is omitted. */
export function pageNumberLocation(
  config: PageSetupConfig
): 'bottom' | 'top' | null {
  const { format, location } = config.pageNumber;
  if (format === 'none' || location === 'none') return null;

  return location;
}

/** Number of stacked lines in the top and bottom chrome bands. */
export function chromeBandLines(config: PageSetupConfig): {
  bottom: number;
  top: number;
} {
  const numberLoc = pageNumberLocation(config);
  // A per-page footnote band only when footnotes are per-page (not endnotes).
  const footnoteActive = config.footnotes === 'footnote';

  return {
    bottom:
      (footnoteActive ? 1 : 0) +
      (hasChromeContent(config.footer) ? 1 : 0) +
      (numberLoc === 'bottom' ? 1 : 0),
    top:
      (numberLoc === 'top' ? 1 : 0) + (hasChromeContent(config.header) ? 1 : 0),
  };
}

/**
 * Reserved chrome bands for a page setup, each sized to its stacked line count ×
 * `lineHeightPx`. Returns `undefined` when no band is active (full content
 * frame). The same `lineHeightPx` MUST be passed to the overlay renderer so
 * reserve and paint agree.
 */
export function resolveChromeBands(
  config: PageSetupConfig,
  lineHeightPx: number = DEFAULT_LINE_PX
):
  | {
      footer?: { heightPx: number };
      header?: { heightPx: number };
    }
  | undefined {
  const { bottom, top } = chromeBandLines(config);

  if (top === 0 && bottom === 0) return;

  return {
    ...(top > 0 ? { header: { heightPx: top * lineHeightPx } } : {}),
    ...(bottom > 0 ? { footer: { heightPx: bottom * lineHeightPx } } : {}),
  };
}

/**
 * Build the engine's pure {@link LayoutInput} from a page setup and the active
 * break policies. Page geometry + margins come straight from the setup; chrome
 * bands are reserved at content-sized heights when active.
 */
export function pageSetupToLayoutInput(
  config: PageSetupConfig,
  policies: LayoutPolicies,
  lineHeightPx: number = DEFAULT_LINE_PX
): LayoutInput {
  const chrome = resolveChromeBands(config, lineHeightPx);

  return {
    margins: config.margins,
    page: config.page,
    policies,
    ...(chrome ? { chrome } : {}),
  };
}
