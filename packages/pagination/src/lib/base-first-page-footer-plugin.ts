import { createSlatePlugin } from 'platejs';

import { FIRST_PAGE_FOOTER_KEY } from './internal/keys';

/**
 * Block-level first-page footer element.
 *
 * Authored once per document; the render-overlay paints it ONLY on page
 * index 0 when `firstPageDifferent` is true. Falls back to the regular
 * footer when this node is absent.
 */
export const BaseFirstPageFooterPlugin = createSlatePlugin({
  key: FIRST_PAGE_FOOTER_KEY,
  node: {
    isElement: true,
  },
});
