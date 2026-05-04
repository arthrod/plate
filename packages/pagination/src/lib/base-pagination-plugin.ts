import { createTSlatePlugin, KEYS } from 'platejs';

import type { BasePaginationConfig } from './types';

import { BaseFooterPlugin } from './base-footer-plugin';
import { BaseHeaderPlugin } from './base-header-plugin';
import { BasePageBreakPlugin } from './base-page-break-plugin';
import { BaseSectionPlugin } from './base-section-plugin';
import { withPagination } from './with-pagination';

/**
 * Variant B base plugin: document-model `Section[]` with explicit `page_break`
 * void elements. The semantic invariants and the auto-paginator both run inside
 * `withNormalizeNode` (`overrideEditor(withPagination)`); see CR design notes
 * on issue #354.
 */
export const BasePaginationPlugin = createTSlatePlugin<BasePaginationConfig>({
  key: KEYS.pagination,
  options: {
    autoPaginate: true,
    margins: { bottom: 96, left: 96, right: 96, top: 96 },
    pageSize: 'A4',
  },
  plugins: [
    BaseSectionPlugin,
    BaseHeaderPlugin,
    BaseFooterPlugin,
    BasePageBreakPlugin,
  ],
}).overrideEditor(withPagination);
