import type { OverrideEditor } from 'platejs';

import type { BasePaginationConfig } from './types';

import { autoPaginate } from './auto-paginate';
import { enforceSectionInvariants } from './internal/section-invariants';

/**
 * Variant B editor override: enforces the `Section[]` invariants and runs the
 * pretext-driven auto-paginator from inside `withNormalizeNode`.
 *
 * The current scaffold returns identity transforms so consumers can wire the
 * plugin into an editor before the paginator body lands.
 *
 * TODO: variant B — implement the real `normalizeNode` body. See CR design
 * choices on issue #354 for ownership boundaries:
 *   - Design Choice 1: pretext is a direct dependency with lazy init.
 *   - Design Choice 2: footnote section-scoping via `configurePlugin`.
 *   - Design Choice 3: single `page_break` node carries `manual: boolean`.
 */
export const withPagination: OverrideEditor<BasePaginationConfig> = ({
  editor,
  getOptions,
  tf: { normalizeNode },
}) => ({
  transforms: {
    normalizeNode: (entry) => {
      // TODO: variant B — invariant pass + auto-paginate pass.
      void enforceSectionInvariants;
      void autoPaginate;
      void editor;
      void getOptions;

      return normalizeNode(entry);
    },
  },
});
