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
  // Preserve any consumer-supplied onClick. Spreading `{...props}` first and
  // then setting `onClick` would silently drop the consumer's handler; compose
  // them instead. CodeRabbit #434.
  const { onClick: consumerOnClick, ...rest } = props;

  return (
    <ToolbarButton
      {...rest}
      onClick={(event) => {
        consumerOnClick?.(event);
        if (event.defaultPrevented) return;
        editor.setOption(PaginationPlugin, 'enabled', !enabled);
      }}
      pressed={enabled}
      tooltip="Page breaks"
    >
      <SeparatorHorizontalIcon />
    </ToolbarButton>
  );
}
