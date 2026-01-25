// ============================================================
// pagination/BasePaginationPlugin.ts
// ============================================================
import { createTSlatePlugin, type PluginConfig } from 'platejs';
import type { Operation } from 'slate';
import { createPaginationRuntime, getPageIndexFromOp } from './runtime';
import type {
  CollaborationOptions,
  DocumentSettings,
  PaginationRuntime,
  ReflowOptions,
} from './types';

export type PaginationConfig = PluginConfig<
  'pagination',
  {
    documentSettings: DocumentSettings;
    reflow: ReflowOptions;
    collaboration: CollaborationOptions;
    defaultBlockType: string;
  }
>;

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

export const BasePaginationPlugin = createTSlatePlugin<PaginationConfig>({
  key: 'pagination',
  node: {
    isElement: true,
    isContainer: true,
    type: 'page',
  },
  options: {
    documentSettings: DEFAULT_DOCUMENT_SETTINGS,
    reflow: DEFAULT_REFLOW_OPTIONS,
    collaboration: DEFAULT_COLLABORATION_OPTIONS,
    defaultBlockType: 'p',
  },
}).extendEditor(({ editor, type }) => {
  // Attach runtime to editor
  const runtime = createPaginationRuntime();
  (editor as any).__paginationRuntime = runtime;

  // Intercept all operations to mark pages dirty
  const { apply } = editor;
  editor.apply = (op: Operation) => {
    apply(op);

    if ((editor as any).__paginationMutating) return;

    const pageIndex = getPageIndexFromOp(op);
    if (pageIndex !== null) {
      runtime.markDirty(pageIndex);
    }
  };

  // Normalize: pages must be at root level
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // If this is a page node not at root, unwrap it
    if ((node as any).type === type && path.length !== 1) {
      editor.tf.unwrapNodes({ at: path });
      return;
    }

    // If root has non-page children, wrap them
    if (path.length === 0) {
      for (const [child, childPath] of editor.api.nodes({
        at: path,
        mode: 'highest',
      })) {
        if ((child as any).type !== type && childPath.length === 1) {
          editor.tf.wrapNodes({ type, children: [] }, { at: childPath });
          return; // Let Slate re-run normalization
        }
      }
    }

    normalizeNode(entry);
  };

  return editor;
});

export function withPaginationMutations(editor: any, fn: () => void) {
  const prev = editor.__paginationMutating;
  editor.__paginationMutating = true;
  try {
    fn();
  } finally {
    editor.__paginationMutating = prev;
  }
}

// Helper to get runtime from editor
export function getPaginationRuntime(
  editor: any
): PaginationRuntime | undefined {
  return editor.__paginationRuntime;
}
