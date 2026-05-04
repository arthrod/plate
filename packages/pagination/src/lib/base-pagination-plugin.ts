import { createTSlatePlugin, KEYS, type PluginConfig } from 'platejs';

import type { BasePaginationOptions } from './types';

export type BasePaginationConfig = PluginConfig<
  'pagination',
  BasePaginationOptions
>;

/**
 * Base orchestrator plugin for paginated layout.
 *
 * Variant A — render-time overlay; pages derived; pretext as height oracle.
 * The Slate document is unchanged; pagination is a render-only projection
 * layered onto the live editor via the Plate `render.afterEditable` slot.
 *
 * Document-affecting behavior (header, footer, page break elements,
 * footnotes) is composed in `src/react` via the React wrapper.
 */
export const BasePaginationPlugin = createTSlatePlugin<BasePaginationConfig>({
  key: KEYS.pagination,
  options: {
    footerHeight: 48,
    footnoteWell: 0,
    headerHeight: 48,
    margins: {
      bottom: 72,
      left: 72,
      right: 72,
      top: 72,
    },
    pageSize: 'A4',
  },
});
