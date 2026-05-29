// ============================================================
// pagination/layout/snapshot.ts
//
// Build an UnmeasuredSnapshot (flat list of top-level blocks) from a Slate
// value. Pure: no DOM, no editor instance. The measurement pass later turns
// this into a MeasuredSnapshot for the composer.
// ============================================================

import type { UnmeasuredBlock, UnmeasuredSnapshot } from './types';

export type SnapshotOptions = {
  /** Block types that must not be split across pages (void/atomic). */
  atomicTypes?: string[];
  /** Block types kept on the same page as the following block (e.g. headings). */
  keepWithNextTypes?: string[];
};

type SlateNode = {
  type?: string;
  id?: unknown;
  text?: string;
  children?: SlateNode[];
  keepWithNext?: unknown;
  breakBefore?: unknown;
};

/** Concatenate all text leaves under a node, depth-first. */
function nodeText(node: SlateNode): string {
  if (typeof node.text === 'string') return node.text;
  if (!node.children) return '';

  let out = '';
  for (const child of node.children) out += nodeText(child);

  return out;
}

/** Small deterministic string hash (djb2) for content-based ids. */
function hash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = (h * 33) ^ input.charCodeAt(i);

  return (h >>> 0).toString(36);
}

function stableId(node: SlateNode): string {
  if (typeof node.id === 'string' && node.id.length > 0) return node.id;

  return `${node.type ?? 'node'}#${hash(nodeText(node))}`;
}

export function buildSnapshot(
  value: SlateNode[],
  options: SnapshotOptions
): UnmeasuredSnapshot {
  const atomic = new Set(options.atomicTypes ?? []);
  const keepWithNext = new Set(options.keepWithNextTypes ?? []);

  // CodeRabbit PR #438: fallback stableIds (`${type}#${hash(text)}`) can
  // collide for sibling blocks with identical type AND text (e.g. two empty
  // paragraphs). A duplicate id corrupts the (id, width) measure cache (two
  // blocks share one cached height) and confuses fragment grouping
  // downstream. Disambiguate any fallback id we've already emitted by
  // appending the positional index; real author-supplied ids stay untouched
  // since the original raw value is what we register in `seenIds`.
  const seenIds = new Set<string>();
  const uniqueId = (raw: string, index: number): string => {
    if (!seenIds.has(raw)) {
      seenIds.add(raw);
      return raw;
    }
    let candidate = `${raw}@${index}`;
    while (seenIds.has(candidate)) candidate += '_';
    seenIds.add(candidate);
    return candidate;
  };

  const blocks: UnmeasuredBlock[] = value.map((node, index) => {
    const type = node.type ?? 'unknown';
    const block: UnmeasuredBlock = {
      id: uniqueId(stableId(node), index),
      path: [index],
      text: nodeText(node),
      type,
    };

    if (keepWithNext.has(type) || node.keepWithNext === true) {
      block.keepWithNext = true;
    }
    if (node.breakBefore === true) block.breakBefore = true;
    if (atomic.has(type)) block.splittable = false;

    return block;
  });

  return { blocks };
}
