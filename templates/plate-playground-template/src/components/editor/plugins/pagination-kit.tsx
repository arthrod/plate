'use client';

import {
  PageNumberWithTitle,
  PageSetupPlugin,
  PaginationPlugin,
  TextHeader,
} from '@platejs/pagination/react';
import { KEYS } from 'platejs';

// Advisory continuous-view page-break overlay + chrome (headers / footers /
// page numbers / margins). Starts disabled; the PaginationToolbarButton flips
// `enabled` at runtime via editor.setOption. The overlay is pointer-events:none
// and never mutates the document.
//
// atomicTypes: non-text blocks placed whole. Pretext measures text-flow blocks
// (paragraphs, headings) line-accurately; these blocks have no text flow to
// shape, so the engine packs them by their rendered footprint instead. Without
// this, images/tables/etc. measure as ~one line and the document collapses to
// a single page (no break lines).
//
// chrome: render functions are PURE — they read only ctx.{pageIndex,pageCount,
// page,margins} and return ReactNodes. The composer reserves chrome.heightPx
// from the content frame; the overlay anchors each band to `PageLayout.chrome.
// {header,footer}` (composer-computed, scroll-invariant). No DOM mutation, no
// document-tree mutation.
export const PaginationKit = [
  // Stores document-level page setup (margins/page size/page-number/footnote/
  // header-footer chrome) on a void page_setup node; the modal + margins mode
  // read/write it.
  PageSetupPlugin,
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
      // dotted reads as a finer, quieter cadence than dashed across the full
      // desk width — the cleaner "page ends here" hint for this demo. The
      // package default stays 'dashed' (broadest generic fallback).
      breakLineStyle: 'dotted',
      chrome: {
        // Cover-page convention: page 1 stays blank (no header, no footer).
        // PageNumberWithTitle is configured with skipFirstPage=true by default
        // and renders nothing on page 1; the matching first-page header skip
        // is wired via a one-line wrapper around TextHeader.
        footer: {
          heightPx: 32,
          render: PageNumberWithTitle('Plate Playground'),
        },
        header: {
          heightPx: 28,
          render: (ctx) =>
            ctx.pageIndex === 0
              ? null
              : (TextHeader('Plate Playground')(ctx) as React.ReactNode),
        },
      },
      enabled: false,
    },
  }),
];
