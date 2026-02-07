import { createPlateEditor } from 'platejs/react';
import { createPlateEditor as createStaticPlateEditor } from 'platejs';
// @ts-ignore
import { BaseEditorKit } from '../../../../apps/www/src/registry/components/editor/editor-base-kit';

/**
 * Create editor instance with same plugins as production.
 * This ensures CLI conversions match UI behavior.
 */
export function createCLIEditor() {
  return createPlateEditor({
    plugins: BaseEditorKit,
  });
}

export function createStaticCLIEditor() {
  return createStaticPlateEditor({
    plugins: BaseEditorKit,
  });
}
