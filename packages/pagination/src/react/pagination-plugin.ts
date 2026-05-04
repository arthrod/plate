import {
  FootnoteDefinitionPlugin,
  FootnoteInputPlugin,
  FootnoteReferencePlugin,
} from '@platejs/footnote/react';
import { toTPlatePlugin } from 'platejs/react';

import {
  BasePaginationPlugin,
  type BasePaginationConfig,
} from '../lib/base-pagination-plugin';
import { FooterPlugin } from './footer-plugin';
import { HeaderPlugin } from './header-plugin';
import { PageBreakPlugin } from './page-break-plugin';
import { PageOverlay } from './page-overlay';

/**
 * React-side pagination plugin (variant A).
 *
 * - Bundles the page-chrome element plugins (header, footer, page break)
 *   and the footnote plugins so consumers register one thing.
 * - Mounts the {@link PageOverlay} via `render.afterEditable` so pages are
 *   painted as a derived overlay on top of the live editor (CodeRabbit
 *   Design Choice 1).
 */
export const PaginationPlugin = toTPlatePlugin<BasePaginationConfig>(
  BasePaginationPlugin,
  {
    plugins: [
      HeaderPlugin,
      FooterPlugin,
      PageBreakPlugin,
      FootnoteDefinitionPlugin,
      FootnoteReferencePlugin,
      FootnoteInputPlugin,
    ],
    render: {
      afterEditable: PageOverlay,
    },
  }
);
