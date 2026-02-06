/** biome-ignore-all lint/suspicious/noConsole: <We are debugging the import process TODO remove> */
'use client';

import * as React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { getCommentKey } from '@platejs/comment';
import {
  convertToHtmlWithTracking,
  importDocxWithTracking,
  parseDocxComments,
  parseDocxTrackedChanges,
} from '@platejs/docx-io';
import { MarkdownPlugin } from '@platejs/markdown';
import { BaseSuggestionPlugin, getSuggestionKey } from '@platejs/suggestion';
import { ArrowUpToLineIcon } from 'lucide-react';
import { KEYS, TextApi, type TNode } from 'platejs';
import { useEditorRef } from 'platejs/react';
import { getEditorDOMFromHtmlString } from 'platejs/static';
import { useFilePicker } from 'use-file-picker';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { commentPlugin } from '@/registry/components/editor/plugins/comment-kit';
import {
  discussionPlugin,
  type TDiscussion,
} from '@/registry/components/editor/plugins/discussion-kit';
import { suggestionPlugin } from '@/registry/components/editor/plugins/suggestion-kit';
import { getDiscussionCounterSeed } from '../lib/discussion-ids';
import { ToolbarButton } from './toolbar';

type ImportType = 'html' | 'markdown';

// Regex pattern for splitting author names into initials (top-level for performance)
const WHITESPACE_REGEX = /\s+/;

export function ImportToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const getFileNodes = (text: string, type: ImportType) => {
    if (type === 'html') {
      const editorNode = getEditorDOMFromHtmlString(text);
      const nodes = editor.api.html.deserialize({
        element: editorNode,
      });

      return nodes;
    }

    if (type === 'markdown') {
      return editor.getApi(MarkdownPlugin).markdown.deserialize(text);
    }

    return [];
  };

  const { openFilePicker: openMdFilePicker } = useFilePicker({
    accept: ['.md', '.mdx'],
    multiple: false,
    onFilesSelected: async ({ plainFiles }) => {
      const text = await plainFiles[0].text();

      const nodes = getFileNodes(text, 'markdown');

      editor.tf.insertNodes(nodes);
    },
  });

  const { openFilePicker: openHtmlFilePicker } = useFilePicker({
    accept: ['text/html'],
    multiple: false,
    onFilesSelected: async ({ plainFiles }) => {
      const text = await plainFiles[0].text();

      const nodes = getFileNodes(text, 'html');

      editor.tf.insertNodes(nodes);
    },
  });

  const { openFilePicker: openDocxFilePicker } = useFilePicker({
    accept: ['.docx'],
    multiple: false,
    onFilesSelected: async ({ plainFiles }) => {
      const arrayBuffer = await plainFiles[0].arrayBuffer();

      // Compute next discussion number to avoid ID collisions
      const existingDiscussions =
        editor.getOption(discussionPlugin, 'discussions') ?? [];
      let discussionCounter = getDiscussionCounterSeed(existingDiscussions);

      // =========================================================================
      // DEBUG STEP 1: Get raw HTML from DOCX (mammoth output)
      // =========================================================================
      console.group('[DOCX DEBUG] === IMPORT FLOW START ===');

      // First, manually get the raw HTML to log it separately
      const rawHtmlResult = await convertToHtmlWithTracking(arrayBuffer);
      console.log('[DOCX DEBUG] (1) RAW MAMMOTH HTML OUTPUT:');
      console.log(rawHtmlResult.value);
      console.log('[DOCX DEBUG] Mammoth messages:', rawHtmlResult.messages);

      // =========================================================================
      // DEBUG STEP 2: Parse tracked changes and comments from HTML
      // =========================================================================
      const trackedChanges = parseDocxTrackedChanges(rawHtmlResult.value);
      const parsedComments = parseDocxComments(rawHtmlResult.value);
      console.log('[DOCX DEBUG] (2) PARSED TRACKED CHANGES:', trackedChanges);
      console.log('[DOCX DEBUG] (2) PARSED COMMENTS:', parsedComments);

      // =========================================================================
      // DEBUG STEP 3: Preview what HTML would become in Plate (before full import)
      // =========================================================================
      const previewParser = new DOMParser();
      const previewDoc = previewParser.parseFromString(
        rawHtmlResult.value,
        'text/html'
      );
      const previewNodes = editor.api.html.deserialize({
        element: previewDoc.body,
      });
      console.log(
        '[DOCX DEBUG] (3) HTML → PLATE CONVERSION (preview, before tracking applied):',
        JSON.stringify(previewNodes, null, 2)
      );

      // =========================================================================
      // DEBUG STEP 4: Run full import with tracking
      // =========================================================================
      const result = await importDocxWithTracking(editor as any, arrayBuffer, {
        suggestionKey: KEYS.suggestion,
        getSuggestionKey,
        commentKey: KEYS.comment,
        getCommentKey,
        isText: TextApi.isText,
        generateId: () => `discussion${++discussionCounter}`,
      });

      console.log(
        '[DOCX DEBUG] (4) IMPORT RESULT (from importDocxWithTracking):'
      );
      console.log(JSON.stringify(result, null, 2));

      console.log(
        '[DOCX DEBUG] (5) PLATE CONVERSION RESULT (editor.children after import):',
        JSON.stringify(editor.children, null, 2)
      );

      // =========================================================================
      // DEBUG: Iterate over all nodes to find suggestion marks
      // =========================================================================
      console.group('[DOCX DEBUG] Suggestion Nodes in Editor:');
      for (const [node, path] of editor.api.nodes({
        at: [],
        mode: 'all',
      })) {
        const nodeRecord = node as TNode & { suggestion?: boolean };
        if (nodeRecord.suggestion) {
          console.log(
            '[DIAG] suggestion node:',
            JSON.stringify(node),
            'path:',
            path
          );
          const dataList = editor
            .getApi(BaseSuggestionPlugin)
            .suggestion.dataList(nodeRecord as any);
          console.log('[DIAG] dataList:', dataList);
        }
      }
      console.groupEnd();

      // =========================================================================
      // DEBUG: Log result summary
      // =========================================================================
      console.log('[DOCX DIAG] Result summary:', {
        insertions: result.insertions,
        deletions: result.deletions,
        comments: result.comments,
        discussionCount: result.discussions.length,
        errors: result.errors,
        hasTracking: result.hasTracking,
      });

      // =========================================================================
      // DEBUG: Inspect annotated nodes after a delay
      // =========================================================================
      setTimeout(() => {
        console.group(
          '[DOCX DEBUG] Annotated Text Nodes (delayed inspection):'
        );
        const allText = Array.from(
          editor.api.nodes({ at: [], mode: 'all', match: TextApi.isText })
        ) as [TNode & { text?: string; [key: string]: unknown }, number[]][];
        for (const [node, path] of allText) {
          const textNode = node as TNode & {
            text?: string;
            [key: string]: unknown;
          };
          const hasSuggestion = textNode[KEYS.suggestion];
          const hasComment = textNode[KEYS.comment];
          if (hasSuggestion || hasComment) {
            console.log('[DOCX DIAG] annotated node:', {
              text: textNode.text?.slice(0, 50),
              path,
              hasSuggestion,
              hasComment,
              keys: Object.keys(textNode).filter((k) => k !== 'text'),
            });
          }
        }
        console.groupEnd();

        // =========================================================================
        // DEBUG STEP 6: Log complete plugin state for suggestions/discussions/comments
        // =========================================================================
        console.group('[DOCX DEBUG] (6) COMPLETE PLUGIN STATE AFTER IMPORT:');

        // Suggestions plugin state
        const suggestionActiveId = editor.getOption(
          suggestionPlugin,
          'activeId'
        );
        const suggestionHoverId = editor.getOption(suggestionPlugin, 'hoverId');
        const suggestionUniquePathMap = editor.getOption(
          suggestionPlugin,
          'uniquePathMap'
        );
        console.log('[DOCX DEBUG] SUGGESTIONS PLUGIN STATE:', {
          activeId: suggestionActiveId,
          hoverId: suggestionHoverId,
          uniquePathMap: suggestionUniquePathMap
            ? Object.fromEntries(suggestionUniquePathMap)
            : null,
        });

        // Discussions plugin state
        const allDiscussions =
          editor.getOption(discussionPlugin, 'discussions') ?? [];
        const allUsers = editor.getOption(discussionPlugin, 'users') ?? {};
        const currentUserId = editor.getOption(
          discussionPlugin,
          'currentUserId'
        );
        console.log('[DOCX DEBUG] DISCUSSIONS PLUGIN STATE:', {
          currentUserId,
          users: allUsers,
          discussionCount: allDiscussions.length,
        });
        console.log(
          '[DOCX DEBUG] ALL DISCUSSIONS (full objects):',
          JSON.stringify(allDiscussions, null, 2)
        );

        // Comments plugin state
        const commentUniquePathMap = editor.getOption(
          commentPlugin,
          'uniquePathMap'
        );
        console.log('[DOCX DEBUG] COMMENTS PLUGIN STATE:', {
          uniquePathMap: commentUniquePathMap
            ? Object.fromEntries(commentUniquePathMap)
            : null,
        });

        console.groupEnd();
      }, 100);

      // =========================================================================
        // Add imported discussions to the discussion plugin
        // =========================================================================
        // Convert imported discussions to TDiscussion format
        const newDiscussions: TDiscussion[] = result.discussions.map((d) => ({
          id: d.id,
          comments: (d.comments ?? []).map((c, index) => ({
            id: `comment${index + 1}`,
            contentRich:
              c.contentRich as TDiscussion['comments'][number]['contentRich'],
            createdAt: c.createdAt ?? new Date(),
            discussionId: d.id,
            isEdited: false,
            userId: c.userId ?? c.user?.id ?? 'imported-unknown',
            authorName: c.user?.name,
            authorInitials: c.user?.name
              ? c.user.name
                  .split(WHITESPACE_REGEX)
                  .slice(0, 2)
                  .map((w) => w[0]?.toUpperCase() ?? '')
                  .join('')
              : undefined,
          })),
          createdAt: d.createdAt ?? new Date(),
          documentContent: d.documentContent,
          isResolved: false,
          userId: d.userId ?? d.user?.id ?? 'imported-unknown',
          authorName: d.user?.name,
          authorInitials: d.user?.name
            ? d.user.name
                .split(WHITESPACE_REGEX)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase() ?? '')
                .join('')
            : undefined,
        }));

        console.log(
          '[DOCX DEBUG] New discussions to add:',
          JSON.stringify(newDiscussions, null, 2)
        );

        editor.setOption(discussionPlugin, 'discussions', [
          ...existingDiscussions,
          ...newDiscussions,
        ]);
        editor.setOption(commentPlugin, 'uniquePathMap', new Map());
      }

      // Log import results
      if (result.hasTracking) {
        console.log(
          `[DOCX Import] Imported ${result.insertions} insertions, ${result.deletions} deletions, ${result.comments} comments`
        );
        if (result.errors.length > 0) {
          console.warn('[DOCX Import] Errors:', result.errors);
        }
      }

      console.groupEnd();
    },
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Import" isDropdown>
          <ArrowUpToLineIcon className="size-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={() => {
              openHtmlFilePicker();
            }}
          >
            Import from HTML
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              openMdFilePicker();
            }}
          >
            Import from Markdown
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              openDocxFilePicker();
            }}
          >
            Import from Word
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
