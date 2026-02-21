/**
 * CLI Integration Tests
 *
 * Tests for the docx-cli command-line tool
 */

import { describe, expect, it } from 'bun:test';
import { resolve } from 'path';
import { tmpdir } from 'os';
import { convertFromDocx, convertToDocx } from '../commands';

describe('docx-cli', () => {
  describe('convertFromDocx', () => {
    it('should throw error for non-existent file', async () => {
      try {
        await convertFromDocx('/non/existent/file.docx');
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error.message).toContain('Input file not found');
      }
    });

    it('should throw error for non-docx file', async () => {
      const testFile = resolve(tmpdir(), 'test.txt');
      await Bun.write(testFile, 'test content');

      try {
        await convertFromDocx(testFile);
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error.message).toContain('must be a .docx file');
      }
    });
  });

  describe('convertToDocx', () => {
    it('should throw error for non-existent file', async () => {
      try {
        await convertToDocx('/non/existent/file.json');
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error.message).toContain('Input file not found');
      }
    });

    it('should throw error for invalid file type', async () => {
      const testFile = resolve(tmpdir(), `test-${Date.now()}.txt`);
      await Bun.write(testFile, 'test content');

      try {
        await convertToDocx(testFile);
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error.message).toContain('must be .json (Plate) or .html');
      }
    });

    it('should handle JSON input file', async () => {
      const jsonFile = resolve(tmpdir(), `test-${Date.now()}.json`);
      const testContent = JSON.stringify({ type: 'doc', children: [] });
      await Bun.write(jsonFile, testContent);

      // Should not throw
      await convertToDocx(jsonFile);
    });

    it('should handle HTML input file', async () => {
      const htmlFile = resolve(tmpdir(), `test-${Date.now()}.html`);
      const testContent = '<p>Test content</p>';
      await Bun.write(htmlFile, testContent);

      // Should not throw
      await convertToDocx(htmlFile);
    });
  });
});
