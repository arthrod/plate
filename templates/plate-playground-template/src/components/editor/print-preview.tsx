'use client';

import {
  getLayoutRegistry,
  PAGE_SETUP_KEY,
  type PageSetupConfig,
} from '@platejs/pagination';
import { resolvePageSetupChromeOptions } from '@platejs/pagination/react';
import { createSlateEditor, type SlateEditor, type Value } from 'platejs';
import { PlateStatic } from 'platejs/static';
import * as React from 'react';

import { BaseEditorKit } from '@/components/editor/editor-base-kit';
import { Button } from '@/components/ui/button';

/** Indices of the top-level blocks placed on a page, in document order. */
function pageBlockIndices(
  frames: { fragments: { path: number[] }[] }[]
): number[] {
  const set = new Set<number>();
  for (const frame of frames) {
    for (const fragment of frame.fragments) set.add(fragment.path[0]);
  }

  return [...set].sort((a, b) => a - b);
}

/**
 * View-only print view: a fully-rendered, read-only `PlateStatic` render of the
 * document, sliced into discrete page cards using the live pagination layout
 * (whole-block granularity). Each card carries the document's header/footer/
 * page-number chrome. This is the static document — not a browser print dialog.
 */
export function PrintPreview({
  editor,
  onClose,
  setup,
}: {
  editor: SlateEditor;
  onClose: () => void;
  setup: PageSetupConfig;
}) {
  const layout = getLayoutRegistry(editor).output;
  const children = editor.children as Value;
  const chrome = resolvePageSetupChromeOptions(setup);

  // Slice the value into per-page block ranges from the layout; fall back to the
  // whole document (minus the page_setup metadata node) when no layout exists.
  const slices: Value[] = layout?.pages.length
    ? layout.pages.map((p) =>
        pageBlockIndices(p.frames)
          .map((i) => children[i])
          .filter(Boolean)
      )
    : [children.filter((n) => (n as { type?: string }).type !== PAGE_SETUP_KEY)];

  const pageCount = slices.length;

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto bg-neutral-700/90"
      data-testid="print-preview"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between bg-neutral-900 px-4 py-2 text-sm text-white">
        <span>Print view — {pageCount} page(s) · view only</span>
        <Button onClick={onClose} size="sm" variant="secondary">
          Close
        </Button>
      </div>

      <div className="flex flex-col items-center gap-6 py-8">
        {slices.map((value, i) => {
          const staticEditor = createSlateEditor({
            plugins: BaseEditorKit,
            value,
          });
          const ctx = {
            margins: setup.margins,
            page: setup.page,
            pageCount,
            pageIndex: i,
          };

          return (
            <div
              className="relative bg-white text-black shadow-xl"
              data-testid="print-page"
              // biome-ignore lint/suspicious/noArrayIndexKey: page order is stable
              key={i}
              style={{
                minHeight: setup.page.heightPx,
                paddingBottom: setup.margins.bottomPx,
                paddingLeft: setup.margins.leftPx,
                paddingRight: setup.margins.rightPx,
                paddingTop: setup.margins.topPx,
                width: setup.page.widthPx,
              }}
            >
              {chrome?.header && (
                <div
                  className="absolute"
                  style={{
                    height: setup.margins.topPx,
                    left: setup.margins.leftPx,
                    right: setup.margins.rightPx,
                    top: 0,
                  }}
                >
                  {chrome.header.render(ctx) as React.ReactNode}
                </div>
              )}

              <PlateStatic editor={staticEditor} />

              {chrome?.footer && (
                <div
                  className="absolute"
                  style={{
                    bottom: 0,
                    height: setup.margins.bottomPx,
                    left: setup.margins.leftPx,
                    right: setup.margins.rightPx,
                  }}
                >
                  {chrome.footer.render(ctx) as React.ReactNode}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
