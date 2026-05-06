import {
  type Descendant,
  type PluginConfig,
  type TElement,
  createTSlatePlugin,
} from 'platejs';

import type {
  BasePaginationOptions,
  Page,
  PageMargins,
  PageSize,
} from './types';

import { BaseFooterPlugin } from './base-footer-plugin';
import { BaseHeaderPlugin } from './base-header-plugin';
import { BasePageBreakPlugin } from './base-page-break-plugin';
import {
  FOOTER_KEY,
  HEADER_KEY,
  PAGE_BREAK_KEY,
  PAGINATION_KEY,
} from './internal/keys';
import { getEditorPages } from './internal/page-state';

export type BasePaginationApi = {
  pagination: {
    getFootnotes: (pageIndex: number) => TElement[];
    getPageOf: (path: number[]) => number;
    getPages: () => Page[];
    /** Whether a top-level `header` block currently exists in the doc. */
    hasHeader: () => boolean;
    /** Whether a top-level `footer` block currently exists in the doc. */
    hasFooter: () => boolean;
  };
};

export type BasePaginationTransforms = {
  pagination: {
    insertPageBreak: () => void;
    /** Replace the in-flow `<w:pgMar>`-style margins. */
    setMargins: (margins: PageMargins) => void;
    /** Replace the resolved page size (preset key or `{width,height}`). */
    setPageSize: (size: PageSize) => void;
    setFooter: (content: Descendant[]) => void;
    setHeader: (content: Descendant[]) => void;
    /** Toggle the document-level footer block; returns new presence. */
    toggleFooter: () => boolean;
    /** Toggle the document-level header block; returns new presence. */
    toggleHeader: () => boolean;
    /** Toggle the side preview panel; returns new visibility. */
    togglePreview: () => boolean;
  };
};

export type BasePaginationConfig = PluginConfig<
  typeof PAGINATION_KEY,
  BasePaginationOptions,
  BasePaginationApi,
  BasePaginationTransforms
>;

/**
 * Base orchestrator plugin for paginated layout.
 *
 * Variant A — render-time overlay; pages derived; pretext as height oracle.
 * The Slate document is unchanged; pagination is a render-only projection
 * layered onto the live editor via the Plate `render.afterEditable` slot.
 *
 * Header/footer presence is derived from `editor.children` (single source of
 * truth) — undo and paste survive correctly because we don't mirror the
 * presence to a plugin option that lives outside Slate history.
 *
 * The page-chrome element family (header, footer, page break) is composed
 * here on the Slate base so a Slate-only consumer registering
 * `BasePaginationPlugin` already gets the element schema. React-only deltas
 * (footnote sub-plugins, overlay rendering) live in `src/react`.
 */
export const BasePaginationPlugin = createTSlatePlugin<BasePaginationConfig>({
  key: PAGINATION_KEY,
  options: {
    footerHeight: 48,
    footnoteWell: 0,
    headerHeight: 48,
    includeFootnoteSubPlugins: true,
    margins: {
      bottom: 72,
      left: 72,
      right: 72,
      top: 72,
    },
    pageSize: 'A4',
    previewVisible: true,
  },
  plugins: [BaseHeaderPlugin, BaseFooterPlugin, BasePageBreakPlugin],
})
  .overrideEditor(({ editor, tf: { normalizeNode } }) => ({
    transforms: {
      normalizeNode: (entry) => {
        const [, path] = entry;

        // Only check header/footer invariants at the root level.
        // IMPORTANT: fixOneHeaderFooterInvariant makes AT MOST one Slate
        // transform per call and returns `true` when it does. We must
        // `return` immediately after so Slate can re-enter normalizeNode
        // until the document is stable. Making more than one transform in a
        // single normalizeNode call causes the infinite-loop "126 iterations"
        // error because Slate keeps seeing an un-normalized state.
        if (path.length === 0) {
          if (fixOneHeaderFooterInvariant(editor as EditorLike)) return;
        }

        return normalizeNode(entry);
      },
    },
  }))
  .extendEditorApi<BasePaginationApi>(({ editor }) => ({
    pagination: {
      getFootnotes: (pageIndex) => {
        const pages = getEditorPages(editor);

        return pages[pageIndex]?.footnotes ?? [];
      },
      getPageOf: (path) => {
        if (path.length === 0) return -1;

        const top = (editor.children as TElement[])[path[0]];

        if (!top) return -1;

        const pages = getEditorPages(editor);

        for (let i = 0; i < pages.length; i++) {
          if (pages[i].nodes.includes(top)) return i;
        }

        return -1;
      },
      getPages: () => getEditorPages(editor),
      hasFooter: () =>
        (editor.children as TElement[]).some((n) => n.type === FOOTER_KEY),
      hasHeader: () =>
        (editor.children as TElement[]).some((n) => n.type === HEADER_KEY),
    },
  }))
  .extendEditorTransforms<BasePaginationTransforms>(
    ({ editor, getOptions, setOption }) => ({
      pagination: {
        insertPageBreak: () => {
          editor.tf.insertNodes({
            children: [{ text: '' }],
            type: PAGE_BREAK_KEY,
          } as TElement);
        },
        setFooter: (content) => {
          replaceFooter(editor as EditorLike, content);
        },
        setHeader: (content) => {
          replaceHeader(editor as EditorLike, content);
        },
        setMargins: (margins) => {
          setOption('margins', margins);
        },
        setPageSize: (size) => {
          setOption('pageSize', size);
        },
        toggleFooter: () => {
          const ed = editor as EditorLike;
          const present = ed.children.some((n) => n.type === FOOTER_KEY);

          if (present) removeByType(ed, FOOTER_KEY);
          else ensureFooter(ed);

          return !present;
        },
        toggleHeader: () => {
          const ed = editor as EditorLike;
          const present = ed.children.some((n) => n.type === HEADER_KEY);

          if (present) removeByType(ed, HEADER_KEY);
          else ensureHeader(ed);

          return !present;
        },
        togglePreview: () => {
          const next = !(getOptions().previewVisible ?? true);

          setOption('previewVisible', next);

          return next;
        },
      },
    })
  );

type EditorLike = {
  children: TElement[];
  tf: {
    insertNodes: (n: TElement, opts?: { at?: number[] }) => void;
    moveNodes: (opts: { at: number[]; to: number[] }) => void;
    removeNodes: (opts: { at: number[] }) => void;
  };
};

const replaceHeader = (editor: EditorLike, content: Descendant[]): void => {
  const idx = editor.children.findIndex((n) => n.type === HEADER_KEY);

  if (idx >= 0) editor.tf.removeNodes({ at: [idx] });

  editor.tf.insertNodes(
    {
      children: content as TElement['children'],
      type: HEADER_KEY,
    } as TElement,
    { at: [0] }
  );
};

const replaceFooter = (editor: EditorLike, content: Descendant[]): void => {
  const idx = editor.children.findIndex((n) => n.type === FOOTER_KEY);

  if (idx >= 0) editor.tf.removeNodes({ at: [idx] });

  editor.tf.insertNodes(
    {
      children: content as TElement['children'],
      type: FOOTER_KEY,
    } as TElement,
    { at: [editor.children.length] }
  );
};

const ensureHeader = (editor: EditorLike): void => {
  if (editor.children.some((n) => n.type === HEADER_KEY)) return;

  editor.tf.insertNodes(
    {
      children: [{ text: 'Header' }],
      type: HEADER_KEY,
    } as TElement,
    { at: [0] }
  );
};

const ensureFooter = (editor: EditorLike): void => {
  if (editor.children.some((n) => n.type === FOOTER_KEY)) return;

  editor.tf.insertNodes(
    {
      children: [{ text: 'Footer' }],
      type: FOOTER_KEY,
    } as TElement,
    { at: [editor.children.length] }
  );
};

const removeByType = (editor: EditorLike, type: string): void => {
  // Remove all matching siblings (in case of duplicate normalization).
  for (let i = editor.children.length - 1; i >= 0; i--) {
    if (editor.children[i].type === type) {
      editor.tf.removeNodes({ at: [i] });
    }
  }
};

/**
 * Fix exactly ONE header/footer invariant per call and return `true` when
 * a fix was applied. Slate's normalizeNode contract requires that at most
 * one transform is made per invocation; the caller must return immediately
 * after this returns `true` so Slate re-enters normalizeNode.
 *
 * Invariants enforced (in priority order so the first violated one wins):
 *   1. At most one header — remove the last duplicate.
 *   2. At most one footer — remove the first duplicate.
 *   3. Header must be at index 0 — move it.
 *   4. Footer must be at the last index — move it.
 */
const fixOneHeaderFooterInvariant = (editor: EditorLike): boolean => {
  // Collect current indices fresh on every call (children may have changed).
  const headerIdxs: number[] = [];
  const footerIdxs: number[] = [];

  editor.children.forEach((n, i) => {
    if (n.type === HEADER_KEY) headerIdxs.push(i);
    else if (n.type === FOOTER_KEY) footerIdxs.push(i);
  });

  // 1. Remove a duplicate header (keep the first, remove last duplicate).
  if (headerIdxs.length > 1) {
    editor.tf.removeNodes({ at: [headerIdxs[headerIdxs.length - 1]] });

    return true;
  }

  // 2. Remove a duplicate footer (keep the last, remove first duplicate).
  if (footerIdxs.length > 1) {
    editor.tf.removeNodes({ at: [footerIdxs[0]] });

    return true;
  }

  // 3. Header not at index 0 — move it (indices are now stable: at most one
  //    header and one footer remain).
  if (headerIdxs[0] !== undefined && headerIdxs[0] !== 0) {
    editor.tf.moveNodes({ at: [headerIdxs[0]], to: [0] });

    return true;
  }

  // 4. Footer not at the last index — recompute target after potential moves.
  const target = editor.children.length - 1;
  const footerIdx = footerIdxs[0];

  if (footerIdx !== undefined && footerIdx !== target) {
    editor.tf.moveNodes({ at: [footerIdx], to: [target] });

    return true;
  }

  return false;
};
