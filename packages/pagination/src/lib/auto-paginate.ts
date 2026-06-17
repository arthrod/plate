import type { Path, SlateEditor } from 'platejs';

/**
 * Recompute non-manual `page_break` placements inside the section at
 * `sectionPath`.
 *
 * TODO: variant B — pretext-driven cumulative-height pass inside
 * `withNormalizeNode`. The implementation must:
 *   1. Resolve the section's effective `pageSize`/`margins` (per-section
 *      overrides win over the plugin-level option).
 *   2. Walk the body children, measuring each block height through the lazy
 *      pretext measurer (see `internal/measure-cache.ts`).
 *   3. Insert or remove non-manual `page_break` voids so each cumulative-page
 *      run fits within the printable height.
 *   4. Leave `manual: true` breaks untouched.
 */
export const autoPaginate = (
  _editor: SlateEditor,
  _sectionPath: Path
): void => {
  // TODO: variant B — see header.
};
