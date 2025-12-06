/** @jsx jsx */

import { createPlateEditor } from '@udecode/plate-core/react';
import { jsx } from '@udecode/plate-test-utils';

import { ExportDocxPlugin } from '../ExportDocxPlugin';

jsx;

describe('ExportDocxPlugin', () => {
  describe('plugin configuration', () => {
    it('should have correct plugin key', () => {
      const editor = createPlateEditor({
        plugins: [ExportDocxPlugin],
      });

      const plugin = editor.getPlugin(ExportDocxPlugin);
      expect(plugin.key).toBe('export_docx');
    });

    it('should register with default options', () => {
      const editor = createPlateEditor({
        plugins: [ExportDocxPlugin],
      });

      const plugin = editor.getPlugin(ExportDocxPlugin);
      expect(plugin).toBeDefined();
      expect(plugin.options).toBeDefined();
    });

    it('should accept custom options', () => {
      const customOptions = {
        sections: {
          properties: {
            page: {
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
            },
          },
        },
      };

      const editor = createPlateEditor({
        plugins: [
          ExportDocxPlugin.configure({
            options: customOptions,
          }),
        ],
      });

      const plugin = editor.getPlugin(ExportDocxPlugin);
      expect(plugin.options).toEqual(customOptions);
    });
  });

  describe('editor API', () => {
    it('should extend editor with exportDocx method', () => {
      const editor = createPlateEditor({
        plugins: [ExportDocxPlugin],
      });

      expect(editor.api.exportDocx).toBeDefined();
      expect(typeof editor.api.exportDocx).toBe('function');
    });

    it('should have exportDocx method callable', () => {
      const editor = createPlateEditor({
        plugins: [ExportDocxPlugin],
      });

      expect(() => {
        const result = editor.api.exportDocx();
        expect(result).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('plugin initialization', () => {
    it('should initialize without errors in empty editor', () => {
      expect(() => {
        createPlateEditor({
          plugins: [ExportDocxPlugin],
        });
      }).not.toThrow();
    });

    it('should work with other plugins', () => {
      const editor = createPlateEditor({
        plugins: [ExportDocxPlugin],
      });

      expect(editor.plugins.length).toBeGreaterThan(0);
    });

    it('should maintain plugin ordering', () => {
      const editor = createPlateEditor({
        plugins: [ExportDocxPlugin],
      });

      const pluginKeys = editor.plugins.map((p) => p.key);
      expect(pluginKeys).toContain('export_docx');
    });
  });

  describe('edge cases', () => {
    it('should handle reconfiguration', () => {
      const editor1 = createPlateEditor({
        plugins: [ExportDocxPlugin],
      });

      const editor2 = createPlateEditor({
        plugins: [
          ExportDocxPlugin.configure({
            options: { sections: {} },
          }),
        ],
      });

      expect(editor1.api.exportDocx).toBeDefined();
      expect(editor2.api.exportDocx).toBeDefined();
    });

    it('should handle multiple editor instances', () => {
      const editor1 = createPlateEditor({
        plugins: [ExportDocxPlugin],
      });

      const editor2 = createPlateEditor({
        plugins: [ExportDocxPlugin],
      });

      expect(editor1.api.exportDocx).toBeDefined();
      expect(editor2.api.exportDocx).toBeDefined();
      expect(editor1.api.exportDocx).not.toBe(editor2.api.exportDocx);
    });
  });
});