'use client';

import { PaginationPlugin } from '@platejs/pagination/react';

/**
 * Pagination kit — variant A (render-time overlay).
 *
 * `PaginationPlugin` registers `PageOverlay` on `render.afterEditable`
 * itself; the kit only carries the option overrides. The overlay is
 * mode-aware: in `mode: 'standard'` it renders nothing (continuous flow),
 * and in `mode: 'paged'` it stacks PlateStatic-rendered page frames and
 * hides the live `<Editable />` via a body-level data attribute.
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
  }),
];
