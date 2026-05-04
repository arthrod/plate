'use client';

import { LayoutTemplateIcon } from 'lucide-react';
import { toast } from 'sonner';

import { triggerPaginationStub } from '@/components/editor/plugins/pagination-kit';

import { ToolbarButton } from './toolbar';

export function PaginationToolbarButton() {
  return (
    <ToolbarButton
      data-plate-prevent-overlay
      onClick={() => {
        triggerPaginationStub();
        toast('Pagination preview — wire after #357/#358 merges.');
      }}
      tooltip="Pagination (preview)"
    >
      <LayoutTemplateIcon />
    </ToolbarButton>
  );
}
