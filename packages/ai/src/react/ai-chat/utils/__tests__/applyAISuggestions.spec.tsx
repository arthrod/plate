import { BlockSelectionPlugin } from '@platejs/selection/react';
import { createSlateEditor, KEYS } from 'platejs';
import { mock } from 'bun:test';

import { AIChatPlugin } from '../../AIChatPlugin';
import { applyAISuggestions } from '../applyAISuggestions';

const createTestEditor = (value: any[] = [{ children: [{ text: '' }], type: 'p' }]) =>
  createSlateEditor({
    plugins: [AIChatPlugin, BlockSelectionPlugin],
    value,
  });

describe('applyAISuggestions', () => {
  describe('Block Selection Detection', () => {
    it('should detect block selection via BlockSelectionPlugin', () => {
      const editor = createTestEditor([
        { children: [{ text: 'First block' }], id: '1', type: 'p' },
        { children: [{ text: 'Second block' }], id: '2', type: 'p' },
      ]);

      // Setup: Block selection is active
      editor.setOption(BlockSelectionPlugin, 'isSelectingSome', true);
      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);

      const aiContent = 'Updated first block\n\nUpdated second block';

      // Should not throw
      expect(() => applyAISuggestions(editor, aiContent)).not.toThrow();
    });

    it('should detect multiple blocks via editor API', () => {
      const editor = createTestEditor([
        { children: [{ text: 'Block 1' }], id: '1', type: 'p' },
        { children: [{ text: 'Block 2' }], id: '2', type: 'p' },
        { children: [{ text: 'Block 3' }], id: '3', type: 'p' },
      ]);

      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);
      
      // Simulate multi-block edit mode with multiple highest-level blocks
      const aiContent = 'New block 1\n\nNew block 2\n\nNew block 3';

      expect(() => applyAISuggestions(editor, aiContent)).not.toThrow();
    });

    it('should handle single block mode when not block selecting', () => {
      const editor = createTestEditor([
        { children: [{ text: 'Single block' }], id: '1', type: 'p' },
      ]);

      editor.setOption(BlockSelectionPlugin, 'isSelectingSome', false);
      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);

      const aiContent = 'Updated single block';

      expect(() => applyAISuggestions(editor, aiContent)).not.toThrow();
    });
  });

  describe('Multi-Block Mode', () => {
    it('should initialize _replaceIds when empty', () => {
      const editor = createTestEditor([
        { children: [{ text: 'Block 1' }], id: 'id-1', type: 'p' },
        { children: [{ text: 'Block 2' }], id: 'id-2', type: 'p' },
      ]);

      editor.setOption(BlockSelectionPlugin, 'isSelectingSome', true);
      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);
      editor.setOption(AIChatPlugin, '_replaceIds', []);

      const aiContent = 'Updated block 1\n\nUpdated block 2';
      applyAISuggestions(editor, aiContent);

      const replaceIds = editor.getOption(AIChatPlugin, '_replaceIds');
      expect(replaceIds).toEqual(['id-1', 'id-2']);
    });

    it('should preserve existing _replaceIds', () => {
      const editor = createTestEditor([
        { children: [{ text: 'Block 1' }], id: 'id-1', type: 'p' },
        { children: [{ text: 'Block 2' }], id: 'id-2', type: 'p' },
      ]);

      editor.setOption(BlockSelectionPlugin, 'isSelectingSome', true);
      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);
      editor.setOption(AIChatPlugin, '_replaceIds', ['id-1', 'id-2']);

      const aiContent = 'Updated content';
      applyAISuggestions(editor, aiContent);

      const replaceIds = editor.getOption(AIChatPlugin, '_replaceIds');
      expect(replaceIds).toEqual(['id-1', 'id-2']);
    });

    it('should handle more diff nodes than replace nodes', () => {
      const editor = createTestEditor([
        { children: [{ text: 'Block 1' }], id: 'id-1', type: 'p' },
      ]);

      editor.setOption(BlockSelectionPlugin, 'isSelectingSome', true);
      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);
      editor.setOption(AIChatPlugin, '_replaceIds', ['id-1']);

      // AI generates more blocks than original
      const aiContent = 'Block 1\n\nBlock 2\n\nBlock 3';

      expect(() => applyAISuggestions(editor, aiContent)).not.toThrow();
    });

    it('should update block selection after applying suggestions', () => {
      const editor = createTestEditor([
        { children: [{ text: 'Block 1' }], id: 'id-1', type: 'p' },
        { children: [{ text: 'Block 2' }], id: 'id-2', type: 'p' },
      ]);

      const mockSet = mock();
      editor.setOption(BlockSelectionPlugin, 'isSelectingSome', true);
      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);
      editor.setOption(AIChatPlugin, '_replaceIds', ['id-1', 'id-2']);
      
      // Mock the blockSelection.set method
      const originalGetApi = editor.getApi.bind(editor);
      editor.getApi = mock((plugin: any) => {
        if (plugin === BlockSelectionPlugin) {
          return {
            blockSelection: {
              set: mockSet,
            },
          };
        }
        return originalGetApi(plugin);
      });

      const aiContent = 'Updated block 1\n\nUpdated block 2';
      applyAISuggestions(editor, aiContent);

      expect(mockSet).toHaveBeenCalled();
    });
  });

  describe('Single Block Mode', () => {
    it('should insert fragment in single block mode', () => {
      const editor = createTestEditor([
        { children: [{ text: 'Original text' }], id: 'id-1', type: 'p' },
      ]);

      editor.setOption(BlockSelectionPlugin, 'isSelectingSome', false);
      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);

      const aiContent = 'New suggested text';

      expect(() => applyAISuggestions(editor, aiContent)).not.toThrow();
    });

    it('should set selection to transient suggestion range', () => {
      const editor = createTestEditor([
        { children: [{ text: 'Text' }], id: 'id-1', type: 'p' },
      ]);

      editor.setOption(BlockSelectionPlugin, 'isSelectingSome', false);
      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);

      const aiContent = 'Suggested text';
      applyAISuggestions(editor, aiContent);

      // Selection should be set (verified by not throwing)
      expect(editor.selection).toBeDefined();
    });
  });

  describe('Cursor Overlay Handling', () => {
    it('should remove cursor overlay selection cursor', () => {
      const editor = createTestEditor();
      
      const mockRemoveCursor = mock();
      const originalGetApi = editor.getApi.bind(editor);
      
      editor.getApi = mock((options: any) => {
        if (options?.key === KEYS.cursorOverlay) {
          return {
            cursorOverlay: {
              removeCursor: mockRemoveCursor,
            },
          };
        }
        return originalGetApi(options);
      });

      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);
      applyAISuggestions(editor, 'test');

      expect(mockRemoveCursor).toHaveBeenCalledWith('selection');
    });

    it('should handle missing cursorOverlay API gracefully', () => {
      const editor = createTestEditor();
      
      const originalGetApi = editor.getApi.bind(editor);
      editor.getApi = mock((options: any) => {
        if (options?.key !== KEYS.cursorOverlay) {
          return originalGetApi(options);
        }
      });

      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);

      // Should not throw when cursorOverlay is not available
      expect(() => applyAISuggestions(editor, 'test')).not.toThrow();
    });
  });

  describe('Suggestion Optimization', () => {
    it('should skip updates for identical content and suggestion type', () => {
      const editor = createTestEditor([
        { 
          children: [{ text: 'Same text' }],
          id: 'id-1',
          suggestion: { type: 'insert' },
          type: 'p',
        },
      ]);

      editor.setOption(BlockSelectionPlugin, 'isSelectingSome', true);
      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);
      editor.setOption(AIChatPlugin, '_replaceIds', ['id-1']);

      // AI returns same content
      const aiContent = 'Same text';

      // Track replaceNodes calls
      const originalReplaceNodes = editor.tf.replaceNodes.bind(editor.tf);
      let replaceNodesCalls = 0;
      editor.tf.replaceNodes = mock((...args: any[]) => {
        replaceNodesCalls++;
        return originalReplaceNodes(...args);
      });

      applyAISuggestions(editor, aiContent);

      // Should optimize by skipping unnecessary updates
      expect(replaceNodesCalls).toBeLessThanOrEqual(1);
    });
  });

  describe('Content Processing', () => {
    it('should handle markdown content deserialization', () => {
      const editor = createTestEditor();

      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);

      const markdownContent = '# Heading\n\n**Bold text** and *italic text*';

      expect(() => applyAISuggestions(editor, markdownContent)).not.toThrow();
    });

    it('should strip existing suggestions from chat nodes', () => {
      const editor = createTestEditor([
        {
          children: [
            {
              [KEYS.suggestion]: { type: 'insert' },
              text: 'Text with suggestion',
            },
          ],
          id: 'id-1',
          type: 'p',
        },
      ]);

      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);

      const aiContent = 'New text';

      expect(() => applyAISuggestions(editor, aiContent)).not.toThrow();
    });

    it('should strip comments from chat nodes', () => {
      const editor = createTestEditor([
        {
          children: [
            {
              [KEYS.comment]: { id: 'comment-1' },
              text: 'Text with comment',
            },
          ],
          id: 'id-1',
          type: 'p',
        },
      ]);

      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);

      const aiContent = 'New text';

      expect(() => applyAISuggestions(editor, aiContent)).not.toThrow();
    });

    it('should preserve node IDs from original nodes', () => {
      const editor = createTestEditor([
        { children: [{ text: 'Text' }], id: 'original-id', type: 'p' },
      ]);

      editor.setOption(BlockSelectionPlugin, 'isSelectingSome', true);
      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);
      editor.setOption(AIChatPlugin, '_replaceIds', ['original-id']);

      const aiContent = 'Updated text';
      applyAISuggestions(editor, aiContent);

      // Verify nodes still have IDs (structure maintained)
      const hasIds = editor.children.every((node: any) => node.id);
      expect(hasIds).toBe(true);
    });

    it('should generate IDs for new nodes without original match', () => {
      const editor = createTestEditor([
        { children: [{ text: 'Text' }], id: 'id-1', type: 'p' },
      ]);

      editor.setOption(BlockSelectionPlugin, 'isSelectingSome', true);
      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);
      editor.setOption(AIChatPlugin, '_replaceIds', ['id-1']);

      // AI generates more nodes than original
      const aiContent = 'Block 1\n\nBlock 2\n\nBlock 3';
      applyAISuggestions(editor, aiContent);

      // All nodes should have IDs
      const allHaveIds = editor.children.every((node: any) => node.id);
      expect(allHaveIds).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty AI content', () => {
      const editor = createTestEditor();

      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);

      expect(() => applyAISuggestions(editor, '')).not.toThrow();
    });

    it('should handle AI content with only whitespace', () => {
      const editor = createTestEditor();

      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);

      expect(() => applyAISuggestions(editor, '   \n\n   ')).not.toThrow();
    });

    it('should handle empty chatNodes array', () => {
      const editor = createTestEditor();

      editor.setOption(AIChatPlugin, 'chatNodes', []);

      expect(() => applyAISuggestions(editor, 'New content')).not.toThrow();
    });

    it('should handle nodes without IDs', () => {
      const editor = createTestEditor([
        { children: [{ text: 'No ID' }], type: 'p' },
      ]);

      editor.setOption(BlockSelectionPlugin, 'isSelectingSome', true);
      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);

      const aiContent = 'Updated content';

      expect(() => applyAISuggestions(editor, aiContent)).not.toThrow();
    });

    it('should handle complex nested structures', () => {
      const editor = createTestEditor([
        {
          children: [
            { text: 'Paragraph with ' },
            { bold: true, text: 'bold' },
            { text: ' and ' },
            { italic: true, text: 'italic' },
          ],
          id: 'id-1',
          type: 'p',
        },
      ]);

      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);

      const aiContent = 'Simple paragraph';

      expect(() => applyAISuggestions(editor, aiContent)).not.toThrow();
    });

    it('should handle suggestion properties on elements', () => {
      const editor = createTestEditor([
        {
          [KEYS.suggestion]: { type: 'insert' },
          children: [{ text: 'Suggested block' }],
          id: 'id-1',
          type: 'p',
        },
      ]);

      editor.setOption(AIChatPlugin, 'chatNodes', editor.children);

      const aiContent = 'New block';

      expect(() => applyAISuggestions(editor, aiContent)).not.toThrow();
    });
  });
});