// ============================================================
// pagination/reflowEngine.ts
// ============================================================
import { Editor, Element, Node, Transforms, type Path } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import {
  BasePaginationPlugin,
  withPaginationMutations,
} from './BasePaginationPlugin';
import type { PageDom, ReflowOptions } from './types';

// Wrap transforms to avoid polluting undo history
function withoutSaving(editor: any, fn: () => void) {
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
  editor: Editor,
  pageIndex: number,
  pageDom: PageDom,
  nextPageDom: PageDom | undefined,
  opts: ReflowOptions
): ReflowResult {
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

    const pageNode = Node.get(editor, pagePath) as Element;
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
    if (!Node.has(editor, nextPagePath)) {
      const pageType =
        (editor as any).getType?.(BasePaginationPlugin.key) ?? 'page';
      const defaultBlockType =
        (editor as any).getOption?.(BasePaginationPlugin, 'defaultBlockType') ??
        'p';
      withoutSaving(editor, () => {
        Editor.withoutNormalizing(editor, () => {
          Transforms.insertNodes(
            editor,
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
      Editor.withoutNormalizing(editor, () => {
        for (let i = nodesToMove - 1; i >= 0; i--) {
          const sourceIndex = splitIndex + i;
          Transforms.moveNodes(editor, {
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

  if (!Node.has(editor, nextPagePath)) {
    return { changed: false, nextPageToContinue: null };
  }

  const nextPageNode = Node.get(editor, nextPagePath) as Element;

  // Remove empty trailing pages
  if (nextPageNode.children.length === 0) {
    withoutSaving(editor, () => {
      Editor.withoutNormalizing(editor, () => {
        Transforms.removeNodes(editor, { at: nextPagePath });
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

  const pageNode = Node.get(editor, pagePath) as Element;
  const targetIndex = pageNode.children.length;

  withoutSaving(editor, () => {
    Editor.withoutNormalizing(editor, () => {
      Transforms.moveNodes(editor, {
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
  editor: Editor,
  pagePath: Path,
  contentEl: HTMLDivElement,
  maxHeight: number
): boolean {
  if (!ReactEditor.isReactEditor(editor)) return false;

  const blockPath = pagePath.concat([0]);

  try {
    const fullText = Editor.string(editor, blockPath);
    if (!fullText || fullText.length < 2) return false;

    const start = Editor.start(editor, blockPath);
    const containerRect = contentEl.getBoundingClientRect();
    const maxBottom = containerRect.top + maxHeight - 1;

    // Build a mapping from char offset to Slate point
    const pointAtOffset = (offset: number) => {
      let remaining = offset;

      for (const [textNode, textPath] of Editor.nodes(editor, {
        at: blockPath,
        match: (n) => typeof (n as any).text === 'string',
      })) {
        const text = (textNode as any).text as string;
        if (remaining <= text.length) {
          return { path: textPath, offset: remaining };
        }
        remaining -= text.length;
      }

      return Editor.end(editor, blockPath);
    };

    // Binary search for split point
    let lo = 1;
    let hi = fullText.length - 1;
    let best = 0;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const point = pointAtOffset(mid);
      const range = { anchor: start, focus: point };

      let domRange: Range;
      try {
        domRange = ReactEditor.toDOMRange(editor, range);
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
    const pageType =
      (editor as any).getType?.(BasePaginationPlugin.key) ?? 'page';
    const defaultBlockType =
      (editor as any).getOption?.(BasePaginationPlugin, 'defaultBlockType') ??
      'p';

    withoutSaving(editor, () => {
      withPaginationMutations(editor as any, () => {
        Editor.withoutNormalizing(editor, () => {
          // Ensure next page exists
            Transforms.insertNodes(
              editor,
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
          Transforms.splitNodes(editor, {
            at: splitPoint,
            match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
          });

          // Move the second half to next page
          Transforms.moveNodes(editor, {
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
