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

export type BasePaginationApi = {
  pagination: {
    getFootnotes: (pageIndex: number) => TElement[];
    getPageOf: (path: number[]) => number;
    getPages: () => Page[];
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
    /** Toggle the document-level footer block; returns new visibility. */
    toggleFooter: () => boolean;
    /** Toggle the document-level header block; returns new visibility. */
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
 * The page-chrome element family (header, footer, page break) is composed
 * here on the Slate base so a Slate-only consumer registering
 * `BasePaginationPlugin` already gets the element schema. React-only deltas
 * (footnote sub-plugins, overlay rendering) live in `src/react`.
 *
 * The API/transforms surface bridges to the per-editor `WeakMap` populated
 * by `usePageLayout` on the React side; in a pure-Slate environment the API
 * resolves to `[]`/`-1` until a measurer-equipped consumer wires pages in.
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
    headerVisible: false,
    footerVisible: false,
  },
  plugins: [BaseHeaderPlugin, BaseFooterPlugin, BasePageBreakPlugin],
})
  .extendEditorApi<BasePaginationApi>(({ editor }) => ({
    pagination: {
      getFootnotes: (pageIndex) => {
        const pages = readPages(editor);

        return pages[pageIndex]?.footnotes ?? [];
      },
      getPageOf: (path) => {
        if (path.length === 0) return -1;

        const top = (editor.children as TElement[])[path[0]];

        if (!top) return -1;

        const pages = readPages(editor);

        for (let i = 0; i < pages.length; i++) {
          if (pages[i].nodes.includes(top)) return i;
        }

        return -1;
      },
      getPages: () => readPages(editor),
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
          replaceFooter(editor, content);
        },
        setHeader: (content) => {
          replaceHeader(editor, content);
        },
        setMargins: (margins) => {
          setOption('margins', margins);
        },
        setPageSize: (size) => {
          setOption('pageSize', size);
        },
        toggleFooter: () => {
          const next = !(getOptions().footerVisible ?? false);

          if (next) ensureFooter(editor);
          else removeByType(editor, FOOTER_KEY);
          setOption('footerVisible', next);

          return next;
        },
        toggleHeader: () => {
          const next = !(getOptions().headerVisible ?? false);

          if (next) ensureHeader(editor);
          else removeByType(editor, HEADER_KEY);
          setOption('headerVisible', next);

          return next;
        },
        togglePreview: () => {
          const next = !(getOptions().previewVisible ?? true);

          setOption('previewVisible', next);

          return next;
        },
      },
    })
  );

const readPages = (editor: object): Page[] => {
  const slot = (editor as { __pagination_pages__?: Page[] })
    .__pagination_pages__;

  return Array.isArray(slot) ? slot : [];
};

type EditorLike = {
  children: TElement[];
  tf: {
    insertNodes: (n: TElement, opts?: { at?: number[] }) => void;
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
