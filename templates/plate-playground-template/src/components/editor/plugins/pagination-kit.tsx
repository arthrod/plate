'use client';

import { PaginationPlugin } from '@platejs/pagination';

/**
 * Pagination kit.
 *
 * `PaginationPlugin` auto-mounts its registry provider + reflow coordinator
 * (via `render.aboveEditable`), so only options need configuring here.
 *
 * Note: pagination wraps root content into `page` nodes, which is incompatible
 * with `TrailingBlockPlugin` (it enforces a trailing block at the editor root) —
 * they fight during normalization. Do not enable both in the same editor.
 */
export const PaginationKit = [
  PaginationPlugin.configure({
    options: {
      documentSettings: {
        margins: { bottom: 96, left: 72, right: 72, top: 96 },
        sizes: { width: 794, height: 1123 }, // A4 at 96 DPI
      },
    },
  }),
];
