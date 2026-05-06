import { createSlatePlugin } from 'platejs';

import { FOOTER_KEY } from './internal/keys';

/**
 * Block-level page-footer element.
 *
 * Authored once per document; the render-overlay clones it onto every page
 * and runs the footnote-well allocator above it.
 */
export const BaseFooterPlugin = createSlatePlugin({
  key: FOOTER_KEY,
  node: {
    isElement: true,
  },
});
