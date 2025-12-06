/** @jsx jsx */

import type { SlateEditor } from '@udecode/plate-core';

import { createPlateEditor } from '@udecode/plate-core/react';
import { jsx } from '@udecode/plate-test-utils';

import { listToMdastTree } from '../listToMdastTree';

jsx;

describe('listToMdastTree', () => {
  let editor: SlateEditor;

  beforeEach(() => {
    editor = createPlateEditor();
  });

  describe('unordered lists', () => {
    it('should convert simple unordered list', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              {
                type: 'lic',
                children: [{ text: 'Item 1' }],
              },
            ],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
      expect(result.type).toBe('list');
      expect(result.ordered).toBe(false);
    });

    it('should convert unordered list with multiple items', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: 'Item 1' }] }],
          },
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: 'Item 2' }] }],
          },
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: 'Item 3' }] }],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
      expect(result.children.length).toBe(3);
    });

    it('should handle unordered list items with formatted text', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              {
                type: 'lic',
                children: [
                  { text: 'Plain ' },
                  { text: 'bold', bold: true },
                  { text: ' text' },
                ],
              },
            ],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });
  });

  describe('ordered lists', () => {
    it('should convert simple ordered list', () => {
      const listNode = {
        type: 'ol',
        children: [
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: 'Item 1' }] }],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
      expect(result.type).toBe('list');
      expect(result.ordered).toBe(true);
    });

    it('should convert ordered list with multiple items', () => {
      const listNode = {
        type: 'ol',
        children: [
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: 'First' }] }],
          },
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: 'Second' }] }],
          },
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: 'Third' }] }],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
      expect(result.children.length).toBe(3);
      expect(result.ordered).toBe(true);
    });
  });

  describe('nested lists', () => {
    it('should convert nested unordered lists', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              { type: 'lic', children: [{ text: 'Item 1' }] },
              {
                type: 'ul',
                children: [
                  {
                    type: 'li',
                    children: [{ type: 'lic', children: [{ text: 'Nested 1' }] }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
      expect(result.children.length).toBeGreaterThan(0);
    });

    it('should convert nested ordered lists', () => {
      const listNode = {
        type: 'ol',
        children: [
          {
            type: 'li',
            children: [
              { type: 'lic', children: [{ text: 'Item 1' }] },
              {
                type: 'ol',
                children: [
                  {
                    type: 'li',
                    children: [{ type: 'lic', children: [{ text: 'Nested 1' }] }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });

    it('should convert mixed nested lists (ul in ol)', () => {
      const listNode = {
        type: 'ol',
        children: [
          {
            type: 'li',
            children: [
              { type: 'lic', children: [{ text: 'Ordered' }] },
              {
                type: 'ul',
                children: [
                  {
                    type: 'li',
                    children: [{ type: 'lic', children: [{ text: 'Unordered nested' }] }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });

    it('should convert mixed nested lists (ol in ul)', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              { type: 'lic', children: [{ text: 'Unordered' }] },
              {
                type: 'ol',
                children: [
                  {
                    type: 'li',
                    children: [{ type: 'lic', children: [{ text: 'Ordered nested' }] }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });

    it('should handle deeply nested lists', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              { type: 'lic', children: [{ text: 'Level 1' }] },
              {
                type: 'ul',
                children: [
                  {
                    type: 'li',
                    children: [
                      { type: 'lic', children: [{ text: 'Level 2' }] },
                      {
                        type: 'ul',
                        children: [
                          {
                            type: 'li',
                            children: [
                              { type: 'lic', children: [{ text: 'Level 3' }] },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });
  });

  describe('list items with multiple paragraphs', () => {
    it('should handle list item with multiple paragraph children', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              { type: 'lic', children: [{ text: 'First paragraph' }] },
              { type: 'p', children: [{ text: 'Second paragraph' }] },
            ],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });

    it('should handle list item with mixed content', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              { type: 'lic', children: [{ text: 'Text' }] },
              { type: 'p', children: [{ text: 'Paragraph' }] },
              {
                type: 'blockquote',
                children: [{ type: 'p', children: [{ text: 'Quote' }] }],
              },
            ],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });
  });

  describe('empty lists and items', () => {
    it('should handle empty list', () => {
      const listNode = {
        type: 'ul',
        children: [],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
      expect(result.children.length).toBe(0);
    });

    it('should handle list with empty item', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: '' }] }],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });

    it('should handle list items with only whitespace', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: '   ' }] }],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });
  });

  describe('list spread property', () => {
    it('should set spread correctly for single-line items', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: 'Item' }] }],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
      expect(typeof result.spread).toBe('boolean');
    });

    it('should set spread correctly for multi-line items', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              { type: 'lic', children: [{ text: 'Line 1' }] },
              { type: 'p', children: [{ text: 'Line 2' }] },
            ],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle list item without lic', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ text: 'Direct text' }],
          },
        ],
      };

      expect(() => {
        listToMdastTree(editor, listNode as any);
      }).not.toThrow();
    });

    it('should handle malformed list structure', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'not-li',
            children: [{ text: 'Text' }],
          } as any,
        ],
      };

      expect(() => {
        listToMdastTree(editor, listNode as any);
      }).not.toThrow();
    });

    it('should handle null children', () => {
      const listNode = {
        type: 'ul',
        children: null as any,
      };

      expect(() => {
        listToMdastTree(editor, listNode as any);
      }).not.toThrow();
    });

    it('should handle undefined children', () => {
      const listNode = {
        type: 'ul',
        children: undefined as any,
      };

      expect(() => {
        listToMdastTree(editor, listNode as any);
      }).not.toThrow();
    });
  });

  describe('special characters in list items', () => {
    it('should handle items with markdown special characters', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: '**bold** *italic*' }] }],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });

    it('should handle items with unicode', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: '你好 🌍' }] }],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });

    it('should handle items with special punctuation', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: 'Item: with, punctuation!' }] }],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });
  });

  describe('complex list structures', () => {
    it('should handle list with multiple nested levels and mixed types', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              { type: 'lic', children: [{ text: 'Main 1' }] },
              {
                type: 'ol',
                children: [
                  {
                    type: 'li',
                    children: [
                      { type: 'lic', children: [{ text: 'Sub 1.1' }] },
                      {
                        type: 'ul',
                        children: [
                          {
                            type: 'li',
                            children: [{ type: 'lic', children: [{ text: 'Sub 1.1.1' }] }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: 'Main 2' }] }],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
      expect(result.children.length).toBe(2);
    });

    it('should handle list items with all content types', () => {
      const listNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              { type: 'lic', children: [{ text: 'Text' }] },
              { type: 'p', children: [{ text: 'Paragraph' }] },
              {
                type: 'code_block',
                children: [{ type: 'code_line', children: [{ text: 'code' }] }],
              },
              {
                type: 'blockquote',
                children: [{ type: 'p', children: [{ text: 'quote' }] }],
              },
            ],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
    });
  });

  describe('performance', () => {
    it('should handle large lists efficiently', () => {
      const children = Array.from({ length: 1000 }, (_, i) => ({
        type: 'li',
        children: [{ type: 'lic', children: [{ text: `Item ${i}` }] }],
      }));

      const listNode = {
        type: 'ul',
        children,
      };

      const start = Date.now();
      const result = listToMdastTree(editor, listNode as any);
      const duration = Date.now() - start;

      expect(result).toBeDefined();
      expect(result.children.length).toBe(1000);
      expect(duration).toBeLessThan(5000);
    });

    it('should handle deeply nested lists without stack overflow', () => {
      let listNode: any = {
        type: 'li',
        children: [{ type: 'lic', children: [{ text: 'Deep' }] }],
      };

      for (let i = 0; i < 50; i++) {
        listNode = {
          type: 'ul',
          children: [
            {
              type: 'li',
              children: [
                { type: 'lic', children: [{ text: `Level ${i}` }] },
                listNode,
              ],
            },
          ],
        };
      }

      expect(() => {
        listToMdastTree(editor, listNode);
      }).not.toThrow();
    });
  });

  describe('list start property', () => {
    it('should preserve start property for ordered lists', () => {
      const listNode = {
        type: 'ol',
        start: 5,
        children: [
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: 'Item 5' }] }],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
      expect(result.start).toBe(5);
    });

    it('should handle default start for ordered lists', () => {
      const listNode = {
        type: 'ol',
        children: [
          {
            type: 'li',
            children: [{ type: 'lic', children: [{ text: 'Item 1' }] }],
          },
        ],
      };

      const result = listToMdastTree(editor, listNode as any);

      expect(result).toBeDefined();
      expect(result.start).toBeDefined();
    });
  });
});