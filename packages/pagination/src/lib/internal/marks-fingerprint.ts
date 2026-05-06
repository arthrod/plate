import type { TElement } from 'platejs';

/**
 * Stable, JSON-shape-independent fingerprint of the marks/styles attached to a
 * block's leaves. Used as part of the measure-cache key so a node with the
 * same text but different bold/italic runs gets remeasured.
 */
export const marksFingerprint = (node: TElement): string => {
  const sorted: string[] = [];
  walkLeaves(node, (leaf) => {
    const keys = Object.keys(leaf)
      .filter((k) => k !== 'text')
      .sort();

    if (keys.length === 0) return;

    const segment = keys
      .map((k) => `${k}=${formatMark((leaf as Record<string, unknown>)[k])}`)
      .join(',');

    sorted.push(segment);
  });

  return sorted.join('|');
};

const formatMark = (value: unknown): string => {
  if (value === true) return '1';
  if (value === false) return '0';
  if (value == null) return '';
  if (typeof value === 'object') return JSON.stringify(value);

  return String(value);
};

const walkLeaves = (
  node: { children?: unknown[]; text?: string },
  visit: (leaf: { text: string }) => void
): void => {
  if (typeof node.text === 'string') {
    visit(node as { text: string });

    return;
  }
  if (!Array.isArray(node.children)) return;
  for (const child of node.children) {
    walkLeaves(child as { children?: unknown[]; text?: string }, visit);
  }
};
