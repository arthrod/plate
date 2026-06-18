import castArray from 'lodash/castArray.js';

import { ElementApi, type Editor, type TLocation } from '../interfaces';
import type { QueryNodeOptions } from './queryNode';

/** Query the editor state. */
export interface QueryEditorOptions<E extends Editor = Editor>
  extends Pick<QueryNodeOptions, 'allow' | 'exclude'> {
  /** Location from where to lookup the node types (bottom-up) */
  at?: TLocation;

  /** Query the editor. */
  filter?: (editor: E) => boolean;

  /** When the selection is at the end of the block above. */
  selectionAtBlockEnd?: boolean;

  /** When the selection is at the start of the block above. */
  selectionAtBlockStart?: boolean;
}

/** Query the editor state. */
export const queryEditor = <E extends Editor>(
  editor: E,
  {
    allow,
    at = editor.selection || [],
    exclude,
    filter,
    selectionAtBlockEnd,
    selectionAtBlockStart,
  }: QueryEditorOptions<E> = {}
) => {
  if (
    (filter && !filter(editor)) ||
    (selectionAtBlockStart && !editor.api.isAt({ start: true })) ||
    (selectionAtBlockEnd && !editor.api.isAt({ end: true }))
  ) {
    return false;
  }

  const allows = allow == null ? [] : castArray(allow);
  const excludes = exclude == null ? [] : castArray(exclude);

  let hasAllowed = allows.length === 0;

  for (const [node] of editor.api.levels({ at, reverse: true })) {
    if (ElementApi.isElement(node)) {
      if (excludes.length > 0 && excludes.includes(node.type)) {
        return false;
      }
      if (!hasAllowed && allows.includes(node.type)) {
        hasAllowed = true;
      }
    }

    if (hasAllowed && excludes.length === 0) {
      break;
    }
  }

  return hasAllowed;
};
