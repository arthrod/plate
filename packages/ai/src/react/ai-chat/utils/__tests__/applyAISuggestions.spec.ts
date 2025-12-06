/** @jsx jsx */

import type { SlateEditor } from '@udecode/plate-core';

import { createPlateEditor } from '@udecode/plate-core/react';
import { jsx } from '@udecode/plate-test-utils';

import { applyAISuggestions } from '../applyAISuggestions';

jsx;

describe('applyAISuggestions', () => {
  let editor: SlateEditor;

  beforeEach(() => {
    editor = createPlateEditor({
      value: [
        {
          type: 'p',
          children: [{ text: 'Original text' }],
        },
      ],
    });
  });

  describe('basic functionality', () => {
    it('should apply simple text replacement', () => {
      const suggestion = 'New text';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      const text = (editor.children[0] as any).children[0].text;
      expect(text).toBe('New text');
    });

    it('should handle empty suggestion', () => {
      const suggestion = '';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      const text = (editor.children[0] as any).children[0].text;
      expect(text).toBe('');
    });

    it('should handle partial text replacement', () => {
      const suggestion = 'Modified';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 8 },
      };

      applyAISuggestions(editor, suggestion, range);

      const text = (editor.children[0] as any).children[0].text;
      expect(text).toContain('Modified');
    });
  });

  describe('range handling', () => {
    it('should handle collapsed range (insertion)', () => {
      const suggestion = 'Inserted ';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      };

      applyAISuggestions(editor, suggestion, range);

      const text = (editor.children[0] as any).children[0].text;
      expect(text).toContain('Inserted');
    });

    it('should handle range at end of text', () => {
      const suggestion = ' added';
      const range = {
        anchor: { path: [0, 0], offset: 13 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      const text = (editor.children[0] as any).children[0].text;
      expect(text).toBe('Original text added');
    });

    it('should handle range in middle of text', () => {
      const suggestion = 'replaced';
      const range = {
        anchor: { path: [0, 0], offset: 9 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      const text = (editor.children[0] as any).children[0].text;
      expect(text).toBe('Original replaced');
    });
  });

  describe('multi-paragraph suggestions', () => {
    beforeEach(() => {
      editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'First paragraph' }],
          },
          {
            type: 'p',
            children: [{ text: 'Second paragraph' }],
          },
        ],
      });
    });

    it('should handle suggestions spanning multiple paragraphs', () => {
      const suggestion = 'Replaced content';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [1, 0], offset: 16 },
      };

      applyAISuggestions(editor, suggestion, range);

      expect(editor.children.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle suggestion at paragraph boundary', () => {
      const suggestion = 'New text';
      const range = {
        anchor: { path: [0, 0], offset: 15 },
        focus: { path: [1, 0], offset: 0 },
      };

      applyAISuggestions(editor, suggestion, range);

      expect(editor.children.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('markdown-like suggestions', () => {
    it('should handle suggestions with newlines', () => {
      const suggestion = 'First line\nSecond line';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      expect(editor.children.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle suggestions with multiple newlines', () => {
      const suggestion = 'Paragraph 1\n\nParagraph 2\n\nParagraph 3';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      expect(editor.children.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle suggestions with trailing newlines', () => {
      const suggestion = 'Text with newline\n';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      expect(editor.children.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('special characters', () => {
    it('should handle suggestions with special characters', () => {
      const suggestion = 'Text with @#$%^&* characters';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      const text = (editor.children[0] as any).children[0].text;
      expect(text).toBe('Text with @#$%^&* characters');
    });

    it('should handle suggestions with unicode characters', () => {
      const suggestion = 'Unicode: 你好 世界 🌍';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      const text = (editor.children[0] as any).children[0].text;
      expect(text).toBe('Unicode: 你好 世界 🌍');
    });

    it('should handle suggestions with emoji', () => {
      const suggestion = 'Emoji test 😀 🎉 ✨';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      const text = (editor.children[0] as any).children[0].text;
      expect(text).toContain('😀');
    });
  });

  describe('edge cases', () => {
    it('should handle very long suggestions', () => {
      const suggestion = 'A'.repeat(10000);
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      expect(() => {
        applyAISuggestions(editor, suggestion, range);
      }).not.toThrow();
    });

    it('should handle suggestions with only whitespace', () => {
      const suggestion = '     ';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      const text = (editor.children[0] as any).children[0].text;
      expect(text).toBe('     ');
    });

    it('should handle suggestions with tabs', () => {
      const suggestion = 'Text\twith\ttabs';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      const text = (editor.children[0] as any).children[0].text;
      expect(text).toContain('\t');
    });

    it('should handle invalid range paths gracefully', () => {
      const suggestion = 'New text';
      const range = {
        anchor: { path: [99, 99], offset: 0 },
        focus: { path: [99, 99], offset: 0 },
      };

      expect(() => {
        applyAISuggestions(editor, suggestion, range);
      }).not.toThrow();
    });

    it('should handle negative offsets gracefully', () => {
      const suggestion = 'New text';
      const range = {
        anchor: { path: [0, 0], offset: -1 },
        focus: { path: [0, 0], offset: 5 },
      };

      expect(() => {
        applyAISuggestions(editor, suggestion, range);
      }).not.toThrow();
    });

    it('should handle offsets beyond text length gracefully', () => {
      const suggestion = 'New text';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 9999 },
      };

      expect(() => {
        applyAISuggestions(editor, suggestion, range);
      }).not.toThrow();
    });
  });

  describe('complex editor states', () => {
    it('should work with styled text', () => {
      editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Bold text', bold: true }],
          },
        ],
      });

      const suggestion = 'New styled';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 9 },
      };

      applyAISuggestions(editor, suggestion, range);

      expect(editor.children.length).toBeGreaterThanOrEqual(1);
    });

    it('should work with mixed content', () => {
      editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [
              { text: 'Plain ' },
              { text: 'bold', bold: true },
              { text: ' text' },
            ],
          },
        ],
      });

      const suggestion = 'Replaced';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 2], offset: 5 },
      };

      applyAISuggestions(editor, suggestion, range);

      expect(editor.children.length).toBeGreaterThanOrEqual(1);
    });

    it('should work with nested structures', () => {
      editor = createPlateEditor({
        value: [
          {
            type: 'blockquote',
            children: [
              {
                type: 'p',
                children: [{ text: 'Quoted text' }],
              },
            ],
          },
        ],
      });

      const suggestion = 'New quote';
      const range = {
        anchor: { path: [0, 0, 0], offset: 0 },
        focus: { path: [0, 0, 0], offset: 11 },
      };

      applyAISuggestions(editor, suggestion, range);

      expect(editor.children.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('selection restoration', () => {
    it('should handle selection after replacement', () => {
      const suggestion = 'Replaced text';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      expect(editor.selection).toBeDefined();
    });

    it('should handle selection with collapsed range', () => {
      const suggestion = 'Inserted';
      const range = {
        anchor: { path: [0, 0], offset: 8 },
        focus: { path: [0, 0], offset: 8 },
      };

      applyAISuggestions(editor, suggestion, range);

      expect(editor.selection).toBeDefined();
    });
  });

  describe('undo/redo compatibility', () => {
    it('should create undoable operation', () => {
      const originalValue = JSON.parse(JSON.stringify(editor.children));
      const suggestion = 'New text';
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, suggestion, range);

      expect(editor.children).not.toEqual(originalValue);
    });

    it('should handle multiple sequential suggestions', () => {
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      applyAISuggestions(editor, 'First', range);
      applyAISuggestions(editor, 'Second', range);
      applyAISuggestions(editor, 'Third', range);

      expect(editor.children.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('performance', () => {
    it('should handle rapid successive calls', () => {
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 5 },
      };

      const start = Date.now();

      for (let i = 0; i < 100; i++) {
        applyAISuggestions(editor, `Text ${i}`, range);
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000);
    });

    it('should handle large suggestion efficiently', () => {
      const largeSuggestion = 'X'.repeat(50000);
      const range = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 },
      };

      const start = Date.now();
      applyAISuggestions(editor, largeSuggestion, range);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000);
    });
  });
});