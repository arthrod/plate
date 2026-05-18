// ============================================================
// pagination/runtime.ts
// ============================================================
import type { Operation } from 'slate';
import type { PaginationRuntime } from '../types';

export function createPaginationRuntime(): PaginationRuntime {
  const dirty = new Set<number>();
  const subscribers = new Set<() => void>();

  let pending = false;
  const notify = () => {
    if (pending) return;
    pending = true;
    queueMicrotask(() => {
      pending = false;
      subscribers.forEach((fn) => {
        fn();
      });
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
      // Manual min avoids stack overflow from spread on large Sets
      let min = Number.POSITIVE_INFINITY;
      for (const page of dirty) {
        if (page < min) min = page;
      }
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
  const indices: number[] = [];

  if ('path' in op && Array.isArray(op.path) && op.path.length > 0) {
    indices.push(op.path[0]);
  }
  if ('newPath' in op && Array.isArray(op.newPath) && op.newPath.length > 0) {
    indices.push(op.newPath[0]);
  }

  return indices.length ? Math.min(...indices) : null;
}
