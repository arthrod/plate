// ============================================================
// pagination/registry.tsx
// ============================================================
import React, { createContext, useContext, useMemo, useRef } from 'react';
import type { PageDom } from './types';

type Registry = {
  registerPage: (pageIndex: number, dom: PageDom) => () => void;
  getPageDom: (pageIndex: number) => PageDom | undefined;
  getKnownPages: () => number[];
};

const PaginationRegistryContext = createContext<Registry | null>(null);

export function PaginationRegistryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pagesRef = useRef(new Map<number, PageDom>());

  const value = useMemo<Registry>(
    () => ({
      registerPage(pageIndex: number, dom: PageDom) {
        pagesRef.current.set(pageIndex, dom);
        return () => {
          const current = pagesRef.current.get(pageIndex);
          if (current?.outer === dom.outer) {
            pagesRef.current.delete(pageIndex);
          }
        };
      },

      getPageDom(pageIndex: number) {
        return pagesRef.current.get(pageIndex);
      },

      getKnownPages() {
        return Array.from(pagesRef.current.keys()).sort((a, b) => a - b);
      },
    }),
    []
  );

  return (
    <PaginationRegistryContext.Provider value={value}>
      {children}
    </PaginationRegistryContext.Provider>
  );
}

export function usePaginationRegistry() {
  return useContext(PaginationRegistryContext);
}
