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
import { reflowPageBoundary } from './reflowEngine';
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

  const runtime = getPaginationRuntime(editor);

  // Leader state
  const leader = leaderElection ?? createAlwaysLeader();
  const isLeaderRef = useRef(leader.amILeader());

  // Processing state
  const scheduledRef = useRef<number | null>(null);
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

  // Reflow on window resize
  useEffect(() => {
    if (!reflowOpts.enabled) return;

    const onResize = () => scheduleReflowFrom(0);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [reflowOpts.enabled, scheduleReflowFrom]);

  // Initial reflow on mount
  useEffect(() => {
    scheduleReflowFrom(0);
  }, [scheduleReflowFrom]);

  return null;
}
