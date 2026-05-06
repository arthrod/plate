import * as React from 'react';

import type { SlateElementProps } from 'platejs/static';

import { SlateElement } from 'platejs/static';

/**
 * Static (server-safe) renderer for the hard page-break element.
 *
 * In a printed/exported document a page break is rendered as a visible
 * separator so the reader knows content was split across pages. In screen
 * CSS a `page-break-after: always` rule is injected so PDF/print output
 * honours the break.
 *
 * The element is void — its `children` prop must still be rendered (Slate
 * requires it) but it produces no visible content.
 */
export function PageBreakElementStatic(props: SlateElementProps) {
  return (
    <SlateElement {...props}>
      <div
        contentEditable={false}
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: 8,
          pageBreakAfter: 'always',
          padding: '8px 0',
          userSelect: 'none',
        }}
      >
        <hr
          style={{
            border: 'none',
            borderTop: '1px dashed rgba(0,0,0,0.3)',
            flex: 1,
            margin: 0,
          }}
        />
        <span
          style={{
            color: 'rgba(0,0,0,0.4)',
            fontSize: 11,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Page Break
        </span>
        <hr
          style={{
            border: 'none',
            borderTop: '1px dashed rgba(0,0,0,0.3)',
            flex: 1,
            margin: 0,
          }}
        />
      </div>
      {props.children}
    </SlateElement>
  );
}
