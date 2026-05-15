// ============================================================
// pagination/BasePaginationPlugin.ts
// ============================================================
import {
  createTSlatePlugin,
  ElementApi,
  KEYS,
  type NodeEntry,
  type Operation,
  type OverrideEditor,
  type PluginConfig,
  type SlateEditor,
} from 'platejs';
import {
  getPaginationRuntime as _getPaginationRuntime,
  isPaginationMutating,
  setPaginationRuntime,
  withPaginationMutations as _withPaginationMutations,
} from './internal/editorRegistry';
import { createPaginationRuntime, getPageIndexFromOp } from './internal/runtime';
import type {
  CollaborationOptions,
  DocumentSettings,
  ReflowOptions,
  ViewMode,
} from './types';

export {
  getPaginationRuntime,
  withPaginationMutations,
} from './internal/editorRegistry';

export type PaginationTransforms = {
  pagination: {
    togglePreview: () => boolean;
    setPageSize: (size: 'A4' | 'Letter' | 'Legal') => void;
    setMargins: (margins: DocumentSettings['margins']) => void;
    toggleHeader: () => boolean;
    toggleFooter: () => boolean;
  };
};

export type PaginationConfig = PluginConfig<
  'pagination',
  {
    documentSettings: DocumentSettings;
    reflow: ReflowOptions;
    collaboration: CollaborationOptions;
    defaultBlockType: string;
    viewMode: ViewMode;
  },
  {},
  PaginationTransforms
>;

const PAGE_SIZES: Record<string, { width: number; height: number }> = {
  A4: { width: 794, height: 1123 },
  Letter: { width: 816, height: 1056 },
  Legal: { width: 816, height: 1344 },
};

const DEFAULT_DOCUMENT_SETTINGS: DocumentSettings = {
  sizes: { width: 816, height: 1056 }, // US Letter at 96 DPI
  margins: { top: 96, right: 96, bottom: 96, left: 96 }, // 1 inch margins
};

const DEFAULT_REFLOW_OPTIONS: ReflowOptions = {
  enabled: true,
  debounceMs: 100,
  maxPagesPerIdle: 6,
  maxMovesPerPage: 50,
  underflow: true,
  allowTextSplit: true,
  overflowThresholdPx: 0,
  underflowThresholdPx: 80, // Hysteresis
};

const DEFAULT_COLLABORATION_OPTIONS: CollaborationOptions = {
  mode: 'all',
};

const withPagination: OverrideEditor<PaginationConfig> = ({
  editor,
  getOptions,
  type,
  tf: { apply, normalizeNode },
}) => {
  // Attach runtime to editor
  const runtime = createPaginationRuntime();
  setPaginationRuntime(editor, runtime);

  return {
    transforms: {
      apply(op: Operation) {
        apply(op);

        if (isPaginationMutating(editor)) return;

        const pageIndex = getPageIndexFromOp(op);
        if (pageIndex !== null && runtime) {
          runtime.markDirty(pageIndex);
        }
      },
      normalizeNode(entry: NodeEntry) {
        const [node, path] = entry;

        // Unwrap nested pages
        if (
          ElementApi.isElement(node) &&
          node.type === type &&
          path.length !== 1
        ) {
          editor.tf.unwrapNodes({ at: path });
          return;
        }

        // Wrap non-page root children
        if (path.length === 0 && normalizeRootChildren(editor, type)) return;

        normalizeNode(entry);
      },
      pagination: {
        togglePreview(): boolean {
          const current = getOptions().viewMode ?? 'paginated';
          const next = current === 'paginated' ? 'continuous' : 'paginated';
          editor.setOption(BasePaginationPlugin, 'viewMode', next);
          return next === 'continuous';
        },
        setPageSize(size: 'A4' | 'Letter' | 'Legal'): void {
          const preset = PAGE_SIZES[size];
          if (preset) {
            const currentSettings = getOptions().documentSettings;
            editor.setOptions(BasePaginationPlugin, {
              documentSettings: {
                ...currentSettings,
                sizes: { ...preset },
              },
            });
          }
        },
        setMargins(margins: DocumentSettings['margins']): void {
          const currentSettings = getOptions().documentSettings;
          editor.setOptions(BasePaginationPlugin, {
            documentSettings: {
              ...currentSettings,
              margins: { ...margins },
            },
          });
        },
        toggleHeader(): boolean {
          const children = editor.children;
          const hasHeaders = children.some(
            (page) =>
              ElementApi.isElement(page) &&
              ElementApi.isElement(page.children[0]) &&
              page.children[0].type === 'header'
          );

          _withPaginationMutations(editor, () => {
            editor.tf.withoutNormalizing(() => {
              children.forEach((_page, pageIndex) => {
                if (hasHeaders) {
                  editor.tf.removeNodes({
                    at: [pageIndex, 0],
                    match: (n) =>
                      ElementApi.isElement(n) && n.type === 'header',
                  });
                } else {
                  editor.tf.insertNodes(
                    {
                      type: 'header',
                      children: [
                        {
                          type: getOptions().defaultBlockType,
                          children: [{ text: '' }],
                        },
                      ],
                    },
                    { at: [pageIndex, 0] }
                  );
                }
              });
            });
          });

          // Mark all pages dirty to trigger reflow
          for (let i = 0; i < children.length; i++) {
            runtime.markDirty(i);
          }

          return !hasHeaders;
        },
        toggleFooter(): boolean {
          const children = editor.children;
          const hasFooters = children.some((page) => {
            if (!ElementApi.isElement(page)) return false;
            const last = page.children.at(-1);
            return ElementApi.isElement(last) && last.type === 'footer';
          });

          _withPaginationMutations(editor, () => {
            editor.tf.withoutNormalizing(() => {
              children.forEach((page, pageIndex) => {
                if (!ElementApi.isElement(page)) return;

                if (hasFooters) {
                  const lastIdx = page.children.length - 1;
                  editor.tf.removeNodes({
                    at: [pageIndex, lastIdx],
                    match: (n) =>
                      ElementApi.isElement(n) && n.type === 'footer',
                  });
                } else {
                  editor.tf.insertNodes(
                    {
                      type: 'footer',
                      children: [
                        {
                          type: getOptions().defaultBlockType,
                          children: [{ text: '' }],
                        },
                      ],
                    },
                    { at: [pageIndex, page.children.length] }
                  );
                }
              });
            });
          });

          // Mark all pages dirty to trigger reflow
          for (let i = 0; i < children.length; i++) {
            runtime.markDirty(i);
          }

          return !hasFooters;
        },
      },
    },
  };
};

export const BasePaginationPlugin = createTSlatePlugin<PaginationConfig>({
  key: KEYS.pagination,
  node: {
    isElement: true,
    isContainer: true,
    type: 'page',
  },
  handlers: {
    onNodeChange: ({ editor }) => {
      if (isPaginationMutating(editor)) return;
      if (editor.meta?.isNormalizing) return;
      const pageType = editor.getType?.(KEYS.pagination) ?? 'page';
      const children = editor.children;
      if (!Array.isArray(children) || children.length === 0) return;

      const hasNonPage = children.some(
        (child) => !ElementApi.isElement(child) || child.type !== pageType
      );
      if (!hasNonPage) return;

      if (normalizeRootChildren(editor, pageType)) {
        _getPaginationRuntime(editor)?.markDirty(0);
      }
    },
  },
  normalizeInitialValue: ({ editor, type }) => {
    normalizeRootChildren(editor, type);
  },
  options: {
    documentSettings: DEFAULT_DOCUMENT_SETTINGS,
    reflow: DEFAULT_REFLOW_OPTIONS,
    collaboration: DEFAULT_COLLABORATION_OPTIONS,
    defaultBlockType: KEYS.p,
    viewMode: 'paginated',
  },
}).overrideEditor(withPagination);

function wrapRootRange(
  editor: SlateEditor,
  type: string,
  start: number,
  end: number
) {
  _withPaginationMutations(editor, () => {
    editor.tf.withoutNormalizing(() => {
      const pagePath = [start];
      editor.tf.insertNodes({ type, children: [] }, { at: pagePath });

      const count = end - start + 1;
      for (let i = 0; i < count; i++) {
        editor.tf.moveNodes({
          at: [start + 1],
          to: pagePath.concat([i]),
        });
      }
    });
  });
}

function normalizeRootChildren(editor: SlateEditor, type: string): boolean {
  const children = editor.children;
  if (!Array.isArray(children) || children.length === 0) return false;

  let segStart: number | null = null;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const isPage = ElementApi.isElement(child) && child.type === type;
    if (!isPage && segStart === null) segStart = i;
    if (isPage && segStart !== null) {
      wrapRootRange(editor, type, segStart, i - 1);
      return true;
    }
  }

  if (segStart !== null) {
    wrapRootRange(editor, type, segStart, children.length - 1);
    return true;
  }

  return false;
}
