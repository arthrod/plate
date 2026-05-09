import {
  FootnoteDefinitionPlugin,
  FootnoteInputPlugin,
  FootnoteReferencePlugin,
} from '@platejs/footnote/react';
import { toTPlatePlugin } from 'platejs/react';
import * as React from 'react';

import {
  BasePaginationPlugin,
  type BasePaginationConfig,
} from '../lib/base-pagination-plugin';
import { FirstPageFooterPlugin } from './first-page-footer-plugin';
import { FirstPageHeaderPlugin } from './first-page-header-plugin';
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
 * - Mounts {@link FootnotePortal} alongside the overlay to hide in-flow
 *   `footnoteDefinition` blocks (CodeRabbit Design Choice 2). The visible
 *   copy is rendered inside each page's footnote well by `PageFrame`.
 */
export const PaginationPlugin = toTPlatePlugin<BasePaginationConfig>(
  BasePaginationPlugin
).extend(({ getOptions }) => ({
  plugins: [
    HeaderPlugin,
    FooterPlugin,
    FirstPageHeaderPlugin,
    FirstPageFooterPlugin,
    PageBreakPlugin,
    ...(getOptions().includeFootnoteSubPlugins === false
      ? []
      : FOOTNOTE_SUB_PLUGINS),
  ],
  render: {
    // The `afterEditable` slot is invoked as a render function; wrap the
    // component via `createElement` so React mounts it as a real component
    // (hooks + reconciliation), instead of calling `PageOverlay()` directly
    // which would short-circuit the hooks lifecycle. (`.ts` file — no JSX.)
    afterEditable: () => React.createElement(PageOverlay),
  },
}));
