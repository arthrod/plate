import { createSlatePlugin, KEYS } from 'platejs';

/**
 * Hard page-break element.
 *
 * The render-overlay paginator splits a page boundary at every break node.
 */
export const BasePageBreakPlugin = createSlatePlugin({
  key: KEYS.pageBreak,
  node: {
    isElement: true,
    isVoid: true,
  },
});
