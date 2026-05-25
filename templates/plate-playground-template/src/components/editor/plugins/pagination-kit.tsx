'use client';

import { PaginationPlugin } from '@platejs/pagination/react';
import { KEYS } from 'platejs';

// Advisory continuous-view page-break overlay. Starts disabled; the
// PaginationToolbarButton flips `enabled` at runtime via editor.setOption.
// The overlay is pointer-events:none and never mutates the document.
//
// atomicTypes: non-text blocks placed whole. Pretext measures text-flow blocks
// (paragraphs, headings) line-accurately; these blocks have no text flow to
// shape, so the engine packs them by their rendered footprint instead. Without
// this, images/tables/etc. measure as ~one line and the document collapses to a
// single page (no break lines).
export const PaginationKit = [
  PaginationPlugin.configure({
    options: {
      atomicTypes: [
        KEYS.table,
        KEYS.img,
        KEYS.video,
        KEYS.audio,
        KEYS.file,
        KEYS.codeBlock,
        KEYS.toc,
        KEYS.hr,
        KEYS.mediaEmbed,
        KEYS.columnGroup,
        KEYS.equation,
      ],
      enabled: false,
    },
  }),
];
