'use client';

import { LayoutTemplateIcon } from 'lucide-react';
import { useEditorRef } from 'platejs/react';
import { toast } from 'sonner';

import { ToolbarButton } from './toolbar';

export function PaginationToolbarButton() {
  const editor = useEditorRef();

  return (
    <ToolbarButton
      data-plate-prevent-overlay
      onClick={() => {
        const tf = editor.tf as unknown as {
          insertNodes: (n: unknown) => void;
          pagination?: { insertPageBreak?: () => void };
        };

        if (tf.pagination?.insertPageBreak) {
          tf.pagination.insertPageBreak();
        } else {
          tf.insertNodes({
            children: [{ text: '' }],
            type: 'pageBreak',
          });
        }
        toast('Inserted page break.');
      }}
      tooltip="Insert page break"
    >
      <LayoutTemplateIcon />
    </ToolbarButton>
  );
}
