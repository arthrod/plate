'use client';

import { PaginationPlugin } from '@platejs/pagination/react';
import { SeparatorHorizontalIcon } from 'lucide-react';
import { useEditorRef, usePluginOption } from 'platejs/react';
import type * as React from 'react';

import { ToolbarButton } from './toolbar';

export function PaginationToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const editor = useEditorRef();
  const enabled = usePluginOption(PaginationPlugin, 'enabled');

  return (
    <ToolbarButton
      {...props}
      onClick={() => editor.setOption(PaginationPlugin, 'enabled', !enabled)}
      pressed={enabled}
      tooltip="Page breaks"
    >
      <SeparatorHorizontalIcon />
    </ToolbarButton>
  );
}
