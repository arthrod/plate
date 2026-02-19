import fs from 'node:fs';
import path from 'node:path';

describe('importDocx mammoth source', () => {
  it('does not import legacy top-level mammoth browser bundles', () => {
    const importDocxPath = path.resolve(__dirname, '../importDocx.ts');
    const source = fs.readFileSync(importDocxPath, 'utf8');

    expect(source).not.toContain('./mammoth.js/mammoth.browser.js');
    expect(source).not.toContain('./mammoth.js/mammoth.browser.min.js');
    expect(source).toContain('./mammoth.js/dist/esm/index.browser.js');
  });
});
