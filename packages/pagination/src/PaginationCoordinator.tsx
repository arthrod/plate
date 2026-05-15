// ============================================================
// pagination/PaginationCoordinator.tsx
// ============================================================
import { useEditorRef, usePluginOption } from 'platejs/react';
import { useCallback, useEffect, useRef } from 'react';
import {
  BasePaginationPlugin,
  getPaginationRuntime,
} from './BasePaginationPlugin';
import { createAlwaysLeader } from './leaderElection';
import { reflowPageBoundary } from './internal/reflowEngine';
import { usePaginationRegistry } from './registry';
import type {
  CollaborationOptions,
  LeaderElection,
  ReflowOptions,
} from './types';

type CoordinatorProps = {
  leaderElection?: LeaderElection;
  canProcess?: boolean;
};

export function PaginationCoordinator({
  leaderElection,
  canProcess,
}: CoordinatorProps) {
  const editor = useEditorRef();
  const registry = usePaginationRegistry();

  const reflowOpts = usePluginOption(
    BasePaginationPlugin,
    'reflow'
  ) as ReflowOptions;
  const collabOpts = usePluginOption(
    BasePaginationPlugin,
    'collaboration'
  ) as CollaborationOptions;
  const viewMode = usePluginOption(BasePaginationPlugin, 'viewMode');

  const runtime = getPaginationRuntime(editor);

  // Leader state
  const leader = leaderElection ?? createAlwaysLeader();
  const isLeaderRef = useRef(leader.amILeader());

  // Processing state
  const scheduledRef = useRef<number | null>(null);
  const resizeTimerRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const pendingStartRef = useRef<number | null>(null);

  // Update leader status on changes
  useEffect(() => {
    if (collabOpts.mode !== 'leader') return;

    return leader.subscribe(() => {
      isLeaderRef.current = leader.amILeader();
    });
  }, [leader, collabOpts.mode]);

  const shouldProcess = useCallback(() => {
    if (canProcess === false) return false;
    if (!reflowOpts.enabled) return false;
    if (collabOpts.mode === 'leader' && !isLeaderRef.current) return false;
    return true;
  }, [canProcess, reflowOpts.enabled, collabOpts.mode]);

  // Ref to store scheduleReflowFrom for use in runReflow (breaks circular dependency)
  const scheduleReflowFromRef = useRef<(startPage: number) => void>(() => {});

  const runReflow = useCallback(
    async (startPage: number) => {
      if (!shouldProcess() || !registry) return;

      if (runningRef.current) {
        scheduleReflowFromRef.current(startPage);
        return;
      }

      runningRef.current = true;

      try {
        // Wait for React to flush DOM updates
        await new Promise((r) => requestAnimationFrame(r));

        let page = Math.max(0, startPage);
        let pagesProcessed = 0;

        while (pagesProcessed < reflowOpts.maxPagesPerIdle) {
          const pageDom = registry.getPageDom(page);
          if (!pageDom) break; // Page not mounted

          const nextPageDom = registry.getPageDom(page + 1);

          const result = reflowPageBoundary(editor as any, page, {
            pageDom,
            nextPageDom,
            opts: reflowOpts,
          });

          pagesProcessed++;

          if (result.changed) {
            // Re-schedule to continue cascading
            if (result.nextPageToContinue !== null) {
              scheduleReflowFromRef.current(result.nextPageToContinue);
            }
            break;
          }
          // No change — move to next page
          page++;
        }
      } finally {
        runningRef.current = false;
      }
    },
    [editor, registry, reflowOpts, shouldProcess]
  );

  const scheduleReflowFrom = useCallback(
    (startPage: number) => {
      if (!shouldProcess()) return;

      pendingStartRef.current =
        pendingStartRef.current === null
          ? startPage
          : Math.min(pendingStartRef.current, startPage);

      if (scheduledRef.current !== null) return;

      scheduledRef.current = window.setTimeout(() => {
        scheduledRef.current = null;
        const start = pendingStartRef.current ?? 0;
        pendingStartRef.current = null;

        // Use requestIdleCallback if available
        const ric =
          (window as any).requestIdleCallback ??
          ((cb: () => void) => setTimeout(cb, 0));
        ric(() => runReflow(start));
      }, reflowOpts.debounceMs);
    },
    [runReflow, shouldProcess, reflowOpts.debounceMs]
  );

  // Keep ref in sync with latest scheduleReflowFrom
  scheduleReflowFromRef.current = scheduleReflowFrom;

  // Subscribe to runtime dirty notifications
  useEffect(() => {
    if (!runtime) return;

    return runtime.subscribe(() => {
      const min = runtime.consumeDirtyMin();
      if (min !== null) {
        scheduleReflowFrom(min);
      }
    });
  }, [runtime, scheduleReflowFrom]);

  // Reflow on window resize (with dedicated 200ms debounce to prevent storms)
  useEffect(() => {
    if (!reflowOpts.enabled) return;

    const onResize = () => {
      // Dedicated debounce for resize events — longer than the normal
      // reflow debounce to avoid flooding the scheduler during drag-resize.
      if (resizeTimerRef.current !== null) {
        window.clearTimeout(resizeTimerRef.current);
      }
      resizeTimerRef.current = window.setTimeout(() => {
        resizeTimerRef.current = null;
        scheduleReflowFrom(0);
      }, 200);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeTimerRef.current !== null) {
        window.clearTimeout(resizeTimerRef.current);
        resizeTimerRef.current = null;
      }
    };
  }, [reflowOpts.enabled, scheduleReflowFrom]);

  // Cleanup pending timers on unmount
  useEffect(
    () => () => {
      if (scheduledRef.current !== null) {
        window.clearTimeout(scheduledRef.current);
        scheduledRef.current = null;
      }
      if (resizeTimerRef.current !== null) {
        window.clearTimeout(resizeTimerRef.current);
        resizeTimerRef.current = null;
      }
    },
    []
  );

  // Initial reflow on mount
  useEffect(() => {
    scheduleReflowFrom(0);
  }, [scheduleReflowFrom]);

  // Reflow when view mode changes (e.g., continuous <-> paginated)
  useEffect(() => {
    if (!reflowOpts.enabled) return;
    scheduleReflowFrom(0);
  }, [reflowOpts.enabled, scheduleReflowFrom, viewMode]);

  return null;
}
