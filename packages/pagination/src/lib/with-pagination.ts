/**
 * TODO(#358): selection/paste across Section boundaries — verify
 * `withInsertFragment`, copy/paste, and bidirectional cursor traversal.
 * Pasting fragments that contain their own `Section`, or pasting into
 * header/footer slots, will collide with default Slate paste behavior. The
 * scaffold deliberately makes this a load-bearing TODO: it must be designed
 * before any non-identity normalize pass lands or `Section[]` documents will
 * silently corrupt on paste.
 */

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
 * TODO(#358): variant B — implement the real `normalizeNode` body. See CR
 * design choices on issue #354 for ownership boundaries:
 *   - Design Choice 1: pretext is a direct dependency with lazy init.
 *   - Design Choice 2: footnote section-scoping via `configurePlugin`.
 *   - Design Choice 3: single `page_break` node carries `manual: boolean`.
 */
export const withPagination: OverrideEditor<BasePaginationConfig> = (ctx) => ({
  transforms: {
    normalizeNode: (entry) => {
      // TODO(#358): variant B — invariant pass + auto-paginate pass.
      void enforceSectionInvariants;
      void autoPaginate;
      void ctx;

      return ctx.tf.normalizeNode(entry);
    },
  },
});
