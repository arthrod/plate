import { createSlatePlugin, KEYS } from 'platejs';

/**
 * Block-level page-header element.
 *
 * Authored once per document; the render-overlay clones it onto every page.
 */
export const BaseHeaderPlugin = createSlatePlugin({
  key: KEYS.header,
  node: {
    isElement: true,
  },
});
