import * as React from 'react';

import type { SlateElementProps } from 'platejs/static';

import { SlateElement } from 'platejs/static';

/**
 * Static (server-safe) renderer for the first-page header element.
 *
 * Authored once per document; print/PDF flows render this on page 0 only
 * when `firstPageDifferent` is on. Falls back to the regular header in the
 * paged view when this element is absent.
 */
export function FirstPageHeaderElementStatic({
  children,
  style,
  ...props
}: SlateElementProps) {
  return (
    <SlateElement
      {...props}
      as="header"
      style={{
        borderBottom: '1px solid rgba(0,0,0,0.12)',
        padding: '8px 0',
        ...style,
      }}
    >
      {children}
    </SlateElement>
  );
}
