// ============================================================
// pagination/react/chrome/PageNumber.tsx
//
// Convenience exports for the most common chrome content: page numbers in a
// header or footer band. Each export is a PURE render function — it derives
// every pixel from `ChromeRenderContext.{pageIndex, pageCount, page, margins}`
// and never touches the DOM, the editor, or scroll state. PRETEXT-safe.
//
// Consumers configure chrome on the pagination plugin:
//
//   import { PageNumber } from '@platejs/pagination/react';
//
//   PaginationPlugin.configure({
//     options: {
//       chrome: {
//         footer: { heightPx: 32, render: PageNumber },
//       },
//     },
//   });
//
// ============================================================

// `React` (not just the types) is needed at runtime because the JSX below
// compiles to `React.createElement(...)`. A type-only import elides at runtime
// and the bundled module throws `React is not defined` the moment the consumer
// invokes a render function. CodeRabbit-style note: avoid `import type * as
// React` whenever the file emits JSX.
import * as React from 'react';

import type { ChromeRenderContext } from '../../layout/types';

/**
 * Centered "Page N of M" footer chip. Default for the most common pagination
 * convention.
 */
export const PageNumber = (ctx: ChromeRenderContext): React.ReactNode => (
  <div
    data-page-number={ctx.pageIndex + 1}
    style={{
      alignItems: 'center',
      color: 'rgb(71 85 105)',
      display: 'flex',
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      fontSize: 11,
      height: '100%',
      justifyContent: 'center',
      letterSpacing: '0.04em',
      width: '100%',
    }}
  >
    {`Page ${ctx.pageIndex + 1} of ${ctx.pageCount}`}
  </div>
);

/**
 * "Title — Page N of M" footer (or header). Renders nothing on page 1 by
 * default (cover-page convention).
 */
export const PageNumberWithTitle =
  (title: string, opts: { skipFirstPage?: boolean } = { skipFirstPage: true }) =>
  (ctx: ChromeRenderContext): React.ReactNode => {
    if (opts.skipFirstPage && ctx.pageIndex === 0) return null;
    return (
      <div
        data-page-number={ctx.pageIndex + 1}
        style={{
          alignItems: 'center',
          color: 'rgb(71 85 105)',
          display: 'flex',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          fontSize: 11,
          height: '100%',
          justifyContent: 'space-between',
          letterSpacing: '0.04em',
          width: '100%',
        }}
      >
        <span>{title}</span>
        <span>{`Page ${ctx.pageIndex + 1} of ${ctx.pageCount}`}</span>
      </div>
    );
  };

/** Constant uppercase text header (e.g. document title). */
export const TextHeader =
  (text: string) =>
  (_ctx: ChromeRenderContext): React.ReactNode => (
    <div
      style={{
        alignItems: 'center',
        borderBottom: '1px solid rgb(226 232 240)',
        color: 'rgb(71 85 105)',
        display: 'flex',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        fontSize: 11,
        fontWeight: 600,
        height: '100%',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        width: '100%',
      }}
    >
      <span>{text}</span>
    </div>
  );
