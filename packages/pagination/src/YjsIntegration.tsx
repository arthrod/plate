// ============================================================
// pagination/YjsIntegration.tsx
// ============================================================
import React, { useEffect, useMemo } from 'react'
import { useEditorRef, usePluginOption } from 'platejs/react'
import type { Awareness } from 'y-protocols/awareness'
import type * as Y from 'yjs'
import { getPaginationRuntime } from './BasePaginationPlugin'
import { createAwarenessLeaderElection, type LeaderElection } from './leaderElection'
import { PaginationCoordinator } from './PaginationCoordinator'

type YjsPaginationBridgeProps = {
  ydoc: Y.Doc
  awareness: Awareness
  providers?: Array<{ isSynced?: boolean }>
}

export function YjsPaginationBridge({ ydoc, awareness, providers }: YjsPaginationBridgeProps) {
  const editor = useEditorRef()
  const runtime = getPaginationRuntime(editor)
  
  // Create leader election based on Yjs awareness
  const leaderElection = useMemo<LeaderElection>(() => {
    return createAwarenessLeaderElection(awareness, ydoc)
  }, [awareness, ydoc])
  
  // Wait for initial Yjs sync before paginating
  const allSynced = providers?.length
    ? providers.every(p => p.isSynced)
    : true
  
  useEffect(() => {
    if (!allSynced || !runtime) return
    
    // Kick pagination after Yjs sync completes
    runtime.markDirty(0)
  }, [allSynced, runtime])
  
  // Cleanup
  useEffect(() => {
    return () => leaderElection.destroy()
  }, [leaderElection])
  
  return <PaginationCoordinator leaderElection={leaderElection} />
}