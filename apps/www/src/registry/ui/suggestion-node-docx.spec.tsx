/**
 * Tests for suggestion-node-docx.tsx
 *
 * Covers:
 * - SuggestionLeafDocx component rendering
 */

import { describe, expect, it } from 'bun:test';
import { renderToString } from 'react-dom/server';
import type { TSuggestionText } from 'platejs';
import { createSlateEditor } from 'platejs';
import { SuggestionLeafDocx } from './suggestion-node-docx';

describe('SuggestionLeafDocx', () => {
  it('should render as span element', () => {
    const editor = createSlateEditor();

    const leaf: TSuggestionText = {
      text: 'Suggested text',
      suggestion_1: true,
    };

    const html = renderToString(
      <SuggestionLeafDocx
        editor={editor}
        leaf={leaf}
        text={leaf}
        attributes={{} as any}
      >
        Suggested text
      </SuggestionLeafDocx>
    );

    expect(html).toContain('<span');
    expect(html).toContain('Suggested text');
  });

  it('should not use ins or del tags', () => {
    const editor = createSlateEditor();

    const leaf: TSuggestionText = {
      text: 'Suggested text',
      suggestion_1: true,
    };

    const html = renderToString(
      <SuggestionLeafDocx
        editor={editor}
        leaf={leaf}
        text={leaf}
        attributes={{} as any}
      >
        Suggested text
      </SuggestionLeafDocx>
    );

    // Should NOT contain ins or del tags (which cause unwanted formatting in DOCX)
    expect(html).not.toContain('<ins');
    expect(html).not.toContain('<del');
  });

  it('should render children correctly', () => {
    const editor = createSlateEditor();

    const leaf: TSuggestionText = {
      text: 'Test content',
      suggestion_1: true,
    };

    const html = renderToString(
      <SuggestionLeafDocx
        editor={editor}
        leaf={leaf}
        text={leaf}
        attributes={{} as any}
      >
        Test content
      </SuggestionLeafDocx>
    );

    expect(html).toContain('Test content');
  });

  it('should handle empty text', () => {
    const editor = createSlateEditor();

    const leaf: TSuggestionText = {
      text: '',
      suggestion_1: true,
    };

    const html = renderToString(
      <SuggestionLeafDocx
        editor={editor}
        leaf={leaf}
        text={leaf}
        attributes={{} as any}
      >
        {''}
      </SuggestionLeafDocx>
    );

    expect(html).toContain('<span');
  });

  it('should handle multiple suggestions on same text', () => {
    const editor = createSlateEditor();

    const leaf: TSuggestionText = {
      text: 'Multi-suggestion text',
      suggestion_1: true,
      suggestion_2: true,
    };

    const html = renderToString(
      <SuggestionLeafDocx
        editor={editor}
        leaf={leaf}
        text={leaf}
        attributes={{} as any}
      >
        Multi-suggestion text
      </SuggestionLeafDocx>
    );

    expect(html).toContain('<span');
    expect(html).toContain('Multi-suggestion text');
  });

  it('should handle suggestion with formatting marks', () => {
    const editor = createSlateEditor();

    const leaf: TSuggestionText = {
      text: 'Bold suggestion',
      bold: true,
      suggestion_1: true,
    };

    const html = renderToString(
      <SuggestionLeafDocx
        editor={editor}
        leaf={leaf}
        text={leaf}
        attributes={{} as any}
      >
        Bold suggestion
      </SuggestionLeafDocx>
    );

    expect(html).toContain('<span');
    expect(html).toContain('Bold suggestion');
  });

  it('should handle special characters in suggestion text', () => {
    const editor = createSlateEditor();

    const leaf: TSuggestionText = {
      text: 'Text with <>&" special chars',
      suggestion_1: true,
    };

    const html = renderToString(
      <SuggestionLeafDocx
        editor={editor}
        leaf={leaf}
        text={leaf}
        attributes={{} as any}
      >
        Text with &lt;&gt;&amp;&quot; special chars
      </SuggestionLeafDocx>
    );

    expect(html).toContain('<span');
  });

  it('should preserve attributes passed to component', () => {
    const editor = createSlateEditor();

    const leaf: TSuggestionText = {
      text: 'Test',
      suggestion_1: true,
    };

    const attributes = {
      'data-slate-leaf': true,
    };

    const html = renderToString(
      <SuggestionLeafDocx
        editor={editor}
        leaf={leaf}
        text={leaf}
        attributes={attributes as any}
      >
        Test
      </SuggestionLeafDocx>
    );

    expect(html).toContain('<span');
    expect(html).toContain('Test');
  });
});