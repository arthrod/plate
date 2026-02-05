// ============================================================
// pagination/runtime.ts
// ============================================================
import type { Operation } from 'slate';
import type { PaginationRuntime } from './types';

export function createPaginationRuntime(): PaginationRuntime {
  const dirty = new Set<number>();
  const subscribers = new Set<() => void>();

  const notify = () => {
    subscribers.forEach((fn) => {
      fn();
    });
  };

  return {
    markDirty(pageIndex: number) {
      if (!Number.isFinite(pageIndex) || pageIndex < 0) return;
      dirty.add(pageIndex);
      notify();
    },

    consumeDirtyMin(): number | null {
      if (dirty.size === 0) return null;
      const min = Math.min(...dirty);
      dirty.clear(); // Clear all — processing from min cascades forward
      return min;
    },

    subscribe(fn: () => void) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
  };
}

// Extract page index from any Slate operation
export function getPageIndexFromOp(op: Operation): number | null {
  const anyOp = op as any;
  const indices: number[] = [];

  if (Array.isArray(anyOp.path) && anyOp.path.length > 0) {
    indices.push(anyOp.path[0]);
  }
  if (Array.isArray(anyOp.newPath) && anyOp.newPath.length > 0) {
    indices.push(anyOp.newPath[0]);
  }

  if (indices.length === 0) return null;
  return Math.min(...indices);
}
