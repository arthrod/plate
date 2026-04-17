import type { SlateEditor } from 'platejs';

import { BaseSuggestionPlugin } from '../BaseSuggestionPlugin';
import { getSuggestionKey } from './getSuggestionKeys';
import { getSuggestionNodeEntries } from './getSuggestionNodeEntries';

export type TSuggestionCommonDescription = {
  suggestionId: string;
  userId: string;
};

export type TSuggestionDeletionDescription = {
  deletedText: string;
  type: 'deletion';
} & TSuggestionCommonDescription;

export type TSuggestionDescription =
  | TSuggestionDeletionDescription
  | TSuggestionInsertionDescription
  | TSuggestionReplacementDescription;

// TODO: Move to ../types
export type TSuggestionInsertionDescription = {
  insertedText: string;
  type: 'insertion';
} & TSuggestionCommonDescription;

export type TSuggestionReplacementDescription = {
  deletedText: string;
  insertedText: string;
  type: 'replacement';
} & TSuggestionCommonDescription;

/**
 * Get the suggestion descriptions of the selected node. A node can have
 * multiple suggestions (multiple users). Each description maps to a user
 * suggestion.
 */
export const getActiveSuggestionDescriptions = (
  editor: SlateEditor
): TSuggestionDescription[] => {
  const aboveEntry = editor.getApi(BaseSuggestionPlugin).suggestion.node({
    isText: true,
  });

  if (!aboveEntry) return [];

  const aboveNode = aboveEntry[0];
  const suggestionId = editor
    .getApi(BaseSuggestionPlugin)
    .suggestion.nodeId(aboveNode);

  if (!suggestionId) return [];

  const suggestionDataList = editor
    .getApi(BaseSuggestionPlugin)
    .suggestion.dataList(aboveNode as any);

  return suggestionDataList.map(({ id: activeSuggestionId, userId }) => {
    const suggestionKey = getSuggestionKey(activeSuggestionId);
    let insertedText = '';
    let deletedText = '';
    let hasInsertions = false;
    let hasDeletions = false;

    for (const [node] of getSuggestionNodeEntries(editor, activeSuggestionId)) {
      const type = (node as any)[suggestionKey]?.type;
      if (type === 'insert') {
        insertedText += node.text;
        hasInsertions = true;
      } else if (type === 'remove') {
        deletedText += node.text;
        hasDeletions = true;
      }
    }

    if (hasInsertions && hasDeletions) {
      return {
        deletedText,
        insertedText,
        suggestionId: activeSuggestionId,
        type: 'replacement',
        userId,
      };
    }
    if (hasDeletions) {
      return {
        deletedText,
        suggestionId: activeSuggestionId,
        type: 'deletion',
        userId,
      };
    }

    return {
      insertedText,
      suggestionId: activeSuggestionId,
      type: 'insertion',
      userId,
    };
  });
};
