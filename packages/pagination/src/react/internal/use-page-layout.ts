import { useEffect, useMemo } from 'react';

import type { TElement } from 'platejs';

import type { BasePaginationOptions, Page } from '../../lib/types';

import { allocateFootnotes } from '../../lib/allocate-footnotes';
import { FOOTNOTE_DEFINITION_KEY } from '../../lib/internal/keys';
import { resolvePageRect } from '../../lib/internal/page-size-presets';
import { paginate } from '../../lib/paginate';
import { setEditorPages } from './page-state';
import { usePretextMeasurer } from '../use-pretext-measurer';

/**
 * Project the editor's children into the derived page sequence for variant A.
 *
 * Wraps `paginate()` + `allocateFootnotes()` in a `useMemo` keyed on the
 * editor children reference and the resolved options. The latest snapshot
 * is mirrored to the per-editor `WeakMap` so `editor.api.pagination.*`
 * queries resolve without a hook.
 */
export const usePageLayout = (
  editor: { id: string; children: TElement[] },
  options: BasePaginationOptions
): Page[] => {
  const measurer = usePretextMeasurer(editor.id);

  const pages = useMemo<Page[]>(() => {
    const rect = resolvePageRect(options.pageSize, options.margins, {
      footer: options.footerHeight,
      footnoteWell: options.footnoteWell,
      header: options.headerHeight,
    });

    const raw = paginate(
      editor.children,
      rect,
      { font: '', marksFingerprint: '', width: rect.contentWidth },
      measurer
    );

    const definitions = editor.children.filter(
      (n) => n.type === FOOTNOTE_DEFINITION_KEY
    );

    return allocateFootnotes(raw, definitions);
  }, [editor.children, measurer, options]);

  useEffect(() => {
    setEditorPages(editor as object, pages);
  }, [editor, pages]);

  return pages;
};
