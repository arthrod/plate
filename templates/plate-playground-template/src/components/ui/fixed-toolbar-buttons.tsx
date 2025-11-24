'use client';

import * as React from 'react';

import {
  ArrowUpToLineIcon,
  BaselineIcon,
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  PaintBucketIcon,
  StrikethroughIcon,
  UnderlineIcon,
  WandSparklesIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';

import { AIToolbarButton } from './ai-toolbar-button';
import { AlignToolbarButton } from './align-toolbar-button';
import { CommentToolbarButton } from './comment-toolbar-button';
import { EmojiToolbarButton } from './emoji-toolbar-button';
import { ExportToolbarButton } from './export-toolbar-button';
import { FontColorToolbarButton } from './font-color-toolbar-button';
import { FontSizeToolbarButton } from './font-size-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import { ImportToolbarButton } from './import-toolbar-button';
import {
  IndentToolbarButton,
  OutdentToolbarButton,
} from './indent-toolbar-button';
import { InsertToolbarButton } from './insert-toolbar-button';
import { LineHeightToolbarButton } from './line-height-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
  TodoListToolbarButton,
} from './list-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { MediaToolbarButton } from './media-toolbar-button';
import { ModeToolbarButton } from './mode-toolbar-button';
import { MoreToolbarButton } from './more-toolbar-button';
import { TableToolbarButton } from './table-toolbar-button';
import { ToggleToolbarButton } from './toggle-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { TurnIntoToolbarButton } from './turn-into-toolbar-button';

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <div className="flex w-full">
      {!readOnly && (
        <>
          {/* Desktop: ALL groups visible (1024px+) */}
          <ToolbarGroup className="max-lg:hidden">
            <UndoToolbarButton />
            <RedoToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup className="max-lg:hidden">
            <AIToolbarButton tooltip="AI commands">
              <WandSparklesIcon />
            </AIToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup className="max-lg:hidden">
            <ExportToolbarButton>
              <ArrowUpToLineIcon />
            </ExportToolbarButton>
            <ImportToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup className="max-lg:hidden">
            <InsertToolbarButton />
            <TurnIntoToolbarButton />
            <FontSizeToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup className="max-lg:hidden">
            <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
              <BoldIcon />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
              <ItalicIcon />
            </MarkToolbarButton>
            <MarkToolbarButton
              nodeType={KEYS.underline}
              tooltip="Underline (⌘+U)"
            >
              <UnderlineIcon />
            </MarkToolbarButton>
            <MarkToolbarButton
              nodeType={KEYS.strikethrough}
              tooltip="Strikethrough (⌘+⇧+M)"
            >
              <StrikethroughIcon />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType={KEYS.code} tooltip="Code (⌘+E)">
              <Code2Icon />
            </MarkToolbarButton>
            <FontColorToolbarButton nodeType={KEYS.color} tooltip="Text color">
              <BaselineIcon />
            </FontColorToolbarButton>
            <FontColorToolbarButton
              nodeType={KEYS.backgroundColor}
              tooltip="Background color"
            >
              <PaintBucketIcon />
            </FontColorToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup className="max-lg:hidden">
            <AlignToolbarButton />
            <NumberedListToolbarButton />
            <BulletedListToolbarButton />
            <TodoListToolbarButton />
            <ToggleToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup className="max-lg:hidden">
            <LinkToolbarButton />
            <TableToolbarButton />
            <EmojiToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup className="max-lg:hidden">
            <MediaToolbarButton nodeType={KEYS.img} />
            <MediaToolbarButton nodeType={KEYS.video} />
            <MediaToolbarButton nodeType={KEYS.audio} />
            <MediaToolbarButton nodeType={KEYS.file} />
          </ToolbarGroup>

          <ToolbarGroup className="max-lg:hidden">
            <LineHeightToolbarButton />
            <OutdentToolbarButton />
            <IndentToolbarButton />
          </ToolbarGroup>

          {/* Tablet: Reduced groups (768px+) */}
          <ToolbarGroup className="max-md:hidden lg:hidden">
            <UndoToolbarButton />
            <RedoToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup className="max-md:hidden lg:hidden">
            <AIToolbarButton tooltip="AI commands">
              <WandSparklesIcon />
            </AIToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup className="max-md:hidden lg:hidden">
            <TurnIntoToolbarButton />
            <FontSizeToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup className="max-md:hidden lg:hidden">
            <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
              <BoldIcon />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
              <ItalicIcon />
            </MarkToolbarButton>
            <MarkToolbarButton
              nodeType={KEYS.strikethrough}
              tooltip="Strikethrough (⌘+⇧+M)"
            >
              <StrikethroughIcon />
            </MarkToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup className="max-md:hidden lg:hidden">
            <FontColorToolbarButton nodeType={KEYS.color} tooltip="Text color">
              <BaselineIcon />
            </FontColorToolbarButton>
            <FontColorToolbarButton
              nodeType={KEYS.backgroundColor}
              tooltip="Background color"
            >
              <PaintBucketIcon />
            </FontColorToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup className="max-md:hidden lg:hidden">
            <NumberedListToolbarButton />
            <BulletedListToolbarButton />
            <TodoListToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup className="max-md:hidden lg:hidden">
            <LinkToolbarButton />
            <InsertToolbarButton />
            <TableToolbarButton />
          </ToolbarGroup>

          {/* Mobile: Minimal groups (640px+) */}
          <ToolbarGroup className="md:hidden">
            <UndoToolbarButton />
            <RedoToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup className="md:hidden">
            <AIToolbarButton tooltip="AI commands">
              <WandSparklesIcon />
            </AIToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup className="md:hidden">
            <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
              <BoldIcon />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
              <ItalicIcon />
            </MarkToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup className="md:hidden">
            <NumberedListToolbarButton />
            <BulletedListToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup className="md:hidden">
            <LinkToolbarButton />
          </ToolbarGroup>
        </>
      )}

      <div className="grow" />

      {/* Always Visible - Right Side */}
      {!readOnly && (
        <ToolbarGroup>
          <MarkToolbarButton nodeType={KEYS.highlight} tooltip="Highlight">
            <HighlighterIcon />
          </MarkToolbarButton>
          <CommentToolbarButton />
        </ToolbarGroup>
      )}

      <ToolbarGroup>
        <ModeToolbarButton />
      </ToolbarGroup>

      {!readOnly && (
        <ToolbarGroup>
          <MoreToolbarButton />
        </ToolbarGroup>
      )}
    </div>
  );
}
