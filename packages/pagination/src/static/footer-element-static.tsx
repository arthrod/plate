import * as React from 'react';

import type { SlateElementProps } from 'platejs/static';

import { SlateElement } from 'platejs/static';

/**
 * Static (server-safe) renderer for the page-footer element.
 *
 * Authored once per document; when serialising to HTML the footer block
 * is rendered as a `<footer>` landmark so screen readers and crawlers can
 * identify it correctly. The interactive overlay that repeats it on every
 * page chrome lives in `src/react` and is not imported here.
 */
export function FooterElementStatic({
  children,
  style,
  ...props
}: SlateElementProps) {
  return (
    <SlateElement
      {...props}
      as="footer"
      style={{
        borderTop: '1px solid rgba(0,0,0,0.12)',
        padding: '8px 0',
        ...style,
      }}
    >
      {children}
    </SlateElement>
  );
}
