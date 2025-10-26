'use client';

import * as React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { MoreHorizontalIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
import { TableToolbarButton } from './table-toolbar-button';
import { ToggleToolbarButton } from './toggle-toolbar-button';
import { ToolbarButton, ToolbarGroup, ToolbarMenuGroup } from './toolbar';
import { TurnIntoToolbarButton } from './turn-into-toolbar-button';

import {
  BaselineIcon,
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  KeyboardIcon,
  PaintBucketIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
  WandSparklesIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';

export function MoreToolbarButton(props: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="More options" isDropdown>
          <MoreHorizontalIcon />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="ignore-click-outside/toolbar flex max-h-[500px] min-w-[250px] flex-col gap-1 overflow-y-auto p-2"
        align="end"
      >
        {/* History Group */}
        <ToolbarMenuGroup label="History">
          <ToolbarGroup className="gap-1">
            <UndoToolbarButton />
            <RedoToolbarButton />
          </ToolbarGroup>
        </ToolbarMenuGroup>

        {/* AI & Tools Group */}
        <ToolbarMenuGroup label="AI & Tools">
          <ToolbarGroup className="gap-1">
            <AIToolbarButton tooltip="AI commands">
              <WandSparklesIcon />
            </AIToolbarButton>
            <ImportToolbarButton />
            <ExportToolbarButton />
          </ToolbarGroup>
        </ToolbarMenuGroup>

        {/* Block Types Group */}
        <ToolbarMenuGroup label="Block Type">
          <ToolbarGroup className="gap-1">
            <TurnIntoToolbarButton />
          </ToolbarGroup>
        </ToolbarMenuGroup>

        {/* Text Formatting Group */}
        <ToolbarMenuGroup label="Text Formatting">
          <ToolbarGroup className="gap-1 flex-wrap">
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
            <MarkToolbarButton nodeType={KEYS.kbd} tooltip="Keyboard (⌘+⇧+K)">
              <KeyboardIcon />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType={KEYS.sup} tooltip="Superscript">
              <SuperscriptIcon />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType={KEYS.sub} tooltip="Subscript">
              <SubscriptIcon />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType={KEYS.highlight} tooltip="Highlight">
              <HighlighterIcon />
            </MarkToolbarButton>
          </ToolbarGroup>
        </ToolbarMenuGroup>

        {/* Styling Group */}
        <ToolbarMenuGroup label="Styling">
          <ToolbarGroup className="gap-1">
            <FontSizeToolbarButton />
            <FontColorToolbarButton nodeType={KEYS.color} tooltip="Text color">
              <BaselineIcon />
            </FontColorToolbarButton>
            <FontColorToolbarButton
              nodeType={KEYS.backgroundColor}
              tooltip="Background color"
            >
              <PaintBucketIcon />
            </FontColorToolbarButton>
            <LineHeightToolbarButton />
          </ToolbarGroup>
        </ToolbarMenuGroup>

        {/* Alignment Group */}
        <ToolbarMenuGroup label="Alignment">
          <ToolbarGroup className="gap-1">
            <AlignToolbarButton />
          </ToolbarGroup>
        </ToolbarMenuGroup>

        {/* Lists Group */}
        <ToolbarMenuGroup label="Lists">
          <ToolbarGroup className="gap-1">
            <NumberedListToolbarButton />
            <BulletedListToolbarButton />
            <TodoListToolbarButton />
            <ToggleToolbarButton />
          </ToolbarGroup>
        </ToolbarMenuGroup>

        {/* Indentation Group */}
        <ToolbarMenuGroup label="Indentation">
          <ToolbarGroup className="gap-1">
            <OutdentToolbarButton />
            <IndentToolbarButton />
          </ToolbarGroup>
        </ToolbarMenuGroup>

        {/* Insert Group */}
        <ToolbarMenuGroup label="Insert">
          <ToolbarGroup className="gap-1">
            <InsertToolbarButton />
            <LinkToolbarButton />
            <TableToolbarButton />
            <EmojiToolbarButton />
          </ToolbarGroup>
        </ToolbarMenuGroup>

        {/* Media Group */}
        <ToolbarMenuGroup label="Media">
          <ToolbarGroup className="gap-1">
            <MediaToolbarButton nodeType={KEYS.img} />
            <MediaToolbarButton nodeType={KEYS.video} />
            <MediaToolbarButton nodeType={KEYS.audio} />
            <MediaToolbarButton nodeType={KEYS.file} />
          </ToolbarGroup>
        </ToolbarMenuGroup>

        {/* Comments Group */}
        <ToolbarMenuGroup label="Collaboration">
          <ToolbarGroup className="gap-1">
            <CommentToolbarButton />
          </ToolbarGroup>
        </ToolbarMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
