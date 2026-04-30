import {
  type SlateEditor,
  type TTagElement,
  type TTagProps,
  KEYS,
} from 'platejs';

/**
 * Compares two sets of tags/labels for equality, ignoring order
 *
 * @param currentTags Current set of tags in the editor
 * @param newTags New set of tags to compare against
 * @returns Boolean indicating if the sets contain the same values
 */
export function isEqualTags<T extends TTagProps>(
  editor: SlateEditor,
  newTags?: T[]
): boolean {
  const current = new Set<string>();

  for (const [node] of editor.api.nodes<TTagElement>({
    at: [],
    match: { type: KEYS.tag },
  })) {
    current.add(node.value);
  }

  const next = new Set<string>();

  if (newTags) {
    for (const tag of newTags) {
      next.add(tag.value);
    }
  }

  if (current.size !== next.size) return false;

  for (const key of current) {
    if (!next.has(key)) return false;
  }

  return true;
}
