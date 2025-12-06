import { createSlateEditor, KEYS } from 'platejs';

import { listToMdastTree } from '../listToMdastTree';
import type { SerializeMdOptions } from '../serializeMd';

const createEditor = () => createSlateEditor({ plugins: [] });

describe('listToMdastTree', () => {
  describe('List Style Type Handling', () => {
    it('should create ordered list for decimal style', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'First item' }],
          indent: 1,
          listStart: 1,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.type).toBe('list');
      expect(result.ordered).toBe(true);
      expect(result.start).toBe(1);
      expect(result.children).toHaveLength(1);
    });

    it('should create unordered list for non-decimal style', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Bullet item' }],
          indent: 1,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.type).toBe('list');
      expect(result.ordered).toBe(false);
    });

    it('should handle consecutive lists of same type at same indent level', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Item 1' }],
          indent: 1,
          listStart: 1,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Item 2' }],
          indent: 1,
          listStart: 2,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Item 3' }],
          indent: 1,
          listStart: 3,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.type).toBe('list');
      expect(result.children).toHaveLength(3);
      expect(result.ordered).toBe(true);
    });

    it('should handle mixed list types in same call', () => {
      const editor = createEditor();
      // Note: In real usage, convertNodesSerialize would split these
      // but listToMdastTree should handle if called directly
      const nodes = [
        {
          children: [{ text: 'Ordered 1' }],
          indent: 1,
          listStart: 1,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Ordered 2' }],
          indent: 1,
          listStart: 2,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      // Should create a single list from all items of the same type at root level
      expect(result.type).toBe('list');
      expect(result.children).toHaveLength(2);
    });
  });

  describe('Nested Lists', () => {
    it('should handle nested list with higher indent', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Parent item' }],
          indent: 1,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Nested item' }],
          indent: 2,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.type).toBe('list');
      expect(result.children).toHaveLength(1);
      expect(result.children[0].children).toHaveLength(2); // paragraph + nested list
      expect(result.children[0].children[1].type).toBe('list');
    });

    it('should handle multiple nested levels', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Level 1' }],
          indent: 1,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Level 2' }],
          indent: 2,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Level 3' }],
          indent: 3,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.type).toBe('list');
      expect(result.children).toHaveLength(1);
      
      // First level item should have nested list
      const level1Item = result.children[0];
      expect(level1Item.children[1].type).toBe('list');
      
      // Second level item should have nested list
      const level2Item = level1Item.children[1].children[0];
      expect(level2Item.children[1].type).toBe('list');
    });

    it('should handle return to previous indent level', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Item 1' }],
          indent: 1,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Nested item' }],
          indent: 2,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Item 2' }],
          indent: 1,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.type).toBe('list');
      expect(result.children).toHaveLength(2); // Two root-level items
    });

    it('should handle mixed ordered and unordered nested lists', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Ordered parent' }],
          indent: 1,
          listStart: 1,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Unordered child' }],
          indent: 2,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.ordered).toBe(true); // Parent is ordered
      expect(result.children[0].children[1].ordered).toBe(false); // Child is unordered
    });
  });

  describe('Todo Lists', () => {
    it('should handle todo list with checked property', () => {
      const editor = createEditor();
      const nodes = [
        {
          checked: true,
          children: [{ text: 'Completed task' }],
          indent: 1,
          listStyleType: 'todo' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.children[0].checked).toBe(true);
    });

    it('should handle todo list with unchecked property', () => {
      const editor = createEditor();
      const nodes = [
        {
          checked: false,
          children: [{ text: 'Pending task' }],
          indent: 1,
          listStyleType: 'todo' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.children[0].checked).toBe(false);
    });

    it('should handle todo list without checked property', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Task without state' }],
          indent: 1,
          listStyleType: 'todo' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.children[0].checked).toBe(null);
    });
  });

  describe('Spread Option', () => {
    it('should apply spread to list when enabled', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Item 1' }],
          indent: 1,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
        spread: true,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.spread).toBe(true);
      expect(result.children[0].spread).toBe(true);
    });

    it('should not apply spread when disabled', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Item 1' }],
          indent: 1,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
        spread: false,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.spread).toBe(false);
    });
  });

  describe('Block ID Handling', () => {
    it('should wrap list items with block IDs when enabled', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Item 1' }],
          id: 'block-1',
          indent: 1,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Item 2' }],
          id: 'block-2',
          indent: 1,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
        withBlockId: true,
      };

      const result = listToMdastTree(nodes as any, options, true);

      expect(result.type).toBe('fragment');
      expect(result.children).toHaveLength(2);
    });

    it('should preserve list numbering with block IDs', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'First' }],
          id: 'id-1',
          indent: 1,
          listStart: 1,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Second' }],
          id: 'id-2',
          indent: 1,
          listStart: 2,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Third' }],
          id: 'id-3',
          indent: 1,
          listStart: 3,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
        withBlockId: true,
      };

      const result = listToMdastTree(nodes as any, options, true);

      expect(result.type).toBe('fragment');
      // Each wrapped list should have correct start number
      expect(result.children[0].start).toBe(1);
      expect(result.children[1].start).toBe(2);
      expect(result.children[2].start).toBe(3);
    });

    it('should not wrap when withBlockId is false', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Item' }],
          id: 'block-1',
          indent: 1,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
        withBlockId: false,
      };

      const result = listToMdastTree(nodes as any, options, true);

      expect(result.type).toBe('list');
    });

    it('should not wrap when isBlock is false', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Item' }],
          id: 'block-1',
          indent: 1,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
        withBlockId: true,
      };

      const result = listToMdastTree(nodes as any, options, false);

      expect(result.type).toBe('list');
    });

    it('should not wrap when no nodes have IDs', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Item' }],
          indent: 1,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
        withBlockId: true,
      };

      const result = listToMdastTree(nodes as any, options, true);

      expect(result.type).toBe('list');
    });
  });

  describe('Edge Cases', () => {
    it('should throw error for empty nodes array', () => {
      const editor = createEditor();
      const nodes: any[] = [];

      const options: SerializeMdOptions = {
        editor,
      };

      expect(() => listToMdastTree(nodes, options)).toThrow('Cannot create a list from empty nodes');
    });

    it('should handle single item list', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Only item' }],
          indent: 1,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.children).toHaveLength(1);
    });

    it('should handle listStart with non-1 value', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Item 5' }],
          indent: 1,
          listStart: 5,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.start).toBe(5);
    });

    it('should handle empty text content', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: '' }],
          indent: 1,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.children).toHaveLength(1);
    });

    it('should handle complex child content', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [
            { text: 'Text with ' },
            { bold: true, text: 'bold' },
            { text: ' and ' },
            { italic: true, text: 'italic' },
          ],
          indent: 1,
          listStyleType: 'disc' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.children).toHaveLength(1);
      expect(result.children[0].children[0].type).toBe('paragraph');
    });
  });

  describe('List Start Property', () => {
    it('should preserve listStart for ordered lists', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Item at 10' }],
          indent: 1,
          listStart: 10,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.start).toBe(10);
    });

    it('should use first node listStart for root list', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'First' }],
          indent: 1,
          listStart: 1,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Second' }],
          indent: 1,
          listStart: 2,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      expect(result.start).toBe(1); // Uses first node's listStart
    });

    it('should preserve listStart for nested ordered lists', () => {
      const editor = createEditor();
      const nodes = [
        {
          children: [{ text: 'Parent' }],
          indent: 1,
          listStart: 1,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
        {
          children: [{ text: 'Nested' }],
          indent: 2,
          listStart: 5,
          listStyleType: 'decimal' as const,
          type: KEYS.p,
        },
      ];

      const options: SerializeMdOptions = {
        editor,
      };

      const result = listToMdastTree(nodes as any, options);

      const nestedList = result.children[0].children[1];
      expect(nestedList.start).toBe(5);
    });
  });
});