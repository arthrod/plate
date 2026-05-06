import { createSlatePlugin } from 'platejs';

import { PAGE_BREAK_KEY } from './internal/keys';

/**
 * Hard page-break element.
 *
 * The render-overlay paginator splits a page boundary at every break node.
 */
export const BasePageBreakPlugin = createSlatePlugin({
  key: PAGE_BREAK_KEY,
  node: {
    isElement: true,
    isVoid: true,
  },
});
