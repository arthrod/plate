'use client';

import { PaginationPlugin } from '@platejs/pagination/react';

export const PaginationKit = [
  PaginationPlugin.configure({
    options: {
      footnotePlacement: 'footer',
      footnoteWell: 96,
      includeFootnoteSubPlugins: false,
      margins: { bottom: 96, left: 72, right: 72, top: 96 },
      pageSize: 'A4',
      previewVisible: false,
    },
  }),
];
