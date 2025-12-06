/** @jsx jsx */

import type { SlateEditor } from '@udecode/plate-core';

import { createPlateEditor } from '@udecode/plate-core/react';
import { jsx } from '@udecode/plate-test-utils';

import { convertNodesSerialize } from '../convertNodesSerialize';

jsx;

describe('convertNodesSerialize', () => {
  let editor: SlateEditor;

  beforeEach(() => {
    editor = createPlateEditor();
  });

  describe('basic text nodes', () => {
    it('should serialize plain text', () => {
      const nodes = [{ text: 'Plain text' }];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should serialize empty text', () => {
      const nodes = [{ text: '' }];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should serialize text with whitespace', () => {
      const nodes = [{ text: '  spaces  ' }];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });
  });

  describe('formatted text nodes', () => {
    it('should serialize bold text', () => {
      const nodes = [{ text: 'Bold', bold: true }];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should serialize italic text', () => {
      const nodes = [{ text: 'Italic', italic: true }];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize underlined text', () => {
      const nodes = [{ text: 'Underline', underline: true }];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize strikethrough text', () => {
      const nodes = [{ text: 'Strikethrough', strikethrough: true }];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize code text', () => {
      const nodes = [{ text: 'code', code: true }];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize text with multiple marks', () => {
      const nodes = [{ text: 'Multiple', bold: true, italic: true }];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });
  });

  describe('paragraph nodes', () => {
    it('should serialize simple paragraph', () => {
      const nodes = [
        {
          type: 'p',
          children: [{ text: 'Paragraph text' }],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should serialize multiple paragraphs', () => {
      const nodes = [
        {
          type: 'p',
          children: [{ text: 'First' }],
        },
        {
          type: 'p',
          children: [{ text: 'Second' }],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('should serialize paragraph with formatted text', () => {
      const nodes = [
        {
          type: 'p',
          children: [
            { text: 'Plain ' },
            { text: 'bold', bold: true },
            { text: ' text' },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });
  });

  describe('heading nodes', () => {
    it('should serialize h1', () => {
      const nodes = [
        {
          type: 'h1',
          children: [{ text: 'Heading 1' }],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize h2', () => {
      const nodes = [
        {
          type: 'h2',
          children: [{ text: 'Heading 2' }],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize h3', () => {
      const nodes = [
        {
          type: 'h3',
          children: [{ text: 'Heading 3' }],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize all heading levels', () => {
      const nodes = [
        { type: 'h1', children: [{ text: 'H1' }] },
        { type: 'h2', children: [{ text: 'H2' }] },
        { type: 'h3', children: [{ text: 'H3' }] },
        { type: 'h4', children: [{ text: 'H4' }] },
        { type: 'h5', children: [{ text: 'H5' }] },
        { type: 'h6', children: [{ text: 'H6' }] },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('list nodes', () => {
    it('should serialize unordered list', () => {
      const nodes = [
        {
          type: 'ul',
          children: [
            {
              type: 'li',
              children: [{ text: 'Item 1' }],
            },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize ordered list', () => {
      const nodes = [
        {
          type: 'ol',
          children: [
            {
              type: 'li',
              children: [{ text: 'Item 1' }],
            },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize nested lists', () => {
      const nodes = [
        {
          type: 'ul',
          children: [
            {
              type: 'li',
              children: [
                { text: 'Item 1' },
                {
                  type: 'ul',
                  children: [
                    {
                      type: 'li',
                      children: [{ text: 'Nested' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize multiple list items', () => {
      const nodes = [
        {
          type: 'ul',
          children: [
            { type: 'li', children: [{ text: 'Item 1' }] },
            { type: 'li', children: [{ text: 'Item 2' }] },
            { type: 'li', children: [{ text: 'Item 3' }] },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });
  });

  describe('blockquote nodes', () => {
    it('should serialize simple blockquote', () => {
      const nodes = [
        {
          type: 'blockquote',
          children: [
            {
              type: 'p',
              children: [{ text: 'Quote' }],
            },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize blockquote with multiple paragraphs', () => {
      const nodes = [
        {
          type: 'blockquote',
          children: [
            { type: 'p', children: [{ text: 'First' }] },
            { type: 'p', children: [{ text: 'Second' }] },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });
  });

  describe('code block nodes', () => {
    it('should serialize code block', () => {
      const nodes = [
        {
          type: 'code_block',
          children: [
            {
              type: 'code_line',
              children: [{ text: 'const x = 1;' }],
            },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize code block with language', () => {
      const nodes = [
        {
          type: 'code_block',
          lang: 'javascript',
          children: [
            {
              type: 'code_line',
              children: [{ text: 'const x = 1;' }],
            },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize multi-line code block', () => {
      const nodes = [
        {
          type: 'code_block',
          children: [
            { type: 'code_line', children: [{ text: 'line 1' }] },
            { type: 'code_line', children: [{ text: 'line 2' }] },
            { type: 'code_line', children: [{ text: 'line 3' }] },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });
  });

  describe('link nodes', () => {
    it('should serialize link', () => {
      const nodes = [
        {
          type: 'a',
          url: 'https://example.com',
          children: [{ text: 'Link' }],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize link with formatted text', () => {
      const nodes = [
        {
          type: 'a',
          url: 'https://example.com',
          children: [{ text: 'Bold Link', bold: true }],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });
  });

  describe('image nodes', () => {
    it('should serialize image', () => {
      const nodes = [
        {
          type: 'img',
          url: 'https://example.com/image.png',
          children: [{ text: '' }],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize image with alt text', () => {
      const nodes = [
        {
          type: 'img',
          url: 'https://example.com/image.png',
          alt: 'Alt text',
          children: [{ text: '' }],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });
  });

  describe('table nodes', () => {
    it('should serialize table', () => {
      const nodes = [
        {
          type: 'table',
          children: [
            {
              type: 'tr',
              children: [
                {
                  type: 'td',
                  children: [{ text: 'Cell' }],
                },
              ],
            },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should serialize complex table', () => {
      const nodes = [
        {
          type: 'table',
          children: [
            {
              type: 'tr',
              children: [
                { type: 'th', children: [{ text: 'H1' }] },
                { type: 'th', children: [{ text: 'H2' }] },
              ],
            },
            {
              type: 'tr',
              children: [
                { type: 'td', children: [{ text: 'D1' }] },
                { type: 'td', children: [{ text: 'D2' }] },
              ],
            },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });
  });

  describe('horizontal rule', () => {
    it('should serialize hr', () => {
      const nodes = [
        {
          type: 'hr',
          children: [{ text: '' }],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });
  });

  describe('mixed content', () => {
    it('should serialize document with various node types', () => {
      const nodes = [
        { type: 'h1', children: [{ text: 'Title' }] },
        { type: 'p', children: [{ text: 'Paragraph' }] },
        {
          type: 'ul',
          children: [
            { type: 'li', children: [{ text: 'Item' }] },
          ],
        },
        {
          type: 'blockquote',
          children: [
            { type: 'p', children: [{ text: 'Quote' }] },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should serialize nested structures', () => {
      const nodes = [
        {
          type: 'blockquote',
          children: [
            {
              type: 'ul',
              children: [
                {
                  type: 'li',
                  children: [{ text: 'Nested item' }],
                },
              ],
            },
          ],
        },
      ];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const nodes: any[] = [];

      const result = convertNodesSerialize(editor, nodes);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle nodes without children', () => {
      const nodes = [
        {
          type: 'p',
        } as any,
      ];

      expect(() => {
        convertNodesSerialize(editor, nodes);
      }).not.toThrow();
    });

    it('should handle unknown node types', () => {
      const nodes = [
        {
          type: 'unknown',
          children: [{ text: 'text' }],
        } as any,
      ];

      expect(() => {
        convertNodesSerialize(editor, nodes);
      }).not.toThrow();
    });

    it('should handle null text values', () => {
      const nodes = [
        {
          text: null as any,
        },
      ];

      expect(() => {
        convertNodesSerialize(editor, nodes as any);
      }).not.toThrow();
    });

    it('should handle undefined text values', () => {
      const nodes = [
        {
          text: undefined as any,
        },
      ];

      expect(() => {
        convertNodesSerialize(editor, nodes as any);
      }).not.toThrow();
    });
  });

  describe('special characters', () => {
    it('should handle text with special markdown characters', () => {
      const nodes = [{ text: '**bold** *italic* `code`' }];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should handle text with backslashes', () => {
      const nodes = [{ text: 'Path\\to\\file' }];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });

    it('should handle text with unicode', () => {
      const nodes = [{ text: '你好 世界 🌍' }];

      const result = convertNodesSerialize(editor, nodes as any);

      expect(result).toBeDefined();
    });
  });

  describe('performance', () => {
    it('should handle large documents efficiently', () => {
      const nodes = Array.from({ length: 1000 }, (_, i) => ({
        type: 'p',
        children: [{ text: `Paragraph ${i}` }],
      }));

      const start = Date.now();
      const result = convertNodesSerialize(editor, nodes as any);
      const duration = Date.now() - start;

      expect(result).toBeDefined();
      expect(duration).toBeLessThan(5000);
    });

    it('should handle deeply nested structures', () => {
      let node: any = { text: 'Deep text' };

      for (let i = 0; i < 50; i++) {
        node = {
          type: 'blockquote',
          children: [
            {
              type: 'p',
              children: [node],
            },
          ],
        };
      }

      expect(() => {
        convertNodesSerialize(editor, [node]);
      }).not.toThrow();
    });
  });
});