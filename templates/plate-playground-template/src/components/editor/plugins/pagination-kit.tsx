'use client';

import { PageOverlay, PaginationPlugin } from '@platejs/pagination/react';

/**
 * Pagination kit — variant A (render-time overlay).
 *
 * Painted as an absolute overlay on top of the editor; pages are derived
 * per render and the document model never changes. See `@platejs/pagination`.
 *
 * Render is bound at the kit level (not the package) so the JSX boundary
 * lives inside this `'use client'` file — mirrors the `CursorOverlayKit`
 * pattern used by other Plate plugins.
 */
export const PaginationKit = [
  PaginationPlugin.configure({
    options: {
      footerHeight: 48,
      footnoteWell: 96,
      headerHeight: 48,
      includeFootnoteSubPlugins: false,
      margins: { bottom: 96, left: 72, right: 72, top: 96 },
      pageSize: 'A4',
    },
    render: {
      afterEditable: () => <PageOverlay />,
    },
  }),
];
