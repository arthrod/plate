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

const FOOTNOTE_SUB_PLUGINS = [
  FootnoteDefinitionPlugin,
  FootnoteReferencePlugin,
  FootnoteInputPlugin,
];

/**
 * React-side pagination plugin (variant A).
 *
 * - Lifts the page-chrome element plugins (header, footer, page break) to the
 *   React surface. The Slate-side composition lives on `BasePaginationPlugin`.
 * - Optionally bundles the footnote sub-plugins (default `true`); set
 *   `options.includeFootnoteSubPlugins = false` to opt out of footnote
 *   coupling.
 * - Mounts the {@link PageOverlay} via `render.afterEditable` so pages are
 *   painted as a derived overlay on top of the live editor (CodeRabbit
 *   Design Choice 1).
 */
export const PaginationPlugin = toTPlatePlugin<BasePaginationConfig>(
  BasePaginationPlugin
).extend(({ getOptions }) => ({
  plugins: [
    HeaderPlugin,
    FooterPlugin,
    PageBreakPlugin,
    ...(getOptions().includeFootnoteSubPlugins === false
      ? []
      : FOOTNOTE_SUB_PLUGINS),
  ],
  render: {
    afterEditable: PageOverlay,
  },
}));
