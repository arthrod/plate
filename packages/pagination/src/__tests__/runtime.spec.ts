import {
  createPaginationRuntime,
  getPageIndexFromOp,
} from '../internal/runtime';

describe('createPaginationRuntime', () => {
  it('returns object with markDirty, consumeDirtyMin, subscribe', () => {
    const rt = createPaginationRuntime();
    expect(typeof rt.markDirty).toBe('function');
    expect(typeof rt.consumeDirtyMin).toBe('function');
    expect(typeof rt.subscribe).toBe('function');
  });

  it('markDirty adds page to dirty set and notifies subscribers', async () => {
    const rt = createPaginationRuntime();
    const called: number[] = [];
    rt.subscribe(() => called.push(1));
    rt.markDirty(3);
    await Promise.resolve();
    expect(called.length).toBe(1);
  });

  it('markDirty with NaN is a no-op', async () => {
    const rt = createPaginationRuntime();
    const called: number[] = [];
    rt.subscribe(() => called.push(1));
    rt.markDirty(Number.NaN);
    await Promise.resolve();
    expect(called.length).toBe(0);
    expect(rt.consumeDirtyMin()).toBeNull();
  });

  it('markDirty with -1 is a no-op', () => {
    const rt = createPaginationRuntime();
    rt.markDirty(-1);
    expect(rt.consumeDirtyMin()).toBeNull();
  });

  it('markDirty with Infinity is a no-op', () => {
    const rt = createPaginationRuntime();
    rt.markDirty(Number.POSITIVE_INFINITY);
    expect(rt.consumeDirtyMin()).toBeNull();
  });

  it('consumeDirtyMin returns the minimum dirty page index', () => {
    const rt = createPaginationRuntime();
    rt.markDirty(3);
    expect(rt.consumeDirtyMin()).toBe(3);
  });

  it('consumeDirtyMin after multiple markDirty returns smallest index', () => {
    const rt = createPaginationRuntime();
    rt.markDirty(5);
    rt.markDirty(2);
    rt.markDirty(7);
    expect(rt.consumeDirtyMin()).toBe(2);
  });

  it('consumeDirtyMin clears the dirty set after consumption', () => {
    const rt = createPaginationRuntime();
    rt.markDirty(3);
    const first = rt.consumeDirtyMin();
    expect(first).toBe(3);
    expect(rt.consumeDirtyMin()).toBeNull();
  });

  it('consumeDirtyMin on empty set returns null', () => {
    const rt = createPaginationRuntime();
    expect(rt.consumeDirtyMin()).toBeNull();
  });

  it('subscribe returns unsubscribe function; unsubscribed callbacks are not called', async () => {
    const rt = createPaginationRuntime();
    const called: number[] = [];
    const unsub = rt.subscribe(() => called.push(1));
    unsub();
    rt.markDirty(0);
    await Promise.resolve();
    expect(called.length).toBe(0);
  });

  test('multiple markDirty in same tick produce one notification', async () => {
    const r = createPaginationRuntime();
    let count = 0;
    r.subscribe(() => {
      count++;
    });
    r.markDirty(0);
    r.markDirty(1);
    r.markDirty(2);
    await Promise.resolve();
    expect(count).toBe(1);
  });
});

describe('getPageIndexFromOp', () => {
  it('extracts index from set_node operation path', () => {
    const op = {
      type: 'set_node',
      path: [2, 0, 1],
      properties: {},
      newProperties: {},
    };
    expect(getPageIndexFromOp(op as any)).toBe(2);
  });

  it('extracts index from insert_node operation path', () => {
    const op = { type: 'insert_node', path: [1, 0], node: {} };
    expect(getPageIndexFromOp(op as any)).toBe(1);
  });

  it('extracts min index from move_node operation with path and newPath', () => {
    const op = { type: 'move_node', path: [3, 1], newPath: [0, 2] };
    expect(getPageIndexFromOp(op as any)).toBe(0);
  });

  it('returns null for operation with no paths (set_selection)', () => {
    const op = { type: 'set_selection', properties: {}, newProperties: {} };
    expect(getPageIndexFromOp(op as any)).toBeNull();
  });

  it('handles merge_node (has path)', () => {
    const op = {
      type: 'merge_node',
      path: [4, 0],
      position: 0,
      properties: {},
    };
    expect(getPageIndexFromOp(op as any)).toBe(4);
  });

  it('handles split_node (has path)', () => {
    const op = {
      type: 'split_node',
      path: [1, 2],
      position: 0,
      properties: {},
    };
    expect(getPageIndexFromOp(op as any)).toBe(1);
  });
});
