import { renderHook } from '@testing-library/react';
import React, { createElement } from 'react';

import { PaginationRegistryProvider, usePaginationRegistry } from '../registry';
import type { PageDom } from '../types';

function makeDom(): PageDom {
  return {
    outer: document.createElement('div'),
    content: document.createElement('div'),
  };
}

describe('PaginationRegistryProvider', () => {
  it('renders children', () => {
    const { result } = renderHook(() => usePaginationRegistry(), {
      wrapper: ({ children }) =>
        createElement(PaginationRegistryProvider, null, children),
    });
    expect(result.current).not.toBeNull();
  });

  it('usePaginationRegistry returns null when used outside provider', () => {
    const { result } = renderHook(() => usePaginationRegistry());
    expect(result.current).toBeNull();
  });
});

describe('registerPage', () => {
  function setup() {
    const { result } = renderHook(() => usePaginationRegistry(), {
      wrapper: ({ children }) =>
        createElement(PaginationRegistryProvider, null, children),
    });
    return result;
  }

  it('stores DOM refs and returns cleanup function', () => {
    const result = setup();
    const dom = makeDom();
    const cleanup = result.current!.registerPage(0, dom);
    expect(typeof cleanup).toBe('function');
    expect(result.current!.getPageDom(0)).toBe(dom);
  });

  it('getPageDom returns undefined for unknown index', () => {
    const result = setup();
    expect(result.current!.getPageDom(999)).toBeUndefined();
  });

  it('getKnownPages returns sorted array of registered page indices', () => {
    const result = setup();
    result.current!.registerPage(3, makeDom());
    result.current!.registerPage(1, makeDom());
    result.current!.registerPage(5, makeDom());
    expect(result.current!.getKnownPages()).toEqual([1, 3, 5]);
  });

  it('cleanup function removes the page from registry', () => {
    const result = setup();
    const dom = makeDom();
    const cleanup = result.current!.registerPage(0, dom);
    cleanup();
    expect(result.current!.getPageDom(0)).toBeUndefined();
  });

  it('cleanup does NOT remove a different page registered at same index later (outer ref identity check)', () => {
    const result = setup();
    const dom1 = makeDom();
    const cleanup = result.current!.registerPage(0, dom1);
    // Overwrite with a different PageDom at same index
    const dom2 = makeDom();
    result.current!.registerPage(0, dom2);
    // Cleanup should NOT remove dom2 because outer ref differs
    cleanup();
    expect(result.current!.getPageDom(0)).toBe(dom2);
  });

  it('multiple registrations at different indices are all tracked', () => {
    const result = setup();
    const dom0 = makeDom();
    const dom1 = makeDom();
    result.current!.registerPage(0, dom0);
    result.current!.registerPage(1, dom1);
    expect(result.current!.getPageDom(0)).toBe(dom0);
    expect(result.current!.getPageDom(1)).toBe(dom1);
  });

  it('cleanup only removes the specific page', () => {
    const result = setup();
    const domA = makeDom();
    const domB = makeDom();
    const cleanA = result.current!.registerPage(0, domA);
    result.current!.registerPage(1, domB);
    cleanA();
    expect(result.current!.getPageDom(0)).toBeUndefined();
    expect(result.current!.getPageDom(1)).toBe(domB);
  });
});
