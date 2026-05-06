import { createSlatePlugin } from 'platejs';

import { HEADER_KEY } from './internal/keys';

/**
 * Block-level page-header element.
 *
 * Authored once per document; the render-overlay clones it onto every page.
 */
export const BaseHeaderPlugin = createSlatePlugin({
  key: HEADER_KEY,
  node: {
    isElement: true,
  },
});
