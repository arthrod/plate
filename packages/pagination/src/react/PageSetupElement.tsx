'use client';

// ============================================================
// pagination/react/PageSetupElement.tsx
//
// Invisible host for the void `page_setup` metadata node. Renders at zero
// height in normal flow so it occupies block index 0 — keeping the engine's
// path-based DOM alignment intact (`topLevelBlockElements()[0]`) — while adding
// nothing visible. The engine skips it during pagination (buildSnapshot
// `skipTypes`), so it is never measured or paginated.
// ============================================================

import * as React from 'react';

import type { PlateElementProps } from 'platejs/react';

import { PlateElement } from 'platejs/react';

export function PageSetupElement(props: PlateElementProps): React.ReactElement {
  return (
    <PlateElement
      {...props}
      style={{ height: 0, margin: 0, overflow: 'hidden', padding: 0 }}
    >
      {props.children}
    </PlateElement>
  );
}
