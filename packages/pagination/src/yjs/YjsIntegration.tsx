// ============================================================
// pagination/yjs/YjsIntegration.tsx
// ============================================================
import { YjsPlugin } from '@platejs/yjs/react';
import { useEditorRef, usePluginOption } from 'platejs/react';
import React, { useEffect, useMemo } from 'react';
import { getPaginationRuntime } from '../BasePaginationPlugin';
import { PaginationCoordinator } from '../PaginationCoordinator';
import { createAwarenessLeaderElection } from '../leaderElection';
import type { LeaderElection } from '../types';

export function YjsPaginationBridge() {
  const editor = useEditorRef();
  const runtime = getPaginationRuntime(editor);
  const awareness = usePluginOption(YjsPlugin, 'awareness');
  const ydoc = usePluginOption(YjsPlugin, 'ydoc');
  // _isConnected / _isSynced are internal YjsPlugin state keys used
  // to gate pagination until the Yjs document is fully loaded.
  const isConnected = usePluginOption(YjsPlugin, '_isConnected');
  const isSynced = usePluginOption(YjsPlugin, '_isSynced');
  const canProcess = Boolean(isConnected && isSynced);

  // Create leader election based on Yjs awareness.
  // awareness: Awareness and ydoc: Y.Doc are imported as type-only
  // (optional peer dependency), so cast to any for the runtime call.
  const leaderElection = useMemo<LeaderElection | undefined>(() => {
    if (!awareness || !ydoc) return;
    return createAwarenessLeaderElection(awareness as any, ydoc as any);
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
      leaderElection={leaderElection}
      canProcess={canProcess}
    />
  );
}
