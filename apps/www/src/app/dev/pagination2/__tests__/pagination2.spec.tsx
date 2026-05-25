/**
 * Tests for the pagination2 dev demo page and view component.
 *
 * The PaginationView component relies on a live Plate editor with DOM
 * measurement (PaginationPlugin), so heavy dependencies are mocked out. The
 * tests verify the component's rendering contract and DOM structure.
 */
import * as React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

// ---------------------------------------------------------------------------
// Mock out the heavy editor + pagination deps before importing the component.
// ---------------------------------------------------------------------------

// Stub PaginationPlugin so no real DOM measurement pipeline runs.
mock.module('@platejs/pagination/react', () => ({
  PaginationPlugin: { key: 'pagination' },
}));

// BasicNodesKit is just an array of plugins — stub it as empty.
mock.module(
  '@/registry/components/editor/plugins/basic-nodes-kit',
  () => ({
    BasicNodesKit: [],
  })
);

// Stub the Plate editor hook so it returns a minimal editor-shaped object.
const fakeEditor = { children: [], operations: [], selection: null };
mock.module('platejs/react', () => ({
  Plate: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="plate-root">{children}</div>
  ),
  PlateContent: (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="plate-content" {...props} />
  ),
  usePlateEditor: () => fakeEditor,
}));

// Now import the module under test (after mocks are registered).
import { PaginationView } from '../pagination2-view';

// ---------------------------------------------------------------------------
// page.tsx — static export contract
// ---------------------------------------------------------------------------

describe('pagination2 page.tsx', () => {
  it('exports dynamic = "force-dynamic" (prevents SSR of DOM-measurement component)', async () => {
    // Import dynamically after mocks are in place.
    const pageModule = await import('../page');
    expect((pageModule as { dynamic?: string }).dynamic).toBe('force-dynamic');
  });

  it('renders PaginationView as the default export', async () => {
    const pageModule = await import('../page');
    const Page =
      (pageModule as { default?: React.ComponentType }).default ?? null;
    expect(Page).not.toBeNull();
    if (Page) {
      const { container } = render(<Page />);
      // The desk wrapper must be present.
      expect(container.querySelector('[data-testid="pagination-desk"]')).not.toBeNull();
    }
  });
});

// ---------------------------------------------------------------------------
// PaginationView — DOM structure
// ---------------------------------------------------------------------------

describe('PaginationView', () => {
  it('renders without throwing', () => {
    expect(() => render(<PaginationView />)).not.toThrow();
  });

  it('renders the outer desk container with the correct data-testid', () => {
    render(<PaginationView />);
    expect(screen.getByTestId('pagination-desk')).toBeDefined();
  });

  it('renders the inner page-stack container with the correct data-testid', () => {
    render(<PaginationView />);
    expect(screen.getByTestId('pagination-stack')).toBeDefined();
  });

  it('the page-stack is a child of the desk', () => {
    render(<PaginationView />);
    const desk = screen.getByTestId('pagination-desk');
    const stack = screen.getByTestId('pagination-stack');
    expect(desk.contains(stack)).toBe(true);
  });

  it('applies A4 width (794px) to the page-stack wrapper', () => {
    render(<PaginationView />);
    const stack = screen.getByTestId('pagination-stack');
    // The inline style sets width: 794 (A4 @ 96dpi).
    expect((stack as HTMLElement).style.width).toBe('794px');
  });

  it('applies 1in (96px) padding to the page-stack wrapper', () => {
    render(<PaginationView />);
    const stack = screen.getByTestId('pagination-stack');
    expect((stack as HTMLElement).style.padding).toBe('96px');
  });
});