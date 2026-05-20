import {
  createAlwaysLeader,
  createAwarenessLeaderElection,
} from '../leaderElection';
import type { LeaderElection } from '../types';

describe('createAlwaysLeader', () => {
  let election: LeaderElection;

  beforeEach(() => {
    election = createAlwaysLeader();
  });

  it('amILeader returns true', () => {
    expect(election.amILeader()).toBe(true);
  });

  it('subscribe returns a no-op unsubscribe', () => {
    const unsub = election.subscribe(() => {});
    expect(typeof unsub).toBe('function');
    // Calling unsubscribe should not throw
    expect(() => unsub()).not.toThrow();
  });

  it('destroy is a no-op', () => {
    expect(() => election.destroy()).not.toThrow();
  });
});

describe('createAwarenessLeaderElection', () => {
  function makeAwareness(_clientId: number, states?: Map<number, any>) {
    const listeners: Array<() => void> = [];
    return {
      _listeners: listeners,
      on(_event: string, cb: () => void) {
        listeners.push(cb);
      },
      off(_event: string, cb: () => void) {
        const idx = listeners.indexOf(cb);
        if (idx >= 0) listeners.splice(idx, 1);
      },
      getStates() {
        return states ?? new Map();
      },
      setLocalStateField: () => {},
    };
  }

  function makeYdoc(clientId: number) {
    return { clientID: clientId };
  }

  it('with single ready client: that client is leader', () => {
    const awareness = makeAwareness(
      1,
      new Map([[1, { pagination: { ready: true } }]])
    );
    const ydoc = makeYdoc(1);
    const election = createAwarenessLeaderElection(
      awareness as any,
      ydoc as any
    );
    expect(election.amILeader()).toBe(true);
    election.destroy();
  });

  it('multiple ready clients: lowest clientID wins', () => {
    const states = new Map([
      [5, { pagination: { ready: true } }],
      [2, { pagination: { ready: true } }],
      [7, { pagination: { ready: true } }],
    ]);
    const awareness = makeAwareness(5, states);
    const ydoc = makeYdoc(5);
    const election = createAwarenessLeaderElection(
      awareness as any,
      ydoc as any
    );
    // clientID 5 is NOT the leader (2 is lowest)
    expect(election.amILeader()).toBe(false);
    election.destroy();
  });

  it('client without pagination.ready is excluded from election', () => {
    const states = new Map([
      [1, { pagination: { ready: false } }],
      [3, { other: true }],
    ]);
    const awareness = makeAwareness(3, states);
    const ydoc = makeYdoc(3);
    const election = createAwarenessLeaderElection(
      awareness as any,
      ydoc as any
    );
    // No ready clients — current client wins by default
    expect(election.amILeader()).toBe(true);
    election.destroy();
  });

  it('subscribe callback is called when awareness state changes', () => {
    const awareness = makeAwareness(1);
    const ydoc = makeYdoc(1);
    const election = createAwarenessLeaderElection(
      awareness as any,
      ydoc as any
    );

    let called = false;
    election.subscribe(() => {
      called = true;
    });

    // Simulate awareness change
    awareness._listeners.forEach((fn) => {
      fn();
    });

    expect(called).toBe(true);
    election.destroy();
  });

  it('destroy removes awareness listener and clears subscribers', () => {
    const awareness = makeAwareness(1);
    const ydoc = makeYdoc(1);
    const election = createAwarenessLeaderElection(
      awareness as any,
      ydoc as any
    );

    let called = false;
    election.subscribe(() => {
      called = true;
    });

    election.destroy();

    // After destroy, awareness listeners should be empty
    expect(awareness._listeners.length).toBe(0);

    // Subscribers should not be called after clearing
    called = false;
    // Re-trigger (listeners were cleared, so nothing triggers)
    awareness._listeners.forEach((fn) => {
      fn();
    });
    expect(called).toBe(false);
  });
});
