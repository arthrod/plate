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
          pagination?: { togglePreview?: () => boolean };
        };

        if (tf.pagination?.togglePreview) {
          const visible = tf.pagination.togglePreview();
          toast(visible ? 'Page preview shown' : 'Page preview hidden');

          return;
        }
        toast('Pagination plugin not available');
      }}
      tooltip="Toggle page preview"
    >
      <LayoutTemplateIcon />
    </ToolbarButton>
  );
}
