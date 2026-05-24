'use client';

import { PaginationPlugin } from '@platejs/pagination/react';

// Advisory continuous-view page-break overlay. Starts disabled; the
// PaginationToolbarButton flips `enabled` at runtime via editor.setOption.
// The overlay is pointer-events:none and never mutates the document.
export const PaginationKit = [
  PaginationPlugin.configure({ options: { enabled: false } }),
];
