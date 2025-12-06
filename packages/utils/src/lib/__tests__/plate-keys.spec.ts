1~
import { KEYS } from '../plate-keys';
2~

3~
describe('KEYS', () => {
4~
  describe('Plugin Keys', () => {
5~
    it('should have exportDocx key', () => {
6~
      expect(KEYS.exportDocx).toBe('exportDocx');
7~
    });
8~

9~
    it('should have all expected common keys', () => {
10~
      expect(KEYS.p).toBeDefined();
11~
      expect(KEYS.bold).toBeDefined();
12~
      expect(KEYS.italic).toBeDefined();
13~
      expect(KEYS.underline).toBeDefined();
14~
    });
15~

16~
    it('should have docx key for import functionality', () => {
17~
      expect(KEYS.docx).toBe('docx');
18~
    });
19~

20~
    it('should maintain exportDocx as distinct from docx', () => {
21~
      expect(KEYS.exportDocx).not.toBe(KEYS.docx);
22~
    });
23~
  });
24~

25~
  describe('Heading Keys', () => {
26~
    it('should have heading array with all levels', () => {
27~
      expect(Array.isArray(KEYS.heading)).toBe(true);
28~
      expect(KEYS.heading).toContain('h1');
29~
      expect(KEYS.heading).toContain('h2');
30~
      expect(KEYS.heading).toContain('h3');
31~
      expect(KEYS.heading).toContain('h4');
32~
      expect(KEYS.heading).toContain('h5');
33~
      expect(KEYS.heading).toContain('h6');
34~
    });
35~

36~
    it('should have individual heading level keys', () => {
37~
      expect(KEYS.h1).toBeDefined();
38~
      expect(KEYS.h2).toBeDefined();
39~
      expect(KEYS.h3).toBeDefined();
40~
      expect(KEYS.h4).toBeDefined();
41~
      expect(KEYS.h5).toBeDefined();
42~
      expect(KEYS.h6).toBeDefined();
43~
    });
44~
  });
45~

46~
  describe('Formatting Keys', () => {
47~
    it('should have text formatting keys', () => {
48~
      expect(KEYS.bold).toBe('bold');
49~
      expect(KEYS.italic).toBe('italic');
50~
      expect(KEYS.underline).toBe('underline');
51~
      expect(KEYS.strikethrough).toBe('strikethrough');
52~
      expect(KEYS.code).toBe('code');
53~
    });
54~

55~
    it('should have alignment keys', () => {
56~
      expect(KEYS.align).toBe('align');
57~
    });
58~

59~
    it('should have color formatting keys', () => {
60~
      expect(KEYS.color).toBe('color');
61~
      expect(KEYS.backgroundColor).toBe('backgroundColor');
62~
    });
63~
  });
64~

65~
  describe('Structure Keys', () => {
66~
    it('should have block structure keys', () => {
67~
      expect(KEYS.blockquote).toBe('blockquote');
68~
      expect(KEYS.codeBlock).toBe('code_block');
69~
      expect(KEYS.paragraph).toBe('p');
70~
    });
71~

72~
    it('should have list keys', () => {
73~
      expect(KEYS.list).toBeDefined();
74~
      expect(KEYS.listItem).toBeDefined();
75~
    });
76~

77~
    it('should have table keys', () => {
78~
      expect(KEYS.table).toBe('table');
79~
      expect(KEYS.tr).toBe('tr');
80~
      expect(KEYS.td).toBe('td');
81~
      expect(KEYS.th).toBe('th');
82~
    });
83~
  });
84~

85~
  describe('Feature Keys', () => {
86~
    it('should have AI feature keys', () => {
87~
      expect(KEYS.ai).toBe('ai');
88~
      expect(KEYS.aiChat).toBe('aiChat');
89~
      expect(KEYS.copilot).toBe('copilot');
90~
    });
91~

92~
    it('should have media keys', () => {
93~
      expect(KEYS.image).toBe('img');
94~
      expect(KEYS.mediaEmbed).toBe('media_embed');
95~
    });
96~

97~
    it('should have suggestion and comment keys', () => {
98~
      expect(KEYS.suggestion).toBe('suggestion');
99~
      expect(KEYS.comment).toBe('comment');
100~
    });
101~
  });
102~

103~
  describe('Key Consistency', () => {
104~
    it('should have consistent naming for export/import features', () => {
105~
      // Both docx and exportDocx should exist for import/export functionality
106~
      expect(KEYS.docx).toBeDefined();
107~
      expect(KEYS.exportDocx).toBeDefined();
108~

109~
      // Similarly for CSV
110~
      expect(KEYS.csv).toBeDefined();
111~
    });
112~

113~
    it('should use consistent naming patterns', () => {
114~
      // CamelCase for multi-word keys
115~
      expect(KEYS.codeBlock).toBe('code_block');
116~
      expect(KEYS.listItem).toBeDefined();
117~
      expect(KEYS.exportDocx).toBe('exportDocx');
118~
    });
119~
  });
120~

121~
  describe('Type Safety', () => {
122~
    it('should allow KEYS to be used as object keys', () => {
123~
      const obj: Record<string, any> = {
124~
        [KEYS.exportDocx]: 'export value',
125~
      };
126~

127~
      expect(obj[KEYS.exportDocx]).toBe('export value');
128~
    });
129~

130~
    it('should allow heading array to be iterated', () => {
131~
      const headings = KEYS.heading;
132~
      const count = headings.length;
133~

134~
      expect(count).toBe(6);
135~

136~
      headings.forEach((level) => {
137~
        expect(typeof level).toBe('string');
138~
        expect(level).toMatch(/^h[1-6]$/);
139~
      });
140~
    });
141~
  });
142~
});