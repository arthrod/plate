/**
 * Tests for docx-export-kit.tsx
 *
 * Covers:
 * - DocxExportKit configuration
 * - Component overrides
 */

import { describe, expect, it } from 'bun:test';
import { DocxExportKit } from './docx-export-kit';
import { KEYS } from 'platejs';

describe('DocxExportKit', () => {
  it('should be an array', () => {
    expect(Array.isArray(DocxExportKit)).toBe(true);
  });

  it('should have exactly one plugin', () => {
    expect(DocxExportKit).toHaveLength(1);
  });

  it('should configure DocxExportPlugin with component overrides', () => {
    const plugin = DocxExportKit[0];

    expect(plugin).toBeDefined();
    expect(plugin.key).toBe('docxExport');
  });

  it('should override code block components', () => {
    const plugin = DocxExportKit[0] as any;

    // Access the override configuration
    const config = plugin.__configuration?.({}) || plugin.override;

    expect(config).toBeDefined();
    expect(config.components).toBeDefined();
    expect(config.components[KEYS.codeBlock]).toBeDefined();
    expect(config.components[KEYS.codeLine]).toBeDefined();
    expect(config.components[KEYS.codeSyntax]).toBeDefined();
  });

  it('should override column components', () => {
    const plugin = DocxExportKit[0] as any;
    const config = plugin.__configuration?.({}) || plugin.override;

    expect(config.components[KEYS.column]).toBeDefined();
    expect(config.components[KEYS.columnGroup]).toBeDefined();
  });

  it('should override equation components', () => {
    const plugin = DocxExportKit[0] as any;
    const config = plugin.__configuration?.({}) || plugin.override;

    expect(config.components[KEYS.equation]).toBeDefined();
    expect(config.components[KEYS.inlineEquation]).toBeDefined();
  });

  it('should override callout component', () => {
    const plugin = DocxExportKit[0] as any;
    const config = plugin.__configuration?.({}) || plugin.override;

    expect(config.components[KEYS.callout]).toBeDefined();
  });

  it('should override TOC component', () => {
    const plugin = DocxExportKit[0] as any;
    const config = plugin.__configuration?.({}) || plugin.override;

    expect(config.components[KEYS.toc]).toBeDefined();
  });

  it('should override suggestion component', () => {
    const plugin = DocxExportKit[0] as any;
    const config = plugin.__configuration?.({}) || plugin.override;

    expect(config.components[KEYS.suggestion]).toBeDefined();
  });

  it('should have all required DOCX-specific components', () => {
    const plugin = DocxExportKit[0] as any;
    const config = plugin.__configuration?.({}) || plugin.override;

    const expectedKeys = [
      KEYS.codeBlock,
      KEYS.codeLine,
      KEYS.codeSyntax,
      KEYS.column,
      KEYS.columnGroup,
      KEYS.equation,
      KEYS.inlineEquation,
      KEYS.callout,
      KEYS.toc,
      KEYS.suggestion,
    ];

    for (const key of expectedKeys) {
      expect(config.components[key]).toBeDefined();
    }
  });
});