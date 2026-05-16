// ----------------------------------------------------------------
// Cycle 9: YjsIntegration — verify-only tests (10 tests)
//
// Tests the createAwarenessLeaderElection pure-logic boundary using
// minimal mocks for Yjs Awareness and Y.Doc interfaces.
// ----------------------------------------------------------------
import { describe, expect, it } from 'vitest';
import { createAwarenessLeaderElection } from '../leaderElection';

// ------------------------------------------------------------------
// Minimal Yjs-compatible mocks
// ------------------------------------------------------------------
type AwarenessEventHandler = () => void;

function createMockAwareness(states?: Map<number, any>) {
  const eventHandlers = new Map<string, Set<AwarenessEventHandler>>();
  const stateMap = states ?? new Map<number, any>();

  return {
    on(event: string, handler: AwarenessEventHandler) {
      if (!eventHandlers.has(event)) eventHandlers.set(event, new Set());
      eventHandlers.get(event)!.add(handler);
    },
    off(event: string, handler: AwarenessEventHandler) {
      eventHandlers.get(event)?.delete(handler);
    },
    getStates() {
      return new Map(stateMap);
    },
    // Test helpers
    _trigger(event: string) {
      eventHandlers.get(event)?.forEach((handler) => handler());
    },
    _listenerCount(event: string) {
      return eventHandlers.get(event)?.size ?? 0;
    },
    _setState(id: number, state: any) {
      stateMap.set(id, state);
    },
    _deleteState(id: number) {
      stateMap.delete(id);
    },
  };
}

function createMockYdoc(clientID: number) {
  return {
    clientID,
    guid: 'test-doc',
  } as any;
}

describe('YjsIntegration (pure-logic boundary)', () => {
  // --------------------
  // Leader Election creation
  // --------------------
  it('createAwarenessLeaderElection returns leader election with amILeader, subscribe, destroy', () => {
    const awareness = createMockAwareness() as any;
    const ydoc = createMockYdoc(42);
    const election = createAwarenessLeaderElection(awareness, ydoc);

    expect(election).toBeDefined();
    expect(typeof election.amILeader).toBe('function');
    expect(typeof election.subscribe).toBe('function');
    expect(typeof election.destroy).toBe('function');
  });

  it('subscribes to awareness change events on creation', () => {
    const awareness = createMockAwareness() as any;
    const ydoc = createMockYdoc(42);
    createAwarenessLeaderElection(awareness, ydoc);

    expect(awareness._listenerCount('change')).toBe(1);
  });

  // --------------------
  // amILeader
  // --------------------
  it('amILeader returns true when no other ready clients', () => {
    const awareness = createMockAwareness() as any;
    // In real Yjs, current client's awareness state is auto-included in getStates()
    awareness._setState(42, { pagination: { ready: true } });
    const ydoc = createMockYdoc(42);
    const election = createAwarenessLeaderElection(awareness, ydoc);

    expect(election.amILeader()).toBe(true);
  });

  it('amILeader returns true when this client is the lowest ready client', () => {
    const awareness = createMockAwareness() as any;
    // In real Yjs, current client's awareness state is auto-included in getStates()
    awareness._setState(42, { pagination: { ready: true } });
    awareness._setState(99, { pagination: { ready: true } });
    const ydoc = createMockYdoc(42);
    const election = createAwarenessLeaderElection(awareness, ydoc);

    expect(election.amILeader()).toBe(true);
  });

  it('amILeader returns false when a lower clientID is also ready', () => {
    const awareness = createMockAwareness() as any;
    // In real Yjs, current client's awareness state is auto-included in getStates()
    awareness._setState(42, { pagination: { ready: true } });
    awareness._setState(5, { pagination: { ready: true } });
    const ydoc = createMockYdoc(42);
    const election = createAwarenessLeaderElection(awareness, ydoc);

    expect(election.amILeader()).toBe(false);
  });

  it('ignores clients that are not ready', () => {
    const awareness = createMockAwareness() as any;
    // Current client is ready
    awareness._setState(42, { pagination: { ready: true } });
    awareness._setState(5, { other: true });
    awareness._setState(7, { pagination: { ready: false } });
    const ydoc = createMockYdoc(42);
    const election = createAwarenessLeaderElection(awareness, ydoc);

    expect(election.amILeader()).toBe(true);
  });

  // --------------------
  // destroy
  // --------------------
  it('destroy stops listening to awareness changes', () => {
    const awareness = createMockAwareness() as any;
    const ydoc = createMockYdoc(42);
    const election = createAwarenessLeaderElection(awareness, ydoc);

    expect(awareness._listenerCount('change')).toBe(1);
    election.destroy();
    expect(awareness._listenerCount('change')).toBe(0);
  });

  // --------------------
  // subscribe
  // --------------------
  it('subscribe calls callback on awareness change', () => {
    const awareness = createMockAwareness() as any;
    const ydoc = createMockYdoc(42);
    const election = createAwarenessLeaderElection(awareness, ydoc);

    let called = 0;
    election.subscribe(() => {
      called++;
    });

    awareness._trigger('change');
    expect(called).toBe(1);
  });

  it('unsubscribe stops callback', () => {
    const awareness = createMockAwareness() as any;
    const ydoc = createMockYdoc(42);
    const election = createAwarenessLeaderElection(awareness, ydoc);

    let called = 0;
    const unsubscribe = election.subscribe(() => {
      called++;
    });

    unsubscribe();
    awareness._trigger('change');
    expect(called).toBe(0);
  });

  it('destroy clears all subscribers', () => {
    const awareness = createMockAwareness() as any;
    const ydoc = createMockYdoc(42);
    const election = createAwarenessLeaderElection(awareness, ydoc);

    let called = 0;
    election.subscribe(() => {
      called++;
    });

    election.destroy();
    awareness._trigger('change');
    expect(called).toBe(0);
  });

  // --------------------
  // Re-election
  // --------------------
  it('amILeader re-evaluates after state changes', () => {
    const awareness = createMockAwareness() as any;
    awareness._setState(42, { pagination: { ready: true } });
    const ydoc = createMockYdoc(42);
    const election = createAwarenessLeaderElection(awareness, ydoc);

    expect(election.amILeader()).toBe(true);

    // Add a lower clientID that is ready
    awareness._setState(5, { pagination: { ready: true } });
    expect(election.amILeader()).toBe(false);

    // Remove the lower client
    awareness._deleteState(5);
    expect(election.amILeader()).toBe(true);
  });
});
