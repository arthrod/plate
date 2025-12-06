import { KEYS } from '../plate-keys';

describe('KEYS', () => {
  describe('Plugin Keys', () => {
    it('should have exportDocx key', () => {
      expect(KEYS.exportDocx).toBe('exportDocx');
    });

    it('should have all expected common keys', () => {
      expect(KEYS.p).toBeDefined();
      expect(KEYS.bold).toBeDefined();
      expect(KEYS.italic).toBeDefined();
      expect(KEYS.underline).toBeDefined();
    });

    it('should have docx key for import functionality', () => {
      expect(KEYS.docx).toBe('docx');
    });

    it('should maintain exportDocx as distinct from docx', () => {
      expect(KEYS.exportDocx).not.toBe(KEYS.docx);
    });
  });

  describe('Heading Keys', () => {
    it('should have heading array with all levels', () => {
      expect(Array.isArray(KEYS.heading)).toBe(true);
      expect(KEYS.heading).toContain('h1');
      expect(KEYS.heading).toContain('h2');
      expect(KEYS.heading).toContain('h3');
      expect(KEYS.heading).toContain('h4');
      expect(KEYS.heading).toContain('h5');
      expect(KEYS.heading).toContain('h6');
    });

    it('should have individual heading level keys', () => {
      expect(KEYS.h1).toBeDefined();
      expect(KEYS.h2).toBeDefined();
      expect(KEYS.h3).toBeDefined();
      expect(KEYS.h4).toBeDefined();
      expect(KEYS.h5).toBeDefined();
      expect(KEYS.h6).toBeDefined();
    });
  });

  describe('Formatting Keys', () => {
    it('should have text formatting keys', () => {
      expect(KEYS.bold).toBe('bold');
      expect(KEYS.italic).toBe('italic');
      expect(KEYS.underline).toBe('underline');
      expect(KEYS.strikethrough).toBe('strikethrough');
      expect(KEYS.code).toBe('code');
    });

    it('should have alignment keys', () => {
      expect(KEYS.align).toBe('align');
    });

    it('should have color formatting keys', () => {
      expect(KEYS.color).toBe('color');
      expect(KEYS.backgroundColor).toBe('backgroundColor');
    });
  });

  describe('Structure Keys', () => {
    it('should have block structure keys', () => {
      expect(KEYS.blockquote).toBe('blockquote');
      expect(KEYS.codeBlock).toBe('code_block');
      expect(KEYS.paragraph).toBe('p');
    });

    it('should have list keys', () => {
      expect(KEYS.list).toBeDefined();
      expect(KEYS.listItem).toBeDefined();
    });

    it('should have table keys', () => {
      expect(KEYS.table).toBe('table');
      expect(KEYS.tr).toBe('tr');
      expect(KEYS.td).toBe('td');
      expect(KEYS.th).toBe('th');
    });
  });

  describe('Feature Keys', () => {
    it('should have AI feature keys', () => {
      expect(KEYS.ai).toBe('ai');
      expect(KEYS.aiChat).toBe('aiChat');
      expect(KEYS.copilot).toBe('copilot');
    });

    it('should have media keys', () => {
      expect(KEYS.image).toBe('img');
      expect(KEYS.mediaEmbed).toBe('media_embed');
    });

    it('should have suggestion and comment keys', () => {
      expect(KEYS.suggestion).toBe('suggestion');
      expect(KEYS.comment).toBe('comment');
    });
  });

  describe('Key Consistency', () => {
    it('should have consistent naming for export/import features', () => {
      // Both docx and exportDocx should exist for import/export functionality
      expect(KEYS.docx).toBeDefined();
      expect(KEYS.exportDocx).toBeDefined();

      // Similarly for CSV
      expect(KEYS.csv).toBeDefined();
    });

    it('should use consistent naming patterns', () => {
      // CamelCase for multi-word keys
      expect(KEYS.codeBlock).toBe('code_block');
      expect(KEYS.listItem).toBeDefined();
      expect(KEYS.exportDocx).toBe('exportDocx');
    });
  });

  describe('Type Safety', () => {
    it('should allow KEYS to be used as object keys', () => {
      const obj: Record<string, any> = {
        [KEYS.exportDocx]: 'export value',
      };

      expect(obj[KEYS.exportDocx]).toBe('export value');
    });

    it('should allow heading array to be iterated', () => {
      const headings = KEYS.heading;
      const count = headings.length;

      expect(count).toBe(6);

      headings.forEach((level) => {
        expect(typeof level).toBe('string');
        expect(level).toMatch(/^h[1-6]$/);
      });
    });
  });
});