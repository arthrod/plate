// ============================================================
// pagination/reflowEngine.ts
// ============================================================
import {
  ElementApi,
  type Path,
  type SlateEditor,
  type TElement,
  type TText,
  TextApi,
} from 'platejs';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import {
  BasePaginationPlugin,
  withPaginationMutations,
} from './BasePaginationPlugin';
import type { ReflowContext } from './types';

// Wrap transforms to avoid polluting undo history
function withoutSaving(editor: SlateEditor, fn: () => void) {
  if (HistoryEditor.isHistoryEditor(editor)) {
    HistoryEditor.withoutSaving(editor, fn);
  } else {
    fn();
  }
}

function parseRowGap(el: HTMLElement): number {
  const gap = getComputedStyle(el).rowGap;
  return Number.parseFloat(gap) || 0;
}

export type ReflowResult = {
  changed: boolean;
  nextPageToContinue: number | null;
};

export function reflowPageBoundary(
  editor: SlateEditor,
  pageIndex: number,
  context: ReflowContext
): ReflowResult {
  const { pageDom, nextPageDom, opts } = context;
  const pagePath: Path = [pageIndex];
  const nextPagePath: Path = [pageIndex + 1];

  const contentEl = pageDom.content;
  const maxHeight = contentEl.clientHeight;
  const currentHeight = contentEl.scrollHeight;

  const isOverflowing = currentHeight > maxHeight + opts.overflowThresholdPx;

  // ─────────────────────────────────────────────────────────
  // OVERFLOW: Push content to next page
  // ─────────────────────────────────────────────────────────
  if (isOverflowing) {
    const splitIndex = findOverflowSplitIndex(contentEl, maxHeight);

    if (splitIndex === null) {
      return { changed: false, nextPageToContinue: null };
    }

    const pageEntry = editor.api.node<TElement>(pagePath);
    if (!pageEntry) return { changed: false, nextPageToContinue: null };
    const [pageNode] = pageEntry;
    const childCount = pageNode.children.length;

    // Guard: Single oversized element
    if (splitIndex === 0 && childCount === 1) {
      if (opts.allowTextSplit) {
        const didSplit = splitOversizedBlock(
          editor,
          pagePath,
          contentEl,
          maxHeight
        );
        if (didSplit) {
          return { changed: true, nextPageToContinue: pageIndex };
        }
      }
      // Can't split — skip to prevent infinite loop
      return { changed: false, nextPageToContinue: null };
    }

    // Ensure next page exists
    if (!editor.api.hasPath(nextPagePath)) {
      const pageType = editor.getType(BasePaginationPlugin.key);
      const defaultBlockType = editor.getOption(
        BasePaginationPlugin,
        'defaultBlockType'
      );
      withoutSaving(editor, () => {
        editor.tf.withoutNormalizing(() => {
          editor.tf.insertNodes(
            {
              type: pageType,
              children: [{ type: defaultBlockType, children: [{ text: '' }] }],
            },
            { at: nextPagePath }
          );
        });
      });
    }

    // Move overflow content (reverse iteration, prepend to next page)
    const nodesToMove = childCount - splitIndex;

    withoutSaving(editor, () => {
      editor.tf.withoutNormalizing(() => {
        for (let i = nodesToMove - 1; i >= 0; i--) {
          const sourceIndex = splitIndex + i;
          editor.tf.moveNodes({
            at: pagePath.concat([sourceIndex]),
            to: nextPagePath.concat([0]),
          });
        }
      });
    });

    return { changed: true, nextPageToContinue: pageIndex + 1 };
  }

  // ─────────────────────────────────────────────────────────
  // UNDERFLOW: Pull content from next page
  // ─────────────────────────────────────────────────────────
  if (!opts.underflow) {
    return { changed: false, nextPageToContinue: null };
  }

  if (!editor.api.hasPath(nextPagePath)) {
    // Handle empty trailing page (content was cleared)
    const pageEntry = editor.api.node<TElement>(pagePath);
    if (pageEntry && pageEntry[0].children.length === 0) {
      const totalPages = editor.children.length;
      if (totalPages <= 1) {
        // Insert a default block into the empty last page instead of removing it
        const defaultBlockType = editor.getOption(
          BasePaginationPlugin,
          'defaultBlockType'
        );
        withoutSaving(editor, () => {
          editor.tf.withoutNormalizing(() => {
            editor.tf.insertNodes(
              { type: defaultBlockType, children: [{ text: '' }] },
              { at: pagePath.concat([0]) }
            );
          });
        });
        return { changed: true, nextPageToContinue: null };
      }
    }
    return { changed: false, nextPageToContinue: null };
  }

  const nextPageEntry = editor.api.node<TElement>(nextPagePath);
  if (!nextPageEntry) return { changed: false, nextPageToContinue: null };
  const [nextPageNode] = nextPageEntry;

  // Remove empty trailing pages
  if (nextPageNode.children.length === 0) {
    // Guard: don't remove the last remaining page
    const totalPages = editor.children.length;
    if (totalPages <= 1) {
      // Insert a default block into the empty last page instead
      const defaultBlockType = editor.getOption(
        BasePaginationPlugin,
        'defaultBlockType'
      );
      withoutSaving(editor, () => {
        editor.tf.withoutNormalizing(() => {
          editor.tf.insertNodes(
            { type: defaultBlockType, children: [{ text: '' }] },
            { at: nextPagePath.concat([0]) }
          );
        });
      });
      return { changed: true, nextPageToContinue: null };
    }
    withoutSaving(editor, () => {
      editor.tf.withoutNormalizing(() => {
        editor.tf.removeNodes({ at: nextPagePath });
      });
    });
    return { changed: true, nextPageToContinue: null };
  }

  const availableSpace = maxHeight - currentHeight;

  // Hysteresis: Only pull if we have significant buffer
  if (availableSpace <= opts.underflowThresholdPx) {
    return { changed: false, nextPageToContinue: null };
  }

  // Measure first child of next page
  if (!nextPageDom) {
    return { changed: false, nextPageToContinue: null };
  }

  const firstChildEl = nextPageDom.content.children[0] as
    | HTMLElement
    | undefined;
  if (!firstChildEl) {
    return { changed: false, nextPageToContinue: null };
  }

  const gap = parseRowGap(contentEl);
  const candidateCost =
    firstChildEl.offsetHeight + (contentEl.children.length > 0 ? gap : 0);

  // Only pull if it fits with buffer
  if (candidateCost > availableSpace - 20) {
    return { changed: false, nextPageToContinue: null };
  }

  const pageEntry = editor.api.node<TElement>(pagePath);
  if (!pageEntry) return { changed: false, nextPageToContinue: null };
  const targetIndex = pageEntry[0].children.length;

  withoutSaving(editor, () => {
    editor.tf.withoutNormalizing(() => {
      editor.tf.moveNodes({
        at: nextPagePath.concat([0]),
        to: pagePath.concat([targetIndex]),
      });
    });
  });

  // Re-check this page — might be able to pull more
  return { changed: true, nextPageToContinue: pageIndex };
}

function findOverflowSplitIndex(
  contentEl: HTMLDivElement,
  maxHeight: number
): number | null {
  const children = Array.from(contentEl.children) as HTMLElement[];

  // Binary search for first overflowing child
  let left = 0;
  let right = children.length - 1;
  let result: number | null = null;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const child = children[mid];
    const bottom = child.offsetTop + child.offsetHeight;

    if (bottom > maxHeight) {
      result = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return result;
}

function splitOversizedBlock(
  editor: SlateEditor,
  pagePath: Path,
  contentEl: HTMLDivElement,
  maxHeight: number
): boolean {
  // Check if editor has React DOM bindings
  if (!('hasEditableTarget' in editor)) return false;

  const blockPath = pagePath.concat([0]);

  try {
    const fullText = editor.api.string(blockPath);
    if (!fullText || fullText.length < 2) return false;

    const start = editor.api.start(blockPath);
    if (!start) return false;

    const containerRect = contentEl.getBoundingClientRect();
    const maxBottom = containerRect.top + maxHeight - 1;

    // Build a mapping from char offset to Slate point
    const pointAtOffset = (offset: number) => {
      let remaining = offset;

      for (const [textNode, textPath] of editor.api.nodes<TText>({
        at: blockPath,
        match: (n) => TextApi.isText(n),
      })) {
        const text = textNode.text;
        if (remaining <= text.length) {
          return { path: textPath, offset: remaining };
        }
        remaining -= text.length;
      }

      const end = editor.api.end(blockPath);
      return end ?? { path: blockPath, offset: 0 };
    };

    // Binary search for split point
    let lo = 1;
    let hi = fullText.length - 1;
    let best = 0;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const point = pointAtOffset(mid);
      const range = { anchor: start, focus: point };

      let domRange: globalThis.Range;
      try {
        const toDOMRange = ReactEditor.toDOMRange;
        if (!toDOMRange) {
          // Fallback: proportional estimate based on text length
          const ratio = maxHeight / contentEl.scrollHeight;
          const estimatedSplit = Math.floor(fullText.length * ratio);
          if (estimatedSplit > 0 && estimatedSplit < fullText.length) {
            // Find nearest word boundary
            const before = fullText.lastIndexOf(' ', estimatedSplit);
            const after = fullText.indexOf(' ', estimatedSplit);
            const nearest =
              before > 0 &&
              after > 0 &&
              estimatedSplit - before < after - estimatedSplit
                ? before + 1
                : after > 0
                  ? after
                  : estimatedSplit;
            best = nearest;
            break;
          }
          return false;
        }
        domRange = toDOMRange(editor as unknown as ReactEditor, range);
      } catch {
        return false;
      }

      const rect = domRange.getBoundingClientRect();

      if (rect.bottom <= maxBottom) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    if (best <= 0) return false;

    const splitPoint = pointAtOffset(best);
    const nextPagePath: Path = [pagePath[0] + 1];
    const pageType = editor.getType(BasePaginationPlugin.key);
    const defaultBlockType = editor.getOption(
      BasePaginationPlugin,
      'defaultBlockType'
    );

    withoutSaving(editor, () => {
      withPaginationMutations(editor, () => {
        editor.tf.withoutNormalizing(() => {
          // Ensure next page exists
          if (!editor.api.hasPath(nextPagePath)) {
            editor.tf.insertNodes(
              {
                type: pageType,
                children: [
                  { type: defaultBlockType, children: [{ text: '' }] },
                ],
              },
              { at: nextPagePath }
            );
          }

          // Split the block at the calculated point
          editor.tf.splitNodes({
            at: splitPoint,
            match: (n) => ElementApi.isElement(n) && editor.api.isBlock(n),
          });

          // Move the second half to next page
          editor.tf.moveNodes({
            at: pagePath.concat([1]),
            to: nextPagePath.concat([0]),
          });
        });
      });
    });

    return true;
  } catch (e) {
    console.error('Text split failed:', e);
    return false;
  }
}
