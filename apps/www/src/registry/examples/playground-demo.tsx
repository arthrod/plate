'use client';

import * as React from 'react';
import { File, Smartphone } from 'lucide-react';

import {
  PaginationCoordinator,
  PaginationPlugin,
  PaginationRegistryProvider,
} from '@platejs/pagination';
import { PlaywrightPlugin } from '@platejs/playwright';
import { KEYS, NormalizeTypesPlugin, TrailingBlockPlugin } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';

import { useLocale } from '@/hooks/useLocale';
import { getI18nValues } from '@/i18n/getI18nValues';
import { EditorKit } from '@/registry/components/editor/editor-kit';
import { CopilotKit } from '@/registry/components/editor/plugins/copilot-kit';
import { ExcalidrawKit } from '@/registry/components/editor/plugins/excalidraw-kit';
import { Editor, EditorContainer } from '@/registry/ui/editor';

export default function PlaygroundDemo({
  id,
  className,
}: {
  id?: string;
  className?: string;
}) {
  const locale = useLocale();
  const value = getI18nValues(locale).playground;
  const [viewMode, setViewMode] = React.useState<'paginated' | 'continuous'>(
    'paginated'
  );
  const isPaginated = viewMode === 'paginated';
  const paginationEditorKit = React.useMemo(
    () =>
      EditorKit.map((plugin) =>
        plugin.key === TrailingBlockPlugin.key
          ? TrailingBlockPlugin.configure({
              options: {
                level: 1,
              },
            })
          : plugin
      ),
    []
  );

  const editor = usePlateEditor(
    {
      override: {
        enabled: {
          [KEYS.copilot]: id === 'copilot',
          [KEYS.indent]: id !== 'listClassic',
          [KEYS.list]: id !== 'listClassic',
          [KEYS.listClassic]: id === 'listClassic',
          [KEYS.playwright]: process.env.NODE_ENV !== 'production',
        },
      },
      plugins: [
        ...CopilotKit,
        ...paginationEditorKit,
        ...ExcalidrawKit,

        NormalizeTypesPlugin.configure({
          enabled: id === 'forced-layout',
          options: {
            rules: [{ path: [0], strictType: 'h1' }],
          },
        }),

        // Pagination plugin with view mode
        PaginationPlugin.configure({
          options: {
            viewMode,
          },
        }),

        // Testing
        PlaywrightPlugin,
      ],
      value,
    },
    []
  );

  React.useEffect(() => {
    editor.setOption(PaginationPlugin, 'viewMode', viewMode);
  }, [editor, viewMode]);

  return (
    <PaginationRegistryProvider>
      <Plate editor={editor}>
        <PaginationCoordinator />
        <div className="flex h-full flex-col">
          {/* Toolbar with view mode toggle */}
          <div className="flex items-center justify-between border-border border-b bg-background px-4 py-2">
            <div className="font-medium text-muted-foreground text-sm">
              Editor Playground
            </div>
            <div className="flex shrink-0 items-center rounded-lg bg-muted p-0.5">
              <ViewToggle
                active={viewMode === 'continuous'}
                onClick={() => setViewMode('continuous')}
                icon={<Smartphone size={14} />}
                label="Continuous"
              />
              <ViewToggle
                active={viewMode === 'paginated'}
                onClick={() => setViewMode('paginated')}
                icon={<File size={14} />}
                label="Paginated"
              />
            </div>
          </div>
          <EditorContainer className={className}>
            <Editor
              variant="demo"
              className={
                isPaginated
                  ? 'px-0 pt-0 pb-0 sm:px-0'
                  : 'pb-[20vh]'
              }
              placeholder="Type something..."
              spellCheck={false}
            />
          </EditorContainer>
        </div>
      </Plate>
    </PaginationRegistryProvider>
  );
}

// View toggle component
function ViewToggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-medium text-xs transition-all ${
        active
          ? 'border border-border bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
