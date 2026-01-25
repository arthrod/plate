// ============================================================
// pagination/YjsIntegration.tsx
// ============================================================
import { YjsPlugin } from '@platejs/yjs/react';
import { useEditorRef, usePluginOption } from 'platejs/react';
import React, { useEffect, useMemo } from 'react';
import { getPaginationRuntime } from './BasePaginationPlugin';
import {
  createAwarenessLeaderElection,
  type LeaderElection,
} from './leaderElection';
import { PaginationCoordinator } from './PaginationCoordinator';

export function YjsPaginationBridge() {
  const editor = useEditorRef();
  const runtime = getPaginationRuntime(editor);
  const awareness = usePluginOption(YjsPlugin, 'awareness');
  const ydoc = usePluginOption(YjsPlugin, 'ydoc');
  const isConnected = usePluginOption(YjsPlugin, '_isConnected');
  const isSynced = usePluginOption(YjsPlugin, '_isSynced');
  const canProcess = Boolean(isConnected && isSynced);

  // Create leader election based on Yjs awareness
  const leaderElection = useMemo<LeaderElection | null>(() => {
    if (!awareness || !ydoc) return null;
    return createAwarenessLeaderElection(awareness, ydoc);
  }, [awareness, ydoc]);

  // Wait for initial Yjs sync before paginating
  useEffect(() => {
    if (!canProcess || !runtime) return;

    // Kick pagination after Yjs sync completes
    runtime.markDirty(0);
  }, [canProcess, runtime]);

  useEffect(() => {
    if (!awareness) return;
    awareness.setLocalStateField('pagination', { ready: canProcess });
  }, [awareness, canProcess]);

  // Cleanup
  useEffect(() => {
    if (!leaderElection) return;
    return () => leaderElection.destroy();
  }, [leaderElection]);

  return (
    <PaginationCoordinator
      leaderElection={leaderElection ?? undefined}
      canProcess={canProcess}
    />
  );
}