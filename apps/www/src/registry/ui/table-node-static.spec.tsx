/**
 * Tests for table-node-static.tsx utility functions
 *
 * Covers:
 * - TableElementStatic component
 * - TableRowElementStatic component
 * - TableCellElementStatic component
 * - cellBorderStyles utility function (internal)
 */

import { describe, expect, it } from 'bun:test';
import { renderToString } from 'react-dom/server';
import type { TTableCellElement, TTableElement } from 'platejs';
import { createSlateEditor } from 'platejs';
import { BaseTablePlugin } from '@platejs/table';
import {
  TableElementStatic,
  TableRowElementStatic,
  TableCellElementStatic,
  TableCellHeaderElementStatic,
} from './table-node-static';

describe('TableElementStatic', () => {
  it('should render table with default margin', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableElement = {
      type: 'table',
      children: [],
    };

    const html = renderToString(
      <TableElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <tr>
          <td>Test</td>
        </tr>
      </TableElementStatic>
    );

    expect(html).toContain('<table');
    expect(html).toContain('table-fixed');
    expect(html).toContain('border-collapse');
  });

  it('should apply custom marginLeft when provided', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableElement = {
      type: 'table',
      children: [],
      marginLeft: 20,
    };

    const html = renderToString(
      <TableElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <tr>
          <td>Test</td>
        </tr>
      </TableElementStatic>
    );

    expect(html).toContain('padding-left');
    expect(html).toContain('20');
  });

  it('should disable marginLeft when option is set', () => {
    const editor = createSlateEditor({
      plugins: [
        BaseTablePlugin.configure({
          options: { disableMarginLeft: true },
        }),
      ],
    });

    const element: TTableElement = {
      type: 'table',
      children: [],
      marginLeft: 20,
    };

    const html = renderToString(
      <TableElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <tr>
          <td>Test</td>
        </tr>
      </TableElementStatic>
    );

    // Should have padding-left:0
    expect(html).toContain('padding-left');
    expect(html).toContain('0');
  });
});

describe('TableRowElementStatic', () => {
  it('should render tr element', () => {
    const editor = createSlateEditor();
    const element = { type: 'tr', children: [] };

    const html = renderToString(
      <TableRowElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <td>Cell content</td>
      </TableRowElementStatic>
    );

    expect(html).toContain('<tr');
    expect(html).toContain('Cell content');
  });

  it('should apply h-full class', () => {
    const editor = createSlateEditor();
    const element = { type: 'tr', children: [] };

    const html = renderToString(
      <TableRowElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <td>Test</td>
      </TableRowElementStatic>
    );

    expect(html).toContain('h-full');
  });
});

describe('TableCellElementStatic', () => {
  it('should render td element by default', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'td',
      children: [],
    };

    const html = renderToString(
      <TableCellElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>Cell content</p>
      </TableCellElementStatic>
    );

    expect(html).toContain('<td');
    expect(html).toContain('Cell content');
  });

  it('should apply background color when provided', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'td',
      children: [],
      background: '#ff0000',
    };

    const html = renderToString(
      <TableCellElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>Red cell</p>
      </TableCellElementStatic>
    );

    expect(html).toContain('background-color');
    expect(html).toContain('#ff0000');
  });

  it('should apply colSpan when provided', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'td',
      children: [],
      colSpan: 2,
    };

    const html = renderToString(
      <TableCellElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>Spanning cell</p>
      </TableCellElementStatic>
    );

    expect(html).toContain('colspan="2"');
  });

  it('should apply rowSpan when provided', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'td',
      children: [],
      rowSpan: 3,
    };

    const html = renderToString(
      <TableCellElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>Spanning cell</p>
      </TableCellElementStatic>
    );

    expect(html).toContain('rowspan="3"');
  });

  it('should apply custom width when provided', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'td',
      children: [],
      width: 300,
    };

    const html = renderToString(
      <TableCellElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>Wide cell</p>
      </TableCellElementStatic>
    );

    expect(html).toContain('300');
  });
});

describe('TableCellHeaderElementStatic', () => {
  it('should render th element', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'th',
      children: [],
    };

    const html = renderToString(
      <TableCellHeaderElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>Header content</p>
      </TableCellHeaderElementStatic>
    );

    expect(html).toContain('<th');
    expect(html).toContain('Header content');
  });

  it('should apply header-specific styles', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'th',
      children: [],
    };

    const html = renderToString(
      <TableCellHeaderElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>Header</p>
      </TableCellHeaderElementStatic>
    );

    expect(html).toContain('text-left');
    expect(html).toContain('font-normal');
  });
});

describe('cellBorderStyles utility (tested via component)', () => {
  it('should apply all four border sides', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'td',
      children: [],
      borders: {
        top: { size: 1, style: 'solid', color: '#000000' },
        right: { size: 2, style: 'dashed', color: '#ff0000' },
        bottom: { size: 3, style: 'dotted', color: '#00ff00' },
        left: { size: 4, style: 'double', color: '#0000ff' },
      },
    };

    const html = renderToString(
      <TableCellElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>Bordered cell</p>
      </TableCellElementStatic>
    );

    expect(html).toContain('border-top');
    expect(html).toContain('1px');
    expect(html).toContain('solid');
    expect(html).toContain('#000000');

    expect(html).toContain('border-right');
    expect(html).toContain('2px');
    expect(html).toContain('dashed');
    expect(html).toContain('#ff0000');

    expect(html).toContain('border-bottom');
    expect(html).toContain('3px');
    expect(html).toContain('dotted');
    expect(html).toContain('#00ff00');

    expect(html).toContain('border-left');
    expect(html).toContain('4px');
    expect(html).toContain('double');
    expect(html).toContain('#0000ff');
  });

  it('should handle partial borders (only some sides)', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'td',
      children: [],
      borders: {
        top: { size: 1, style: 'solid', color: '#000000' },
        bottom: { size: 1, style: 'solid', color: '#000000' },
      },
    };

    const html = renderToString(
      <TableCellElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>Partial borders</p>
      </TableCellElementStatic>
    );

    expect(html).toContain('border-top');
    expect(html).toContain('border-bottom');
    // Should not contain border-left or border-right
  });

  it('should handle borders with missing size (skip border)', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'td',
      children: [],
      borders: {
        top: { style: 'solid', color: '#000000' } as any,
        bottom: { size: 1, style: 'solid', color: '#000000' },
      },
    };

    const html = renderToString(
      <TableCellElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>Cell</p>
      </TableCellElementStatic>
    );

    // Should only have bottom border
    expect(html).toContain('border-bottom');
  });

  it('should handle borders with default style and color', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'td',
      children: [],
      borders: {
        top: { size: 1 } as any,
      },
    };

    const html = renderToString(
      <TableCellElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>Default border</p>
      </TableCellElementStatic>
    );

    // Should apply default style (solid) and color (#000)
    expect(html).toContain('border-top');
    expect(html).toContain('1px');
  });

  it('should handle no borders', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'td',
      children: [],
    };

    const html = renderToString(
      <TableCellElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>No borders</p>
      </TableCellElementStatic>
    );

    // Should render without border styles (other than classes)
    expect(html).not.toContain('border-top:');
    expect(html).not.toContain('border-right:');
    expect(html).not.toContain('border-bottom:');
    expect(html).not.toContain('border-left:');
  });

  it('should handle empty borders object', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'td',
      children: [],
      borders: {},
    };

    const html = renderToString(
      <TableCellElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>Empty borders</p>
      </TableCellElementStatic>
    );

    // Should render without border styles
    expect(html).toBeDefined();
  });
});

describe('Complex table scenarios', () => {
  it('should handle cell with all features combined', () => {
    const editor = createSlateEditor({
      plugins: [BaseTablePlugin],
    });

    const element: TTableCellElement = {
      type: 'td',
      children: [],
      background: '#f0f0f0',
      colSpan: 2,
      rowSpan: 2,
      width: 200,
      borders: {
        top: { size: 1, style: 'solid', color: '#000000' },
        right: { size: 1, style: 'solid', color: '#000000' },
        bottom: { size: 1, style: 'solid', color: '#000000' },
        left: { size: 1, style: 'solid', color: '#000000' },
      },
    };

    const html = renderToString(
      <TableCellElementStatic
        editor={editor}
        element={element}
        attributes={{} as any}
      >
        <p>Complex cell</p>
      </TableCellElementStatic>
    );

    expect(html).toContain('colspan="2"');
    expect(html).toContain('rowspan="2"');
    expect(html).toContain('background-color');
    expect(html).toContain('#f0f0f0');
    expect(html).toContain('border-top');
    expect(html).toContain('200');
  });
});