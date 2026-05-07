import { useEffect, useLayoutEffect, useMemo } from 'react';

import type { SlateEditor, TElement } from 'platejs';

import type { BasePaginationOptions, Page } from '../../lib/types';

import { allocateFootnotes } from '../../lib/allocate-footnotes';
import { FOOTNOTE_DEFINITION_KEY } from '../../lib/internal/keys';
import { resolvePageRect } from '../../lib/internal/page-size-presets';
import { paginate } from '../../lib/paginate';
import { setEditorPages } from '../../lib/internal/page-state';
import { usePretextMeasurer } from '../use-pretext-measurer';

/**
 * Isomorphic `useLayoutEffect`: client-side it runs synchronously before
 * paint (so `editor.api.pagination.getPages()` sees fresh data on the same
 * tick); SSR falls back to `useEffect` to dodge React's layout-effect
 * warning when there is no DOM yet.
 */
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Project the editor's children into the derived page sequence for variant A.
 *
 * Wraps `paginate()` + `allocateFootnotes()` in a `useMemo` keyed on the
 * `value` snapshot and the resolved options. The latest snapshot is mirrored
 * to the LIVE editor instance so `editor.api.pagination.getPages()` resolves
 * without a hook — without this, callers outside the overlay subtree would
 * never see populated pages.
 */
export const usePageLayout = (
  editor: SlateEditor,
  value: TElement[],
  options: BasePaginationOptions
): Page[] => {
  const measurer = usePretextMeasurer(editor.id);

  const pages = useMemo<Page[]>(() => {
    const rect = resolvePageRect(options.pageSize, options.margins, {
      footer: options.footerHeight,
      footnoteWell: options.footnoteWell,
      header: options.headerHeight,
    });

    const raw = paginate({
      ctx: { font: '', marksFingerprint: '', width: rect.contentWidth },
      doc: value,
      footnotePlacement: options.footnotePlacement,
      measurer,
      rect,
    });

    if (options.footnotePlacement === 'documentEnd') {
      return raw;
    }

    const footnoteDefinitionType = editor.getType(FOOTNOTE_DEFINITION_KEY);
    const definitions = value.filter((n) => n.type === footnoteDefinitionType);

    return allocateFootnotes(raw, definitions);
  }, [editor, value, measurer, options]);

  useIsomorphicLayoutEffect(() => {
    setEditorPages(editor as object, pages);
  }, [editor, pages]);

  return pages;
};
