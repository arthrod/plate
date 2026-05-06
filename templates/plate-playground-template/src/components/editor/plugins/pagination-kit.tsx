'use client';

import { PaginationPlugin } from '@platejs/pagination/react';
import type { AnyPlatePlugin } from 'platejs/react';

/**
 * Pagination kit — variant A (render-time overlay).
 *
 * Painted as an absolute overlay on top of the editor; pages are derived
 * per render and the document model never changes. See `@platejs/pagination`.
 */
export const PaginationKit: AnyPlatePlugin[] = [
  PaginationPlugin.configure({
    options: {
      footerHeight: 48,
      footnoteWell: 96,
      headerHeight: 48,
      includeFootnoteSubPlugins: false,
      margins: { bottom: 96, left: 72, right: 72, top: 96 },
      pageSize: 'A4',
    },
  }) as unknown as AnyPlatePlugin,
];
