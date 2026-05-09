import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { SlateEditor, TElement } from 'platejs';

import type { BasePaginationOptions, Page } from '../../lib/types';

import { allocateFootnotes } from '../../lib/allocate-footnotes';
import { FOOTNOTE_DEFINITION_KEY } from '../../lib/internal/keys';
import { resolvePageRect } from '../../lib/internal/page-size-presets';
import { paginate } from '../../lib/paginate';
import { setEditorPages } from '../../lib/internal/page-state';
import { canonicalFootnotePlacement } from '../../lib/types';
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
 * rAF-coalesce the input value: rapid edits/resizes feed the latest snapshot
 * to the next animation frame instead of triggering a paginate per change.
 * Initial render returns the input synchronously so first paint is correct.
 */
const useRafCoalesced = <T>(value: T): T => {
  const [coalesced, setCoalesced] = useState(value);
  const latestRef = useRef(value);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    latestRef.current = value;

    if (typeof window === 'undefined') {
      setCoalesced(value);

      return;
    }
    if (rafIdRef.current !== null) return;

    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;
      setCoalesced(latestRef.current);
    });

    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [value]);

  return coalesced;
};

/**
 * Project the editor's children into the derived page sequence for variant A.
 *
 * `value` and `options` are rAF-coalesced before pagination so a burst of
 * keystrokes or a resize storm trigger at most one `paginate()` per frame.
 * Pretext's `prepare()` is cached per `(node.id, marksFingerprint, font,
 * width)` inside the measurer, so unchanged blocks skip the expensive pass
 * even on repeated cycles.
 *
 * The latest snapshot is mirrored to the LIVE editor instance so
 * `editor.api.pagination.getPages()` resolves without a hook — without this,
 * callers outside the overlay subtree would never see populated pages.
 */
export const usePageLayout = (
  editor: SlateEditor,
  value: TElement[],
  options: BasePaginationOptions
): Page[] => {
  const measurer = usePretextMeasurer(editor);
  const coalescedValue = useRafCoalesced(value);
  const coalescedOptions = useRafCoalesced(options);

  const pages = useMemo<Page[]>(() => {
    const rect = resolvePageRect(
      coalescedOptions.pageSize,
      coalescedOptions.margins,
      {
        footer: coalescedOptions.footerHeight,
        footnoteWell: coalescedOptions.footnoteWell,
        header: coalescedOptions.headerHeight,
      }
    );

    const raw = paginate({
      ctx: {
        font: '',
        marksFingerprint: '',
        width: rect.contentWidth,
      },
      doc: coalescedValue,
      footnotePlacement: coalescedOptions.footnotePlacement,
      measurer,
      rect,
    });

    const footnoteDefinitionType = editor.getType(FOOTNOTE_DEFINITION_KEY);
    const definitions = coalescedValue.filter(
      (n) => n.type === footnoteDefinitionType
    );
    const canonical = canonicalFootnotePlacement(
      coalescedOptions.footnotePlacement
    );

    if (definitions.length === 0) return raw;

    return allocateFootnotes(raw, definitions, canonical);
  }, [editor, coalescedValue, measurer, coalescedOptions]);

  useIsomorphicLayoutEffect(() => {
    setEditorPages(editor as object, pages);
  }, [editor, pages]);

  return pages;
};
