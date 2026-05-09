import { createSlatePlugin } from 'platejs';

import { FIRST_PAGE_FOOTER_KEY } from './internal/keys';

/**
 * Block-level first-page footer element.
 *
 * Authored once per document; rendered in place of the regular `footer` on
 * page index 0 when `BasePaginationOptions.firstPageDifferent === true`.
 * Skipped by the paginator like the regular footer.
 */
export const BaseFirstPageFooterPlugin = createSlatePlugin({
  key: FIRST_PAGE_FOOTER_KEY,
  node: {
    isElement: true,
  },
});
