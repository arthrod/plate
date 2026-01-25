// ============================================================
// pagination/leaderElection.ts
// ============================================================
import type { Awareness } from 'y-protocols/awareness';
import type * as Y from 'yjs';

export type LeaderElection = {
  amILeader: () => boolean;
  subscribe: (callback: () => void) => () => void;
  destroy: () => void;
};

export function createAwarenessLeaderElection(
  awareness: Awareness,
  ydoc: Y.Doc
): LeaderElection {
  const clientId = ydoc.clientID;
  const subscribers = new Set<() => void>();

  const getLeaderClientId = (): number => {
    const states = awareness.getStates();
    const activeClients = Array.from(states.keys());

    if (activeClients.length === 0) return clientId;
    return Math.min(...activeClients);
  };

  const amILeader = (): boolean => getLeaderClientId() === clientId;

  const handleChange = () => {
    subscribers.forEach((fn) => fn());
  };

  awareness.on('change', handleChange);

  return {
    amILeader,
    subscribe(callback: () => void) {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
    destroy() {
      awareness.off('change', handleChange);
      subscribers.clear();
    },
  };
}

// Fallback for non-Yjs environments
export function createAlwaysLeader(): LeaderElection {
  return {
    amILeader: () => true,
    subscribe: () => () => {},
    destroy: () => {},
  };
}
