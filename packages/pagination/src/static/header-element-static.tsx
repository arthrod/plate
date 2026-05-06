import * as React from 'react';

import type { SlateElementProps } from 'platejs/static';

import { SlateElement } from 'platejs/static';

/**
 * Static (server-safe) renderer for the page-header element.
 *
 * Authored once per document; when serialising to HTML the header block
 * is rendered as a `<header>` landmark so screen readers and crawlers can
 * identify it correctly. The interactive overlay that repeats it on every
 * page chrome lives in `src/react` and is not imported here.
 */
export function HeaderElementStatic(props: SlateElementProps) {
  return (
    <SlateElement
      {...props}
      as="header"
      style={{
        borderBottom: '1px solid rgba(0,0,0,0.12)',
        padding: '8px 0',
      }}
    >
      {props.children}
    </SlateElement>
  );
}