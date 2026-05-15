// ============================================================
// pagination/BasePaginationPlugin.ts
// ============================================================
import { createTSlatePlugin, type OverrideEditor, type PluginConfig } from 'platejs';
import type { Operation } from 'slate';
import { createPaginationRuntime, getPageIndexFromOp } from './runtime';
import type {
  CollaborationOptions,
  DocumentSettings,
  PaginationRuntime,
  ReflowOptions,
  ViewMode,
} from './types';

export type PaginationConfig = PluginConfig<
  'pagination',
  {
    documentSettings: DocumentSettings;
    reflow: ReflowOptions;
    collaboration: CollaborationOptions;
    defaultBlockType: string;
    viewMode: ViewMode;
  },
  {}
>;

const PAGINATION_KEY = 'pagination';

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
  type,
  tf: { apply, normalizeNode },
}) => {
  // Attach runtime to editor
  const runtime = createPaginationRuntime();
  (editor as any).__paginationRuntime = runtime;

  const getPlugin = () => editor.getPlugin(BasePaginationPlugin) as any;

  return {
    transforms: {
      apply(op: Operation) {
        apply(op);

        if ((editor as any).__paginationMutating) return;

        const pageIndex = getPageIndexFromOp(op);
        if (pageIndex !== null && runtime) {
          runtime.markDirty(pageIndex);
        }
      },
      normalizeNode(entry: [any, any]) {
        const [node, path] = entry;

        // Unwrap nested pages
        if ((node as any)?.type === type && path.length !== 1) {
          editor.tf.unwrapNodes({ at: path });
          return;
        }

        // Wrap non-page root children
        if (path.length === 0) {
          if (normalizeRootChildren(editor, type)) return;
        }

        normalizeNode(entry);
      },
      pagination: {
        togglePreview(): boolean {
          const current = (getPlugin().options as any).viewMode ?? 'paginated';
          const next = current === 'paginated' ? 'continuous' : 'paginated';
          editor.setOption(BasePaginationPlugin, 'viewMode', next);
          return next === 'continuous';
        },
        setPageSize(size: string): void {
          const preset = PAGE_SIZES[size];
          if (preset) {
            const currentSettings = (
              getPlugin().options as any
            ).documentSettings;
            editor.setOptions(BasePaginationPlugin, {
              documentSettings: {
                ...currentSettings,
                sizes: { ...preset },
              },
            });
          }
        },
        setMargins(margins: DocumentSettings['margins']): void {
          const currentSettings = (
            getPlugin().options as any
          ).documentSettings;
          editor.setOptions(BasePaginationPlugin, {
            documentSettings: {
              ...currentSettings,
              margins: { ...margins },
            },
          });
        },
        toggleHeader(): boolean {
          const children = editor.children as any[];
          const hasHeaders = children.some(
            (page) => page.children?.[0]?.type === 'header'
          );

          withPaginationMutations(editor, () => {
            editor.tf.withoutNormalizing(() => {
              children.forEach((_page, pageIndex) => {
                if (hasHeaders) {
                  editor.tf.removeNodes({
                    at: [pageIndex, 0],
                    match: (n: any) => n.type === 'header',
                  });
                } else {
                  editor.tf.insertNodes(
                    {
                      type: 'header',
                      children: [
                        {
                          type: editor.getOptions(BasePaginationPlugin)
                            .defaultBlockType,
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
          const children = editor.children as any[];
          const hasFooters = children.some(
            (page) =>
              page.children?.[page.children.length - 1]?.type === 'footer'
          );

          withPaginationMutations(editor, () => {
            editor.tf.withoutNormalizing(() => {
              children.forEach((page, pageIndex) => {
                if (hasFooters) {
                  const lastIdx = page.children.length - 1;
                  editor.tf.removeNodes({
                    at: [pageIndex, lastIdx],
                    match: (n: any) => n.type === 'footer',
                  });
                } else {
                  editor.tf.insertNodes(
                    {
                      type: 'footer',
                      children: [
                        {
                          type: editor.getOptions(BasePaginationPlugin)
                            .defaultBlockType,
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
  key: PAGINATION_KEY,
  node: {
    isElement: true,
    isContainer: true,
    type: 'page',
  },
  handlers: {
    onNodeChange: ({ editor }) => {
      if ((editor as any).__paginationMutating) return;
      if ((editor as any).meta?.isNormalizing) return;
      const pageType = editor.getType?.(PAGINATION_KEY) ?? 'page';
      const children = editor.children as any[];
      if (!Array.isArray(children) || children.length === 0) return;

      const hasNonPage = children.some((child) => child?.type !== pageType);
      if (!hasNonPage) return;

      if (normalizeRootChildren(editor, pageType)) {
        getPaginationRuntime(editor)?.markDirty(0);
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
    defaultBlockType: 'p',
    viewMode: 'paginated',
  },
}).overrideEditor(withPagination);

export function withPaginationMutations(editor: any, fn: () => void) {
  const prev = editor.__paginationMutating;
  editor.__paginationMutating = true;
  try {
    fn();
  } finally {
    editor.__paginationMutating = prev;
  }
}

function wrapRootRange(editor: any, type: string, start: number, end: number) {
  withPaginationMutations(editor, () => {
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

function normalizeRootChildren(editor: any, type: string): boolean {
  const children = editor.children as any[];
  if (!Array.isArray(children) || children.length === 0) return false;

  let segStart: number | null = null;

  for (let i = 0; i < children.length; i++) {
    const isPage = children[i]?.type === type;
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

// Helper to get runtime from editor
export function getPaginationRuntime(
  editor: any
): PaginationRuntime | undefined {
  return editor.__paginationRuntime;
}
