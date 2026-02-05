import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

describe('themes.ts', () => {
  it('has no commented-out fontFamily blocks', () => {
    const themesPath = fileURLToPath(new URL('./themes.ts', import.meta.url));
    const themesSource = readFileSync(themesPath, 'utf8');

    expect(themesSource).not.toMatch(/\/\/\s*fontFamily\s*:/);
    expect(themesSource).not.toMatch(/\/\*\s*fontFamily\s*:/);
  });
});
