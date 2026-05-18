import { scheduleIdle } from '../internal/scheduleIdle';

describe('scheduleIdle', () => {
  it('schedules via requestIdleCallback when available', () => {
    const cb = jest.fn();
    const ric = jest.fn((fn: () => void) => {
      fn();
      return 1;
    });
    (window as any).requestIdleCallback = ric;

    scheduleIdle(cb);
    expect(ric).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledTimes(1);

    delete (window as any).requestIdleCallback;
  });

  it('falls back to setTimeout(0) when requestIdleCallback is absent', () => {
    jest.useFakeTimers();
    const cb = jest.fn();
    delete (window as any).requestIdleCallback;

    scheduleIdle(cb);
    jest.runAllTimers();

    expect(cb).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('is a no-op in SSR (no window)', () => {
    const originalWindow = (globalThis as any).window;
    delete (globalThis as any).window;

    const cb = jest.fn();
    scheduleIdle(cb);

    expect(cb).not.toHaveBeenCalled();
    (globalThis as any).window = originalWindow;
  });
});
