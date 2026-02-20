import fs from 'node:fs';
import path from 'node:path';

describe('importDocx mammoth source', () => {
  it('prefers dist browser entry with source fallbacks', () => {
    const importDocxPath = path.resolve(__dirname, '../importDocx.ts');
    const source = fs.readFileSync(importDocxPath, 'utf8');

    expect(source).toContain('./mammoth.js/dist/esm/index.browser.js');
    expect(source).toContain('./mammoth.js/mammoth.browser.js');
    expect(source).toContain('./mammoth.js/lib/index.ts');
  });
});
