import { createSlatePlugin } from 'platejs';

import { FIRST_PAGE_HEADER_KEY } from './internal/keys';

/**
 * Block-level first-page header element.
 *
 * Authored once per document; rendered in place of the regular `header` on
 * page index 0 when `BasePaginationOptions.firstPageDifferent === true`.
 * Skipped by the paginator like the regular header so it never lands inside
 * a page's content rect.
 */
export const BaseFirstPageHeaderPlugin = createSlatePlugin({
  key: FIRST_PAGE_HEADER_KEY,
  node: {
    isElement: true,
  },
});
