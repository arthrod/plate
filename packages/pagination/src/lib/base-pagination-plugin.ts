import { createTSlatePlugin, KEYS, type PluginConfig } from 'platejs';

import { BaseFooterPlugin } from './base-footer-plugin';
import { BaseHeaderPlugin } from './base-header-plugin';
import { BasePageBreakPlugin } from './base-page-break-plugin';
import type { BasePaginationOptions } from './types';

export type BasePaginationConfig = PluginConfig<
  typeof KEYS.pagination,
  BasePaginationOptions
>;

/**
 * Base orchestrator plugin for paginated layout.
 *
 * Variant A — render-time overlay; pages derived; pretext as height oracle.
 * The Slate document is unchanged; pagination is a render-only projection
 * layered onto the live editor via the Plate `render.afterEditable` slot.
 *
 * The page-chrome element family (header, footer, page break) is composed
 * here on the Slate base so a Slate-only consumer registering
 * `BasePaginationPlugin` already gets the element schema. React-only deltas
 * (footnote sub-plugins, overlay rendering) live in `src/react`.
 */
export const BasePaginationPlugin = createTSlatePlugin<BasePaginationConfig>({
  key: KEYS.pagination,
  options: {
    footerHeight: 48,
    footnoteWell: 0,
    headerHeight: 48,
    includeFootnoteSubPlugins: true,
    margins: {
      bottom: 72,
      left: 72,
      right: 72,
      top: 72,
    },
    pageSize: 'A4',
  },
  plugins: [BaseHeaderPlugin, BaseFooterPlugin, BasePageBreakPlugin],
});
