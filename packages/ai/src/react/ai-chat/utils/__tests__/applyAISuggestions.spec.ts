/** @jsx jsx */
import { jsx } from '@platejs/test-utils';
import { createPlateEditor } from '@udecode/plate-core';
import { describe, expect, it } from 'bun:test';
import { applyAISuggestions } from '../applyAISuggestions';

jsx; // Required

describe('applyAISuggestions', () => {
  describe('Basic Functionality', () => {
    it('should apply simple text suggestions', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Original text' }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'replace',
          path: [0, 0],
          newText: 'Updated text',
        },
      ];

      applyAISuggestions(editor, suggestions);

      expect(editor.children[0].children[0].text).toBe('Updated text');
    });

    it('should handle empty suggestions array', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Original text' }],
          },
        ],
      });

      const originalValue = JSON.stringify(editor.children);
      applyAISuggestions(editor, []);

      expect(JSON.stringify(editor.children)).toBe(originalValue);
    });

    it('should handle null or undefined suggestions', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Original text' }],
          },
        ],
      });

      expect(() =>
        applyAISuggestions(editor, null as any)
      ).not.toThrow();
      expect(() =>
        applyAISuggestions(editor, undefined as any)
      ).not.toThrow();
    });
  });

  describe('Multiple Suggestions', () => {
    it('should apply multiple suggestions in order', () => {
      const editor = createPlateEditor({
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

      const suggestions = [
        {
          type: 'replace',
          path: [0, 0],
          newText: 'Updated first',
        },
        {
          type: 'replace',
          path: [1, 0],
          newText: 'Updated second',
        },
      ];

      applyAISuggestions(editor, suggestions);

      expect(editor.children[0].children[0].text).toBe('Updated first');
      expect(editor.children[1].children[0].text).toBe('Updated second');
    });

    it('should handle suggestions with different types', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Text to modify' }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'insert',
          path: [0],
          newNode: { type: 'p', children: [{ text: 'New paragraph' }] },
        },
        {
          type: 'format',
          path: [0, 0],
          marks: { bold: true },
        },
      ];

      applyAISuggestions(editor, suggestions);

      expect(editor.children).toHaveLength(2);
    });
  });

  describe('Path Resolution', () => {
    it('should handle deep nested paths', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'ul',
            children: [
              {
                type: 'li',
                children: [
                  {
                    type: 'lic',
                    children: [{ text: 'Nested item' }],
                  },
                ],
              },
            ],
          },
        ],
      });

      const suggestions = [
        {
          type: 'replace',
          path: [0, 0, 0, 0],
          newText: 'Updated nested item',
        },
      ];

      applyAISuggestions(editor, suggestions);

      expect(editor.children[0].children[0].children[0].children[0].text).toBe(
        'Updated nested item'
      );
    });

    it('should handle invalid paths gracefully', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Valid text' }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'replace',
          path: [99, 99],
          newText: 'Should not apply',
        },
      ];

      expect(() =>
        applyAISuggestions(editor, suggestions)
      ).not.toThrow();
      expect(editor.children[0].children[0].text).toBe('Valid text');
    });

    it('should handle empty path array', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Text' }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'replace',
          path: [],
          newText: 'New text',
        },
      ];

      expect(() =>
        applyAISuggestions(editor, suggestions)
      ).not.toThrow();
    });
  });

  describe('Text Formatting', () => {
    it('should apply bold formatting', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Text to format' }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'format',
          path: [0, 0],
          marks: { bold: true },
        },
      ];

      applyAISuggestions(editor, suggestions);

      expect(editor.children[0].children[0].bold).toBe(true);
    });

    it('should apply multiple marks simultaneously', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Text' }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'format',
          path: [0, 0],
          marks: { bold: true, italic: true, underline: true },
        },
      ];

      applyAISuggestions(editor, suggestions);

      const textNode = editor.children[0].children[0];
      expect(textNode.bold).toBe(true);
      expect(textNode.italic).toBe(true);
      expect(textNode.underline).toBe(true);
    });

    it('should remove formatting marks', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Bold text', bold: true }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'format',
          path: [0, 0],
          marks: { bold: false },
        },
      ];

      applyAISuggestions(editor, suggestions);

      expect(editor.children[0].children[0].bold).toBeUndefined();
    });
  });

  describe('Node Insertion and Deletion', () => {
    it('should insert new nodes', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Existing' }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'insert',
          path: [1],
          newNode: { type: 'p', children: [{ text: 'Inserted' }] },
        },
      ];

      applyAISuggestions(editor, suggestions);

      expect(editor.children).toHaveLength(2);
      expect(editor.children[1].children[0].text).toBe('Inserted');
    });

    it('should delete nodes', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'First' }],
          },
          {
            type: 'p',
            children: [{ text: 'To delete' }],
          },
          {
            type: 'p',
            children: [{ text: 'Third' }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'delete',
          path: [1],
        },
      ];

      applyAISuggestions(editor, suggestions);

      expect(editor.children).toHaveLength(2);
      expect(editor.children[1].children[0].text).toBe('Third');
    });

    it('should handle inserting multiple nodes', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Start' }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'insert',
          path: [1],
          newNode: { type: 'p', children: [{ text: 'First insert' }] },
        },
        {
          type: 'insert',
          path: [2],
          newNode: { type: 'p', children: [{ text: 'Second insert' }] },
        },
      ];

      applyAISuggestions(editor, suggestions);

      expect(editor.children).toHaveLength(3);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle mixed suggestion types', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Original' }],
          },
          {
            type: 'p',
            children: [{ text: 'To format' }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'replace',
          path: [0, 0],
          newText: 'Updated',
        },
        {
          type: 'format',
          path: [1, 0],
          marks: { bold: true },
        },
        {
          type: 'insert',
          path: [2],
          newNode: { type: 'p', children: [{ text: 'New' }] },
        },
      ];

      applyAISuggestions(editor, suggestions);

      expect(editor.children[0].children[0].text).toBe('Updated');
      expect(editor.children[1].children[0].bold).toBe(true);
      expect(editor.children[2].children[0].text).toBe('New');
    });

    it('should maintain editor consistency', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Test' }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'replace',
          path: [0, 0],
          newText: 'Modified',
        },
      ];

      applyAISuggestions(editor, suggestions);

      // Ensure editor is still in valid state
      expect(editor.children).toBeDefined();
      expect(editor.children[0]).toBeDefined();
      expect(editor.children[0].children).toBeDefined();
      expect(editor.children[0].children[0].text).toBe('Modified');
    });

    it('should handle suggestions with special characters', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Text' }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'replace',
          path: [0, 0],
          newText: 'Special: <>&"\'`',
        },
      ];

      applyAISuggestions(editor, suggestions);

      expect(editor.children[0].children[0].text).toBe('Special: <>&"\'`');
    });
  });

  describe('Edge Cases', () => {
    it('should handle suggestions on empty editor', () => {
      const editor = createPlateEditor({
        value: [],
      });

      const suggestions = [
        {
          type: 'insert',
          path: [0],
          newNode: { type: 'p', children: [{ text: 'New content' }] },
        },
      ];

      applyAISuggestions(editor, suggestions);

      expect(editor.children).toHaveLength(1);
      expect(editor.children[0].children[0].text).toBe('New content');
    });

    it('should handle malformed suggestion objects', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Text' }],
          },
        ],
      });

      const suggestions = [
        {} as any,
        { type: 'unknown' } as any,
        { type: 'replace' } as any, // Missing required fields
      ];

      expect(() =>
        applyAISuggestions(editor, suggestions)
      ).not.toThrow();
    });

    it('should handle concurrent path conflicts', () => {
      const editor = createPlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: 'Text' }],
          },
        ],
      });

      const suggestions = [
        {
          type: 'delete',
          path: [0],
        },
        {
          type: 'replace',
          path: [0, 0],
          newText: 'Should not apply',
        },
      ];

      expect(() =>
        applyAISuggestions(editor, suggestions)
      ).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should handle large number of suggestions efficiently', () => {
      const editor = createPlateEditor({
        value: Array.from({ length: 100 }, (_, i) => ({
          type: 'p',
          children: [{ text: `Paragraph ${i}` }],
        })),
      });

      const suggestions = Array.from({ length: 100 }, (_, i) => ({
        type: 'replace',
        path: [i, 0],
        newText: `Updated ${i}`,
      }));

      const startTime = Date.now();
      applyAISuggestions(editor, suggestions);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
      expect(editor.children[0].children[0].text).toBe('Updated 0');
      expect(editor.children[99].children[0].text).toBe('Updated 99');
    });
  });
});