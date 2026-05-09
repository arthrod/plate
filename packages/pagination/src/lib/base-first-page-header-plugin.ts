import { createSlatePlugin } from 'platejs';

import { FIRST_PAGE_HEADER_KEY } from './internal/keys';

/**
 * Block-level first-page header element.
 *
 * Authored once per document; the render-overlay paints it ONLY on page
 * index 0 when `firstPageDifferent` is true. Falls back to the regular
 * header when this node is absent.
 */
export const BaseFirstPageHeaderPlugin = createSlatePlugin({
  key: FIRST_PAGE_HEADER_KEY,
  node: {
    isElement: true,
  },
});
