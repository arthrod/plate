'use client';

import * as React from 'react';

import { PaginationPlugin } from '@platejs/pagination/react';
import type { Value } from 'platejs';
import { Plate, PlateContent, usePlateEditor } from 'platejs/react';

import { BasicNodesKit } from '@/registry/components/editor/plugins/basic-nodes-kit';

const PAGE_W = 794; // A4 @ 96dpi
const MARGIN = 96; // 1in

function makeValue(): Value {
  const out: Value = [];
  for (let i = 0; i < 40; i++) {
    if (i % 8 === 0) {
      out.push({ children: [{ text: `Section ${i / 8 + 1}` }], type: 'h2' });
    } else {
      out.push({
        children: [
          {
            text: `Paragraph ${i}. This is a reasonably long paragraph of placeholder text so that the content reliably wraps onto multiple lines and flows across several A4 pages, exercising the pagination plugin end to end.`,
          },
        ],
        type: 'p',
      });
    }
  }

  return out;
}

/**
 * Continuous-view demo for the pagination plugin: a single A4-width editable in
 * normal flow; the plugin paints advisory page-break lines at each boundary.
 */
export function PaginationView() {
  const editor = usePlateEditor({
    plugins: [...BasicNodesKit, PaginationPlugin],
    value: makeValue(),
  });

  return (
    <div
      data-testid="pagination-desk"
      style={{
        background: 'linear-gradient(#f3f4f6, #e5e7eb)',
        minHeight: '100vh',
        overflow: 'auto',
        padding: 24,
      }}
    >
      <div
        data-testid="pagination-stack"
        style={{
          background: '#fff',
          boxShadow: '0 2px 12px rgba(15,23,42,0.12)',
          margin: '0 auto',
          padding: MARGIN,
          position: 'relative',
          width: PAGE_W,
        }}
      >
        <Plate editor={editor}>
          <PlateContent style={{ outline: 'none' }} />
        </Plate>
      </div>
    </div>
  );
}
