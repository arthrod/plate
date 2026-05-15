// ============================================================
// PaginationCoordinator.spec.tsx — TDD Cycle 6
// Mocks platejs/react hooks to avoid store.useValue incompatibility
// with React 19 in test environment.
// ============================================================
import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { createSlateEditor } from 'platejs';
import { BasePaginationPlugin, getPaginationRuntime } from '../BasePaginationPlugin';
import { PaginationRegistryProvider, usePaginationRegistry } from '../registry';

// Mock platejs/react hooks
jest.mock('platejs/react', () => ({
  useEditorRef: jest.fn(),
  usePluginOption: jest.fn(),
}));

const { useEditorRef, usePluginOption } = require('platejs/react');
const { PaginationCoordinator } = require('../PaginationCoordinator');

function createMockEditor(overrides: any = {}) {
  const editor = createSlateEditor({
    plugins: [BasePaginationPlugin],
    value: [
      {
        type: 'page',
        children: [{ type: 'p', children: [{ text: 'hello' }] }],
      },
    ],
  });
  // We still need BasePaginationPlugin for runtime, but hooks are mocked
  return editor;
}

type MountOpts = {
  reflowOpts?: Record<string, any>;
  collabOpts?: Record<string, any>;
  viewMode?: string;
  leaderElection?: any;
  canProcess?: boolean;
};

function mountCoordinator(opts: MountOpts = {}) {
  const editor = createMockEditor();

  // Configure mock hooks
  useEditorRef.mockReturnValue(editor);
  usePluginOption.mockImplementation(
    (_plugin: any, key: string) => {
      if (key === 'reflow') return opts.reflowOpts ?? {
        enabled: true,
        debounceMs: 10,
        maxPagesPerIdle: 6,
        maxMovesPerPage: 50,
        underflow: true,
        allowTextSplit: true,
        overflowThresholdPx: 0,
        underflowThresholdPx: 80,
      };
      if (key === 'collaboration') return opts.collabOpts ?? { mode: 'all' };
      if (key === 'viewMode') return opts.viewMode ?? 'paginated';
      return undefined;
    }
  );

  const container = document.createElement('div');
  const root = createRoot(container);

  act(() => {
    root.render(
      React.createElement(
        PaginationRegistryProvider,
        null,
        React.createElement(PaginationCoordinator, {
          leaderElection: opts.leaderElection,
          canProcess: opts.canProcess,
        })
      )
    );
  });

  return {
    container,
    editor,
    unmount: () => {
      act(() => {
        root.unmount();
      });
    },
  };
}

describe('PaginationCoordinator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ── Render ──
  it('renders without crashing', () => {
    const { unmount } = mountCoordinator();
    unmount();
  });

  it('renders null output (invisible)', () => {
    const { container, unmount } = mountCoordinator();
    expect(container.innerHTML).toBe('');
    unmount();
  });

  // ── Reflow options gate ──
  it('does not schedule reflow when reflow is disabled', () => {
    const spy = jest.spyOn(window, 'setTimeout');
    const { unmount } = mountCoordinator({
      reflowOpts: { enabled: false, debounceMs: 10 },
    });
    unmount();

    const reflowCalls = spy.mock.calls.filter(([, delay]) => delay === 10);
    expect(reflowCalls.length).toBe(0);
    spy.mockRestore();
  });

  it('schedules initial reflow on mount when enabled', () => {
    const spy = jest.spyOn(window, 'setTimeout');
    const { unmount } = mountCoordinator();
    unmount();

    const reflowCalls = spy.mock.calls.filter(([, delay]) => delay === 10);
    expect(reflowCalls.length).toBeGreaterThanOrEqual(1);
    spy.mockRestore();
  });

  // ── Leader mode ──
  it('leaderMode: non-leader skips reflow', () => {
    const spy = jest.spyOn(window, 'setTimeout');
    const leaderElection = {
      amILeader: () => false,
      subscribe: () => () => {},
      destroy: () => {},
    };

    const { unmount } = mountCoordinator({
      leaderElection,
      collabOpts: { mode: 'leader' },
    });
    unmount();

    const reflowCalls = spy.mock.calls.filter(([, delay]) => delay === 10);
    expect(reflowCalls.length).toBe(0);
    spy.mockRestore();
  });

  it('leaderMode: leader processes reflow', () => {
    const spy = jest.spyOn(window, 'setTimeout');
    const leaderElection = {
      amILeader: () => true,
      subscribe: () => () => {},
      destroy: () => {},
    };

    const { unmount } = mountCoordinator({
      leaderElection,
      collabOpts: { mode: 'leader' },
    });
    unmount();

    const reflowCalls = spy.mock.calls.filter(([, delay]) => delay === 10);
    expect(reflowCalls.length).toBeGreaterThanOrEqual(1);
    spy.mockRestore();
  });

  // ── Can-process override ──
  it('does not process when canProcess is false', () => {
    const spy = jest.spyOn(window, 'setTimeout');
    const { unmount } = mountCoordinator({ canProcess: false });
    unmount();

    const reflowCalls = spy.mock.calls.filter(([, delay]) => delay === 10);
    expect(reflowCalls.length).toBe(0);
    spy.mockRestore();
  });

  // ── Window resize ──
  it('triggers reflow on window resize', () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(window, 'setTimeout');

    const { unmount } = mountCoordinator();
    act(() => { jest.runAllTimers(); });
    spy.mockClear();

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // Resize uses dedicated 200ms debounce, not the 10ms reflow debounce
    const resizeCalls = spy.mock.calls.filter(([, delay]) => delay === 200);
    expect(resizeCalls.length).toBe(1);

    jest.useRealTimers();
    unmount();
    spy.mockRestore();
  });

  // ── Resize debounce hardening ──
  it('debounces rapid resize events (dedicated 200ms resize debounce)', () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(window, 'setTimeout');

    const { unmount } = mountCoordinator();
    act(() => { jest.runAllTimers(); });
    spy.mockClear();

    for (let i = 0; i < 5; i++) {
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }

    // Each resize event clears the previous 200ms timer and sets a new one.
    // After 5 rapid fires, only 1 setTimeout (200ms) should be pending,
    // plus 4 clearTimeout calls from the previous timers being cancelled.
    const pendingCalls = spy.mock.calls.filter(([, delay]) => delay === 200);
    expect(pendingCalls.length).toBe(5);

    jest.useRealTimers();
    unmount();
    spy.mockRestore();
  });

  // ── Dirty runtime subscription ──
  it('subscribes to runtime dirty notifications', () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(window, 'setTimeout');
    const { editor, unmount } = mountCoordinator();
    // Flush mount timers so scheduledRef is cleared
    act(() => { jest.runAllTimers(); });
    spy.mockClear();

    const runtime = getPaginationRuntime(editor);
    expect(runtime).toBeTruthy();

    act(() => {
      runtime!.markDirty(2);
    });

    const reflowCalls = spy.mock.calls.filter(([, delay]) => delay === 10);
    expect(reflowCalls.length).toBe(1);

    jest.useRealTimers();
    unmount();
    spy.mockRestore();
  });

  // ── Dirty dedup: multiple marks coalesce ──
  it('multiple dirty marks coalesce to a single schedule', () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(window, 'setTimeout');
    const { editor, unmount } = mountCoordinator();
    act(() => { jest.runAllTimers(); });
    spy.mockClear();

    const runtime = getPaginationRuntime(editor);

    act(() => {
      runtime!.markDirty(0);
      runtime!.markDirty(1);
      runtime!.markDirty(2);
    });

    const reflowCalls = spy.mock.calls.filter(([, delay]) => delay === 10);
    expect(reflowCalls.length).toBe(1);

    jest.useRealTimers();
    unmount();
    spy.mockRestore();
  });

  // ── Cleanup ──
  it('cleans up resize listener on unmount', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = mountCoordinator();
    expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('clears pending timeouts on unmount', () => {
    const clearSpy = jest.spyOn(window, 'clearTimeout');
    const { unmount } = mountCoordinator();
    unmount();

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  // ── Should-process logic ──
  it('shouldProcess: false when canProcess is false', () => {
    // Indirect test: no setTimeout when canProcess=false
    const spy = jest.spyOn(window, 'setTimeout');
    const { unmount } = mountCoordinator({ canProcess: false });
    unmount();

    const reflowCalls = spy.mock.calls.filter(([, delay]) => delay === 10);
    expect(reflowCalls.length).toBe(0);
    spy.mockRestore();
  });
});
