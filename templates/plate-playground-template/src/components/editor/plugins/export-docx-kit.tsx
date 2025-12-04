'use client';

import { ExportDocxPlugin } from '@platejs/export-docx';

export const ExportDocxKit = [
  ExportDocxPlugin.configure({
    options: {
      defaultOptions: {
        fontFamily: 'Arial',
        fontSize: 24, // 12pt
        properties: {
          creator: 'Plate Editor',
        },
      },
    },
  }),
];
