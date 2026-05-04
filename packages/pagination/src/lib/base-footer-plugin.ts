import { createSlatePlugin, KEYS } from 'platejs';

/**
 * Block-level page-footer element.
 *
 * Authored once per document; the render-overlay clones it onto every page
 * and runs the footnote-well allocator above it.
 */
export const BaseFooterPlugin = createSlatePlugin({
  key: KEYS.footer,
  node: {
    isElement: true,
  },
});
