# Fix Pagination Plugin — Make It Usable End-to-End

## Objective

Transform the pagination plugin from a mostly-functional internal engine into a fully usable end-user feature. The toolbar button exists in the playground template but its five transform methods (`togglePreview`, `toggleHeader`, `toggleFooter`, `setPageSize`, `setMargins`) are unimplemented — clicking them either does nothing or falls through to a toast. Additionally, the reflow engine's text-split path is fragile, resize handling lacks its own debounce, and there are no tests.

## Scope

- **Package**: `packages/pagination/`
- **Template**: `templates/plate-playground-template/`
- **8 implementation tasks** across 3 layers: transforms API, engine hardening, and testing

---

## Implementation Plan

### Layer 1: Transforms API — Core User-Facing Gap

- [ ] **Task 1.** Implement `editor.tf.pagination` transforms namespace in `BasePaginationPlugin.ts` override editor.

  **Rationale**: The toolbar button (`pagination-toolbar-button.tsx:100-102`) accesses `editor.tf.pagination` which doesn't exist. The Plate `OverrideEditor` pattern allows injecting custom transforms. Five methods needed:
  - `togglePreview()` — toggle `viewMode` between `'paginated'` and `'continuous'` using `editor.setOption`
  - `setPageSize(size: 'A4' | 'Letter' | 'Legal')` — update `documentSettings.sizes` via `editor.setOptions` with known presets (A4: 794x1123, Letter: 816x1056, Legal: 816x1344 at 96 DPI)
  - `setMargins(m: Margins)` — update `documentSettings.margins` via `editor.setOptions`
  - `toggleHeader()` — insert/remove a `{ type: 'header', children: [...] }` node as first or last child of each page
  - `toggleFooter()` — insert/remove a `{ type: 'footer', children: [...] }` node as first or last child of each page

  The header/footer toggles must: check if headers/footers already exist across pages, if yes remove them from all pages via `withPaginationMutations`, if no insert a default header/footer block into every page. Mark pages dirty after mutations.

  The override editor pattern (`BasePaginationPlugin.ts:49-88`) already returns `{ transforms: { apply, normalizeNode } }` — extend this to include the `pagination` namespace.

- [ ] **Task 2.** Wire `documentSettings` reactivity so `PageElement` re-renders when page size or margins change via transforms.

  **Rationale**: Currently `PageElement` reads `documentSettings` from `usePluginOption` which subscribes to the options store. `editor.setOption`/`editor.setOptions` already trigger store updates. Verify this works end-to-end: changing page size via toolbar updates all rendered PageElements immediately. If the options store subscription doesn't propagate to `PageElement`, fix by ensuring the plugin options store is properly reactive.

- [ ] **Task 3.** Wire `viewMode` toggle reactivity so `PaginationCoordinator` and `PageElement` respond to the toggle.

  **Rationale**: `PaginationCoordinator.tsx:175-179` already has a `useEffect` watching `viewMode`. `PageElement.tsx:49-77` already switches rendering based on `isPaginated`. Both use `usePluginOption` which should react to `editor.setOption(BasePaginationPlugin, 'viewMode', ...)`. Verify the full chain: toolbar toggle -> option update -> coordinator reflow -> page element re-render.

### Layer 2: Engine Hardening

- [ ] **Task 4.** Add resize debounce dedicated to window resize events in `PaginationCoordinator`.

  **Rationale**: `PaginationCoordinator.tsx:163-168` attaches a `resize` listener that calls `scheduleReflowFrom(0)`. While the reflow pipeline has its own 100ms debounce, rapid resize events during browser window dragging still enqueue many `setTimeout` calls. Add a separate 200ms debounce on the resize handler itself (before calling `scheduleReflowFrom`), using a `useRef<number>` timer pattern matching the existing `scheduledRef` pattern.

- [ ] **Task 5.** Harden `splitOversizedBlock` text-split path against `ReactEditor.toDOMRange` failures.

  **Rationale**: `reflowEngine.ts:210-323` uses `(ReactEditor as any).toDOMRange(editor, range)` to convert a Slate range to a DOM range for binary-search measurement. This is fragile — it accesses a static method via casting, and throws if the editor isn't attached to a DOM. Add:
  1. A try-catch guard at the `toDOMRange` call site returning `false` on failure (already partially there at L263)
  2. A `requestAnimationFrame` await before the binary search to ensure DOM is settled after React renders
  3. A fallback: if `toDOMRange` is unavailable, fall back to an `offset-based` estimate using `fullText.length` proportionally mapped to the container height — this won't be pixel-perfect but prevents complete failure

- [ ] **Task 6.** Guard against empty-page edge case in `reflowPageBoundary`.

  **Rationale**: `reflowEngine.ts:129-137` removes empty trailing pages. If a document has exactly one page and it becomes empty (all children moved out), the page removal would leave the editor with zero root children — a state Slate cannot handle. Add a guard: before removing a page at index 0 or the last remaining page, insert a default empty paragraph block instead.

### Layer 3: Testing & Verification

- [ ] **Task 7.** Write unit tests for the transforms API.

  **Rationale**: No tests currently exist for `@platejs/pagination`. Tests needed:
  - `togglePreview()` switches `viewMode` and triggers reflow
  - `setPageSize('A4')` updates `documentSettings.sizes` to `{ width: 794, height: 1123 }`
  - `setPageSize('Letter')` updates to `{ width: 816, height: 1056 }`
  - `setPageSize('Legal')` updates to `{ width: 816, height: 1344 }`
  - `setMargins(...)` updates `documentSettings.margins`
  - `toggleHeader()` / `toggleFooter()` insert/remove header/footer nodes from all pages
  - Transforms respect `withPaginationMutations` guard (no infinite markDirty loops)

- [ ] **Task 8.** Write integration tests for the reflow engine core paths.

  **Rationale**: The reflow engine is the most complex component. Tests needed:
  - Single page with content that fits → no change
  - Single page with overflowing content → child moves to new page 2
  - Two pages where page 1 underflows → child pulled from page 2
  - Empty trailing page removal
  - Single-page document empty behavior (guard from Task 6)
  - Text split for oversized single-child block
  - Reflow mutations do not appear in undo history (`HistoryEditor.withoutSaving` verification)

## Verification Criteria

- [ ] `PaginationToolbarButton` dropdown toggles page preview without falling to toast
- [ ] Page size changes (A4 ↔ Letter ↔ Legal) resize rendered pages in real-time
- [ ] Margin preset changes update page padding in real-time
- [ ] Header/footer toggles add/remove header/footer blocks from all pages
- [ ] Rapid window resize during page drag does not cause jank or excessive reflow runs
- [ ] Text split path works when a single paragraph overflows a page boundary
- [ ] Empty page edge cases handled gracefully (no Slate-invalid empty root children)
- [ ] All reflow mutations excluded from undo history
- [ ] `pnpm test` passes for the pagination package
- [ ] `pnpm typecheck` passes for the pagination package

## Potential Risks and Mitigations

1. **[R] `editor.tf.pagination` namespace may conflict with Plate's Slate transforms merging**
   Mitigation: Plate's `OverrideEditor` merges returned `transforms` into `editor.tf`. Test that custom namespace keys are preserved after merge. If conflict arises, use `editor.api.pagination` instead and update the toolbar button.

2. **[R] Header/footer node types (`'header'`, `'footer'`) may collide with existing plugin node types**
   Mitigation: Define header/footer as simple block containers (no special plugin). If a `HeaderPlugin` or `FooterPlugin` exists in the registry, coordinate to avoid type collision. Alternatively, prefix with `pagination-` namespace.

3. **[R] `ReactEditor.toDOMRange` binary search falls back to proportional estimate which may be inaccurate for mixed font sizes**
   Mitigation: The proportional fallback is best-effort. Accept ±1 line inaccuracy for the fallback path. The primary path (DOM measurement) handles 99% of cases.

4. **[R] Header/footer toggle iterates all pages — on large documents this could be slow**
   Mitigation: Wrap in `Editor.withoutNormalizing` and batch all mutations. For very large documents (100+ pages), consider a future optimization using a single atomic operation.

## Alternative Approaches

1. **[Alt] Use `editor.api.pagination` instead of `editor.tf.pagination`**: The `api` namespace is more conventional for custom plugin methods. Trade-off: requires updating the toolbar button import pattern. Better long-term architecture but more template changes.

2. **[Alt] Separate HeaderPlugin/FooterPlugin as standalone plugins**: Instead of managing headers/footers in the pagination plugin, create dedicated plugins that the pagination plugin composes with. Trade-off: cleaner separation but more boilerplate, and headers/footers are inherently coupled to page layout.

3. **[Alt] Pure-CSS text overflow instead of JS binary search for text split**: Use CSS `overflow: hidden` with a measured approach (render text in hidden div, measure line by line). Trade-off: simpler but slower and requires extra DOM nodes.
