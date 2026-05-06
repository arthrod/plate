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
        const tf = (
          editor.tf as unknown as {
            pagination?: { insertPageBreak?: () => void };
          }
        ).pagination;

        if (tf?.insertPageBreak) {
          tf.insertPageBreak();
          toast('Inserted page break.');
        } else {
          toast('Pagination plugin not loaded.');
        }
      }}
      tooltip="Insert page break"
    >
      <LayoutTemplateIcon />
    </ToolbarButton>
  );
}
