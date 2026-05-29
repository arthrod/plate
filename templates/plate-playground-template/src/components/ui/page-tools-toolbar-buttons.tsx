'use client';

import { RulerIcon, Settings2Icon } from 'lucide-react';
import { useEditorRef, usePluginOption } from 'platejs/react';

import { PageToolsPlugin } from '@/components/editor/plugins/page-tools-kit';

import { ToolbarButton } from './toolbar';

export function PageSetupToolbarButton() {
  const editor = useEditorRef();

  return (
    <ToolbarButton
      data-testid="main-page-setup"
      onClick={() => editor.setOption(PageToolsPlugin, 'pageSetupOpen', true)}
      tooltip="Page setup"
    >
      <Settings2Icon />
    </ToolbarButton>
  );
}

export function MarginsToolbarButton() {
  const editor = useEditorRef();
  const active = usePluginOption(PageToolsPlugin, 'marginsMode');

  return (
    <ToolbarButton
      data-testid="main-margins"
      onClick={() => editor.setOption(PageToolsPlugin, 'marginsMode', !active)}
      pressed={active}
      tooltip="Edit margins"
    >
      <RulerIcon />
    </ToolbarButton>
  );
}
