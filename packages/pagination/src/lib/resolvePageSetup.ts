// ============================================================
// pagination/lib/resolvePageSetup.ts
//
// Pure bridge from the document-level PageSetupConfig to the engine's
// LayoutInput. Decides which chrome bands the composer must reserve (a band
// exists when it carries text OR hosts the running page number) and at what
// height. No DOM, no React — deterministic for a given (config, policies).
// ============================================================

import type { LayoutInput, LayoutPolicies } from '../layout/types';
import type { PageNumberPosition, PageSetupConfig } from './pageSetup';

import { hasChromeContent } from './pageSetup';

/** Default reserved band height (px) for a header/footer chrome band. */
const DEFAULT_BAND_PX = 48;

/** The band that hosts a running page number, or `null` when it is omitted. */
export type ChromeBand = 'footer' | 'header' | null;

/** Which band (if any) the configured page-number placement lives in. */
export function pageNumberBand(position: PageNumberPosition): ChromeBand {
  if (position.startsWith('header')) return 'header';
  if (position.startsWith('footer')) return 'footer';

  return null;
}

/**
 * Reserved chrome bands for a page setup. A band is active when it carries
 * header/footer text OR hosts the running page number. Returns `undefined`
 * when neither band is active (the composer then uses the full content frame).
 */
export function resolveChromeBands(config: PageSetupConfig):
  | {
      footer?: { heightPx: number };
      header?: { heightPx: number };
    }
  | undefined {
  const band = pageNumberBand(config.pageNumber);
  const headerActive = hasChromeContent(config.header) || band === 'header';
  const footerActive = hasChromeContent(config.footer) || band === 'footer';

  if (!headerActive && !footerActive) return;

  return {
    ...(headerActive ? { header: { heightPx: DEFAULT_BAND_PX } } : {}),
    ...(footerActive ? { footer: { heightPx: DEFAULT_BAND_PX } } : {}),
  };
}

/**
 * Build the engine's pure {@link LayoutInput} from a page setup and the active
 * break policies. The page geometry + margins come straight from the setup;
 * chrome bands are reserved only when active.
 */
export function pageSetupToLayoutInput(
  config: PageSetupConfig,
  policies: LayoutPolicies
): LayoutInput {
  const chrome = resolveChromeBands(config);

  return {
    margins: config.margins,
    page: config.page,
    policies,
    ...(chrome ? { chrome } : {}),
  };
}
