'use client';

import { insertFootnote } from '@platejs/footnote';
import {
  DEFAULT_PAGE_SETUP,
  getPageSetup,
  PAGE_SETUP_KEY,
  type PageSetupConfig,
  setPageSetup,
} from '@platejs/pagination';
import { PageSetupPlugin, PaginationPlugin } from '@platejs/pagination/react';
import type { Value } from 'platejs';
import { Plate, PlateContent, usePlateEditor } from 'platejs/react';
import * as React from 'react';
import { MarginsMode } from '@/components/editor/margins-mode';
import { PageSetupDialog } from '@/components/editor/page-setup-dialog';
import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit';
import { FootnoteKit } from '@/components/editor/plugins/footnote-kit';
import { PrintPreview } from '@/components/editor/print-preview';
import { PrintStyles } from '@/components/editor/print-styles';
import { Button } from '@/components/ui/button';

// Seed the document with a leading page_setup node so the engine and the desk
// agree on geometry from the first render (US Letter + 1in by default).
function makeValue(): Value {
  const out: Value = [
    {
      children: [{ text: '' }],
      config: DEFAULT_PAGE_SETUP,
      type: PAGE_SETUP_KEY,
    },
  ] as unknown as Value;

  for (let i = 0; i < 40; i++) {
    if (i % 8 === 0) {
      out.push({ children: [{ text: `Section ${i / 8 + 1}` }], type: 'h2' });
    } else {
      out.push({
        children: [
          {
            text: `Paragraph ${i}. This is a reasonably long paragraph of placeholder text so that the content reliably wraps onto multiple lines and flows across several pages, exercising the pagination plugin end to end.`,
          },
        ],
        type: 'p',
      });
    }
  }

  return out;
}

/**
 * Continuous-view demo: a single page-width editable in normal flow. The
 * pagination plugin paints dotted advisory break-lines at each boundary; the
 * Page-setup dialog edits geometry stored on the document's page_setup node, and
 * the white "desk" resizes to match so DOM measurement tracks the page width.
 */
export function PaginationView() {
  const editor = usePlateEditor({
    plugins: [
      ...BasicNodesKit,
      ...FootnoteKit,
      PageSetupPlugin,
      PaginationPlugin.configure({ options: { breakLineStyle: 'dotted' } }),
    ],
    value: makeValue(),
  });

  const [open, setOpen] = React.useState(false);
  const [marginsMode, setMarginsMode] = React.useState(false);
  const [printing, setPrinting] = React.useState(false);
  const [setup, setSetup] = React.useState<PageSetupConfig>(
    () => getPageSetup(editor) ?? DEFAULT_PAGE_SETUP
  );

  const applySetup = (patch: Partial<PageSetupConfig>) => {
    setSetup((prev) => ({ ...prev, ...patch }));
    setPageSetup(editor, patch);
  };

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
      <PrintStyles setup={setup} />
      <div
        data-print-hide=""
        style={{
          display: 'flex',
          gap: 8,
          margin: '0 auto 16px',
          maxWidth: setup.page.widthPx,
        }}
      >
        <Button
          data-testid="open-page-setup"
          onClick={() => setOpen(true)}
          type="button"
        >
          Page setup
        </Button>
        <Button
          data-margins-ui=""
          data-testid="margins-toggle"
          onClick={() => setMarginsMode((m) => !m)}
          type="button"
          variant={marginsMode ? 'default' : 'secondary'}
        >
          {marginsMode ? 'Done editing margins' : 'Edit margins'}
        </Button>
        {setup.footnotes !== 'off' && (
          <Button
            data-testid="insert-footnote"
            onClick={() => {
              editor.tf.focus();
              insertFootnote(editor);
            }}
            type="button"
            variant="secondary"
          >
            Insert footnote
          </Button>
        )}
      </div>

      <div
        data-testid="pagination-stack"
        style={{
          background: '#fff',
          boxShadow: '0 2px 12px rgba(15,23,42,0.12)',
          margin: '0 auto',
          paddingBottom: setup.margins.bottomPx,
          paddingLeft: setup.margins.leftPx,
          paddingRight: setup.margins.rightPx,
          paddingTop: setup.margins.topPx,
          position: 'relative',
          width: setup.page.widthPx,
        }}
      >
        <Plate editor={editor}>
          <PlateContent style={{ outline: 'none' }} />
        </Plate>

        {marginsMode && (
          <MarginsMode
            onChange={applySetup}
            onExit={() => setMarginsMode(false)}
            value={setup}
          />
        )}
      </div>

      <PageSetupDialog
        onChange={applySetup}
        onOpenChange={setOpen}
        onPrint={() => {
          setOpen(false);
          setPrinting(true);
        }}
        open={open}
        value={setup}
      />

      {printing && (
        <PrintPreview
          editor={editor}
          onClose={() => setPrinting(false)}
          setup={setup}
        />
      )}
    </div>
  );
}
