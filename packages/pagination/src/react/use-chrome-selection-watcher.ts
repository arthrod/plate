import { useEffect } from 'react';

import type { SlateEditor } from 'platejs';

import { useEditorSelection } from 'platejs/react';

import { FOOTER_KEY, HEADER_KEY } from '../lib/internal/keys';
import { type ActiveChromeId, useChromeFocus } from './chrome-focus-context';

/**
 * Watches editor selection and reports which chrome region (if any)
 * currently holds the caret.
 *
 * Walks from `selection.anchor.path[0]` to the top-level block and matches
 * its `type` against `header` / `footer`. First-page chrome is option-based
 * (not in `editor.children`) so it cannot be detected via selection — chrome
 * regions for first-page content register their own focus state via
 * {@link useChromeFocus}'s `setActiveChromeId`.
 */
export const useChromeSelectionWatcher = (editor: SlateEditor): void => {
  const selection = useEditorSelection();
  const { activeChromeId, setActiveChromeId } = useChromeFocus();

  useEffect(() => {
    const next = resolveActiveChrome(editor, selection);

    if (next === activeChromeId) return;

    // Body selection clears chrome focus only if the previously active
    // chrome was a body-level region (header / footer). First-page chrome
    // owns its own focus lifecycle — the watcher must not stomp on it.
    if (
      next === null &&
      (activeChromeId === 'firstPageHeader' ||
        activeChromeId === 'firstPageFooter')
    ) {
      return;
    }

    setActiveChromeId(next);
  }, [editor, selection, activeChromeId, setActiveChromeId]);
};

const resolveActiveChrome = (
  editor: SlateEditor,
  selection: ReturnType<typeof useEditorSelection>
): ActiveChromeId => {
  if (!selection) return null;

  const path = selection.anchor.path;

  if (path.length === 0) return null;

  const topLevelIndex = path[0];
  const topLevel = (
    editor.children as ReadonlyArray<{ type?: string }> | undefined
  )?.[topLevelIndex];

  if (!topLevel || typeof topLevel.type !== 'string') return null;

  const headerType = editor.getType(HEADER_KEY);
  const footerType = editor.getType(FOOTER_KEY);

  if (topLevel.type === headerType) return 'header';
  if (topLevel.type === footerType) return 'footer';

  return null;
};
