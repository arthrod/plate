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

// Shared chrome typography. Aligned with the rest of the editor (Roboto / system
// sans). Exported so consumers can extend without redefining the same constants.
const CHROME_FONT =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const CHROME_INK = 'rgb(71 85 105)';
const CHROME_RULE = 'rgb(226 232 240)';

/**
 * Centered "Page N of M" footer chip. Default for the most common pagination
 * convention. A 1-px top border visually delineates the bottom-margin band
 * from the content area above it, making the page's margins legible without
 * a heavier paged-view treatment.
 */
export const PageNumber = (ctx: ChromeRenderContext): React.ReactNode => (
  <div
    data-page-number={ctx.pageIndex + 1}
    style={{
      alignItems: 'center',
      borderTop: `1px solid ${CHROME_RULE}`,
      color: CHROME_INK,
      display: 'flex',
      fontFamily: CHROME_FONT,
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
 * Title-on-the-left, "Page N of M"-on-the-right footer.
 * Renders nothing on page 1 by default (cover-page convention).
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
          borderTop: `1px solid ${CHROME_RULE}`,
          color: CHROME_INK,
          display: 'flex',
          fontFamily: CHROME_FONT,
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

/**
 * Constant uppercase text header (e.g. document title). Mirrors the footer's
 * 1-px rule on its BOTTOM edge so the page reads as a chrome-margin-content-
 * margin-chrome stack at a glance.
 */
export const TextHeader =
  (text: string) =>
  (_ctx: ChromeRenderContext): React.ReactNode => (
    <div
      style={{
        alignItems: 'center',
        borderBottom: `1px solid ${CHROME_RULE}`,
        color: CHROME_INK,
        display: 'flex',
        fontFamily: CHROME_FONT,
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
