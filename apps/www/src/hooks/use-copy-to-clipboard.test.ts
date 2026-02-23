import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { useCopyToClipboard } from './use-copy-to-clipboard';

// Mock sonner toast
mock.module('sonner', () => ({
  toast: {
    success: mock(),
  },
}));

describe('useCopyToClipboard', () => {
  // @ts-ignore
  let originalClipboard;

  beforeEach(() => {
    originalClipboard = navigator.clipboard;
    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: mock(() => Promise.resolve()),
      },
      writable: true,
    });
  });

  afterEach(() => {
    if (originalClipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: originalClipboard,
        writable: true,
      });
    }
  });

  test('should return initial state', () => {
    const { result } = renderHook(() => useCopyToClipboard());

    expect(result.current.isCopied).toBe(false);
    expect(typeof result.current.copyToClipboard).toBe('function');
    expect(typeof result.current.setIsCopied).toBe('function');
  });

  test('should set isCopied to true when copyToClipboard is called', async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copyToClipboard('test');
    });

    expect(result.current.isCopied).toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test');
  });

  test('should allow manual reset of isCopied using setIsCopied', async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copyToClipboard('test');
    });

    expect(result.current.isCopied).toBe(true);

    act(() => {
      result.current.setIsCopied(false);
    });

    expect(result.current.isCopied).toBe(false);
  });
});
