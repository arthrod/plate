// ============================================================
// PaginationPlugin.spec.tsx — TDD Cycle 8
// Verify PaginationPlugin (BasePaginationPlugin + PageElement)
// ============================================================
import React from 'react';
import { createSlateEditor } from 'platejs';
import { PaginationPlugin } from '../index';
import { BasePaginationPlugin } from '../BasePaginationPlugin';
import { PaginationCoordinator } from '../PaginationCoordinator';
import { PaginationRegistryProvider } from '../registry';

describe('PaginationPlugin', () => {
  it('exports PaginationPlugin as a resolved plugin object', () => {
    expect(typeof PaginationPlugin).toBe('object');
    expect(PaginationPlugin).not.toBeNull();
  });

  it('PaginationPlugin is based on BasePaginationPlugin', () => {
    // PaginationPlugin extends BasePaginationPlugin with a render
    const pluginKey = (PaginationPlugin as any).key;
    expect(pluginKey).toBe('pagination');
  });

  it('editor with PaginationPlugin can create pages', () => {
    // Create editor with explicit page value structure (mimics
    // what the render-time overlay produces)
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin], // use headless for data model test
      value: [
        {
          type: 'page',
          children: [
            { type: 'h1', children: [{ text: 'Title' }] },
            { type: 'p', children: [{ text: 'Content paragraph one.' }] },
          ],
        },
        {
          type: 'page',
          children: [
            { type: 'p', children: [{ text: 'Content paragraph two.' }] },
            {
              type: 'blockquote',
              children: [{ type: 'p', children: [{ text: 'Quote' }] }],
            },
          ],
        },
      ],
    });

    expect(editor.children).toHaveLength(2);
    const page0 = editor.children[0] as any;
    const page1 = editor.children[1] as any;
    expect(page0.type).toBe('page');
    expect(page1.type).toBe('page');
    expect(page0.children).toHaveLength(2);
    expect(page1.children).toHaveLength(2);
    expect(page0.children[0].type).toBe('h1');
    expect(page0.children[1].children[0].text).toBe('Content paragraph one.');
  });

  it('page children maintain block types', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: 'page',
          children: [
            { type: 'h1', children: [{ text: 'a' }] },
            { type: 'h2', children: [{ text: 'b' }] },
            { type: 'h3', children: [{ text: 'c' }] },
          ],
        },
      ],
    });

    const page = editor.children[0] as any;
    expect(page.children).toHaveLength(3);
    expect(page.children[0].type).toBe('h1');
    expect(page.children[1].type).toBe('h2');
    expect(page.children[2].type).toBe('h3');
  });

  it('PaginationPlugin renders PageElement for page nodes', () => {
    // Verify the render property exists and is a function
    const paginationPlugin = PaginationPlugin as any;
    const render = paginationPlugin.render?.node;
    expect(typeof render).toBe('function');
  });

  it('auto-mounts the registry provider + coordinator above the editable', () => {
    // PageElement consumes usePaginationRegistry and the coordinator reads the
    // same registry, so a single provider must wrap both. The plugin owns this
    // wiring via one aboveEditable component — consumers should not wire it.
    const { render } = PaginationPlugin as any;
    expect(typeof render?.aboveEditable).toBe('function');

    // Render it and assert it provides the registry context + a coordinator.
    const tree = render.aboveEditable({ children: 'EDITABLE' });
    expect(tree.type).toBe(PaginationRegistryProvider);
    const kids = React.Children.toArray(tree.props.children);
    expect(kids).toContain('EDITABLE');
    expect(kids.some((k: any) => k?.type === PaginationCoordinator)).toBe(true);
  });
});
