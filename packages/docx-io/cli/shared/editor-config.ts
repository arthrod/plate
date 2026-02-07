import type { SlatePlugin } from 'platejs';
import { createSlateEditor } from 'platejs';
import { BaseEditorKit } from 'www/src/registry/components/editor/editor-base-kit';

/**
 * Create editor instance with same plugins as production.
 * This ensures CLI conversions match UI behavior.
 *
 * Uses createSlateEditor (not createPlateEditor) since CLI tools
 * don't need React rendering context.
 */
export function createCLIEditor() {
  return createSlateEditor({
    plugins: BaseEditorKit as SlatePlugin[],
  });
}

export function createStaticCLIEditor() {
  return createSlateEditor({
    plugins: BaseEditorKit as SlatePlugin[],
  });
}
