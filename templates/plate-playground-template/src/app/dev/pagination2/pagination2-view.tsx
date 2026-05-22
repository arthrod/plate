'use client';

import * as React from 'react';

import {
  alignContentToLayout,
  buildSnapshot,
  composeLayout,
  createDomMeasure,
  getPageGeometry,
  type LayoutOutput,
  measureSnapshot,
  PAGE_STACK_GAP_PX,
  renderSplitClones,
} from '@platejs/pagination/react';
import { type Value } from 'platejs';
import { Plate, PlateContent, usePlateEditor } from 'platejs/react';

import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit';

const PAGE = { widthPx: 794, heightPx: 1123, preset: 'a4' as const };
const MARGINS = { topPx: 96, rightPx: 96, bottomPx: 96, leftPx: 96 };
const INPUT = {
  margins: MARGINS,
  page: PAGE,
  policies: { keepWithNextEnabled: true, orphanLinesMin: 2, widowLinesMin: 2 },
};
const CONTENT_W = PAGE.widthPx - MARGINS.leftPx - MARGINS.rightPx;
const CONTENT_H = PAGE.heightPx - MARGINS.topPx - MARGINS.bottomPx;

function makeValue(): Value {
  const out: Value = [];
  for (let i = 0; i < 24; i++) {
    if (i % 8 === 0) {
      out.push({ children: [{ text: `Section ${i / 8 + 1}` }], type: 'h2' });
    } else {
      out.push({
        children: [
          {
            text: `Paragraph ${i}. This is a reasonably long paragraph of placeholder text so that the content reliably wraps onto multiple lines and flows across several A4 pages, exercising the deterministic pagination engine end to end.`,
          },
        ],
        type: 'p',
      });
    }
  }
  // A single block taller than a page — must split across page boxes.
  out.push({ children: [{ text: 'Giant block (spans pages)' }], type: 'h2' });
  out.push({
    children: [
      {
        text: Array.from(
          { length: 80 },
          (_, n) =>
            `Sentence ${n + 1} of one very long paragraph that is far taller than a single page and therefore must be split across multiple page boxes by the clipped-clone renderer.`
        ).join(' '),
      },
    ],
    type: 'p',
  });

  return out;
}

export function PaginationView() {
  const editor = usePlateEditor({ plugins: BasicNodesKit, value: makeValue() });
  const [layout, setLayout] = React.useState<LayoutOutput | null>(null);
  const cacheRef = React.useRef(new Map());
  const overlayRef = React.useRef<HTMLDivElement>(null);

  const recompute = React.useCallback(() => {
    const editable = document.querySelector(
      '[data-slate-editor]'
    ) as HTMLElement | null;
    const overlay = overlayRef.current;
    if (!editable || !overlay) return;

    // Reset prior clip mutations so measurement sees true block heights.
    for (const el of editable.querySelectorAll<HTMLElement>(
      ':scope > [data-slate-node="element"]'
    )) {
      el.style.maxHeight = '';
      el.style.overflow = '';
    }

    const snapshot = buildSnapshot(editor.children as any[], {
      keepWithNextTypes: ['h1', 'h2', 'h3'],
    });
    const measured = measureSnapshot(snapshot, createDomMeasure(editable), {
      cache: cacheRef.current,
      widthPx: CONTENT_W,
    });
    const out = composeLayout(measured, INPUT);

    alignContentToLayout(editable, out, INPUT);
    const geometry = getPageGeometry(out, PAGE_STACK_GAP_PX);
    renderSplitClones(editable, overlay, out, geometry, {
      contentHeightPx: CONTENT_H,
      contentWidthPx: CONTENT_W,
      marginLeftPx: MARGINS.leftPx,
      marginTopPx: MARGINS.topPx,
    });
    setLayout(out);
  }, [editor]);

  React.useLayoutEffect(() => {
    const id = requestAnimationFrame(recompute);

    return () => cancelAnimationFrame(id);
  }, [recompute]);

  const geometry = layout ? getPageGeometry(layout, PAGE_STACK_GAP_PX) : null;

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
          height: geometry?.height ?? PAGE.heightPx,
          margin: '0 auto',
          position: 'relative',
          width: geometry?.width ?? PAGE.widthPx,
        }}
      >
        {geometry?.placements.map((p) => (
          <div
            data-page-number={p.index + 1}
            data-testid="pagination-page"
            key={p.index}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 12px rgba(15,23,42,0.12)',
              height: p.height,
              left: p.left,
              position: 'absolute',
              top: p.top,
              width: p.width,
            }}
          >
            <div
              style={{
                bottom: MARGINS.bottomPx / 3,
                color: '#9ca3af',
                fontSize: 12,
                left: 0,
                position: 'absolute',
                right: 0,
                textAlign: 'center',
              }}
            >
              {p.index + 1}
            </div>
          </div>
        ))}

        <div
          data-testid="pagination-clone-overlay"
          ref={overlayRef}
          style={{
            inset: 0,
            pointerEvents: 'none',
            position: 'absolute',
          }}
        />

        <div
          style={{
            left: MARGINS.leftPx,
            position: 'absolute',
            top: MARGINS.topPx,
            width: CONTENT_W,
          }}
        >
          <Plate
            editor={editor}
            onValueChange={() => requestAnimationFrame(recompute)}
          >
            <PlateContent style={{ outline: 'none' }} />
          </Plate>
        </div>
      </div>
    </div>
  );
}
