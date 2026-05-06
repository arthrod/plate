import { createSlateEditor } from 'platejs';

import { BasePaginationPlugin } from '../lib/base-pagination-plugin';
import { paginationStaticComponents } from './static-components';

/**
 * Singleton static editor used by `<PlateStatic>` inside the overlay.
 *
 * `createSlateEditor` has no browser deps, so this is SSR-safe. The same
 * instance is reused for every page thumbnail — node refs stay stable
 * across renders, which lets the memoized `ElementStatic`/`LeafStatic`
 * skip re-renders for unchanged subtrees.
 */
export const pageStaticEditor = createSlateEditor({
  components: paginationStaticComponents,
  plugins: [BasePaginationPlugin],
});
