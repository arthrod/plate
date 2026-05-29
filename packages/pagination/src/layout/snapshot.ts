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
  // Gemini PR #442 review (medium): accept any non-nullish `id`, not only
  // strings. Plate/Slate consumers commonly use numeric or auto-incrementing
  // ids; rejecting them forces every numerically-ided block to fall back to
  // content hashing — the (id, width) measure cache thrashes on edits even
  // though the consumer ALREADY has a stable identity for the block.
  if (node.id != null && String(node.id).length > 0) return String(node.id);

  return `${node.type ?? 'node'}#${hash(nodeText(node))}`;
}

/**
 * Build an `UnmeasuredSnapshot` from a Slate value — the first stage of the
 * pretext pagination pipeline. Pure: no DOM, no editor instance, deterministic
 * for a given (value, options).
 *
 * Each top-level node becomes one `UnmeasuredBlock` carrying:
 *  - `id`: the consumer's `node.id` (coerced to string, accepts numeric ids),
 *    or a content-derived fallback `${type}#${hash(text)}` if none is
 *    supplied. Fallback ids that collide between siblings are disambiguated
 *    by appending `@${positionalIndex}` (CodeRabbit PR #438) — but
 *    consumer-supplied ids are NEVER rewritten even if duplicated, since
 *    explicit ids are the consumer's stability contract (CodeRabbit PR #442).
 *  - `path`: `[positionalIndex]` of the block in `value`.
 *  - `text`: concatenated text of all leaf descendants (for the pretext line
 *    breaker).
 *  - `type`: the block type (or `'unknown'`).
 *  - `keepWithNext` / `breakBefore` flags from `options` + per-node hints.
 *  - `splittable: false` when the type is in `options.atomicTypes`.
 *
 * @param value      the Slate top-level value (one entry per block)
 * @param options    type sets controlling atomic + keep-with-next behavior
 * @returns          `{ blocks }` ready for the measurement pass
 */
export function buildSnapshot(
  value: SlateNode[],
  options: SnapshotOptions
): UnmeasuredSnapshot {
  const atomic = new Set(options.atomicTypes ?? []);
  const keepWithNext = new Set(options.keepWithNextTypes ?? []);

  // CodeRabbit PR #438 + PR #442:
  // - Fallback stableIds (`${type}#${hash(text)}`) can collide for sibling
  //   blocks with identical type AND text (e.g. two empty paragraphs). A
  //   duplicate id corrupts the (id, width) measure cache and confuses
  //   fragment grouping downstream. Disambiguate fallback collisions by
  //   appending the positional index.
  // - Explicit consumer-supplied ids are the consumer's stability contract;
  //   they are NEVER rewritten even when duplicated. We DO register them in
  //   `seenIds` so a later fallback id doesn't accidentally collide with an
  //   explicit one (e.g. an explicit `"p#abc"` poisoning a fallback's
  //   namespace).
  const seenIds = new Set<string>();
  const dedupeFallback = (raw: string, index: number): string => {
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
    const rawId = stableId(node);
    const hasExplicitId =
      node.id != null && String(node.id).length > 0;
    // Explicit ids: pass through verbatim, still register so fallbacks
    // can't collide later. Fallback ids: dedupe on collision.
    const id = hasExplicitId
      ? (seenIds.add(rawId), rawId)
      : dedupeFallback(rawId, index);
    const block: UnmeasuredBlock = {
      id,
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
