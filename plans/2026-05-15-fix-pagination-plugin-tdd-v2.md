# Fix Pagination Plugin — TDD Implementation Plan (100% Coverage)

## Objective

Transform the `@platejs/pagination` plugin from an untested internal engine with a broken toolbar UX into a production-ready feature with 100% test coverage, hardened reflow engine, and a fully functional toolbar transforms API. **Every implementation step follows TDD: write tests first, then implement to make them pass.**

## Context (From Research)

The pagination plugin has **zero tests** across all 10 source files. The toolbar button in the playground template calls 5 transforms (`togglePreview`, `setPageSize`, `setMargins`, `toggleHeader`, `toggleFooter`) that don't exist — the button falls through to a toast. The reflow engine's text-split path accesses `ReactEditor.toDOMRange` via raw cast with no fallback. Window resize lacks its own debounce layer. Empty-page edge cases are unguarded.

## Test Infrastructure

- **Runner**: Bun (`bun test` from `packages/pagination/`)
- **DOM**: Happy DOM (registered via `@happy-dom/global-registrator`)
- **Editor factory**: `createSlateEditor` from `platejs`
- **JSX test values**: `@platejs/test-utils` (`jsxt`) for concise document structure
- **File naming**: `*.spec.ts` for pure-logic tests, `*.spec.tsx` for React/DOM tests
- **Existing pattern reference**: `packages/toc/src/lib/BaseTocPlugin.spec.ts` (transforms), `packages/suggestion/src/lib/transforms/acceptSuggestion.spec.tsx` (editor state)

---

## TDD Cycle 1: Runtime (Dirty Tracking)

**File**: `packages/pagination/src/__tests__/runtime.spec.ts`

### Tests to Write (before any changes)

- [ ] `createPaginationRuntime` returns object with `markDirty`, `consumeDirtyMin`, `subscribe`
- [ ] `markDirty(pageIndex)` adds page to dirty set and notifies subscribers
- [ ] `markDirty(null)` / `markDirty(-1)` / `markDirty(NaN)` are no-ops
- [ ] `consumeDirtyMin()` returns the minimum dirty page index
- [ ] `consumeDirtyMin()` after multiple `markDirty` calls returns the smallest index
- [ ] `consumeDirtyMin()` clears the dirty set after consumption
- [ ] `consumeDirtyMin()` on empty set returns `null`
- [ ] `subscribe(fn)` returns unsubscribe function; unsubscribed callbacks are not called
- [ ] `getPageIndexFromOp` extracts index from `set_node` operation path
- [ ] `getPageIndexFromOp` extracts index from `insert_node` operation path
- [ ] `getPageIndexFromOp` extracts min index from `move_node` operation (has both `path` and `newPath`)
- [ ] `getPageIndexFromOp` returns `null` for operation with no paths (e.g., `set_selection`)
- [ ] `getPageIndexFromOp` handles `merge_node` (has `path`)
- [ ] `getPageIndexFromOp` handles `split_node` (has `path`)

### Implementation

No changes needed — `runtime.ts` already implements all these correctly. Tests verify existing behavior.

---

## TDD Cycle 2: Registry (DOM Slot Management)

**File**: `packages/pagination/src/__tests__/registry.spec.tsx`

### Tests to Write

- [ ] `PaginationRegistryProvider` renders children
- [ ] `registerPage(index, dom)` stores DOM refs and returns cleanup function
- [ ] `getPageDom(index)` returns stored `{ outer, content }` refs
- [ ] `getPageDom(index)` returns `undefined` for unknown index
- [ ] `getKnownPages()` returns sorted array of registered page indices
- [ ] Cleanup function removes the page from registry
- [ ] Cleanup function does NOT remove a different page that was registered at the same index later (outer ref identity check)
- [ ] Multiple registrations at different indices are all tracked
- [ ] `usePaginationRegistry()` returns `null` when used outside provider

### Implementation

No changes needed — `registry.tsx` already implements correctly. Tests verify.

---

## TDD Cycle 3: Leader Election

**File**: `packages/pagination/src/__tests__/leaderElection.spec.ts`

### Tests to Write

- [ ] `createAlwaysLeader().amILeader()` returns `true`
- [ ] `createAlwaysLeader().subscribe()` returns a no-op unsubscribe
- [ ] `createAlwaysLeader().destroy()` is a no-op
- [ ] `createAwarenessLeaderElection(awareness, ydoc)` with single ready client: that client is leader
- [ ] Multiple ready clients: lowest `clientID` wins
- [ ] Client without `pagination.ready === true` in awareness state is excluded from election
- [ ] `subscribe(cb)` is called when awareness state changes
- [ ] `destroy()` removes awareness listener and clears subscribers
- [ ] After `destroy()`, subscribers are no longer called

### Implementation Notes

- Need to mock `Awareness` and `Y.Doc` — use minimal stubs with `on`/`off`/`getStates`/`clientID`
- `leaderElection.ts` requires no changes; tests validate existing behavior

---

## TDD Cycle 4: BasePaginationPlugin — Normalization & Transforms API

**Files**:
- `packages/pagination/src/__tests__/BasePaginationPlugin.spec.ts` (normalization, onNodeChange)
- `packages/pagination/src/__tests__/paginationTransforms.spec.ts` (toolbar transforms)

### Tests to Write (Normalization — existing behavior; no code changes)

- [ ] Editor with flat `children` (no pages): `normalizeInitialValue` wraps all children into one page
- [ ] Editor with a mix of page and non-page root children: non-page children are wrapped into pages
- [ ] Editor where all children are already pages: no change
- [ ] Nested page (page inside page at depth > 1): inner page is unwrapped
- [ ] `normalizeNode` with path length 0 (root): `normalizeRootChildren` is called
- [ ] `onNodeChange` handler: when root has non-page children, wraps them and calls `markDirty(0)`
- [ ] `onNodeChange` handler: no-op when `__paginationMutating` is true
- [ ] `onNodeChange` handler: no-op when `meta.isNormalizing` is true
- [ ] `onNodeChange` handler: no-op when all children are pages
- [ ] `onNodeChange` handler: no-op when children array is empty or not an array
- [ ] `withPaginationMutations` sets and restores `__paginationMutating` flag
- [ ] `withPaginationMutations` restores flag on exception (try/finally)
- [ ] `apply` override marks page dirty when operation path references a page index
- [ ] `apply` override does not mark dirty when `__paginationMutating` is true
- [ ] `getPaginationRuntime` returns the runtime attached to editor
- [ ] `getPaginationRuntime` returns `undefined` when no runtime is attached

### Tests to Write (Transforms API — NEW implementation needed)

- [ ] `editor.tf.pagination.togglePreview()` toggles `viewMode` from `'paginated'` to `'continuous'`
- [ ] `editor.tf.pagination.togglePreview()` toggles `viewMode` from `'continuous'` to `'paginated'`
- [ ] `editor.tf.pagination.setPageSize('A4')` sets sizes to `{ width: 794, height: 1123 }`
- [ ] `editor.tf.pagination.setPageSize('Letter')` sets sizes to `{ width: 816, height: 1056 }`
- [ ] `editor.tf.pagination.setPageSize('Legal')` sets sizes to `{ width: 816, height: 1344 }`
- [ ] `editor.tf.pagination.setMargins({ top: 48, right: 48, bottom: 48, left: 48 })` updates margins
- [ ] `editor.tf.pagination.toggleHeader()` inserts `{ type: 'header', children: [{ type: 'p', children: [{ text: '' }] }] }` as first child of every page
- [ ] `editor.tf.pagination.toggleHeader()` when headers exist: removes them from all pages
- [ ] `editor.tf.pagination.toggleFooter()` inserts footer as last child of every page
- [ ] `editor.tf.pagination.toggleFooter()` when footers exist: removes them from all pages
- [ ] Toggle transforms use `withPaginationMutations` to prevent re-entry dirty marking
- [ ] Toggle transforms mark pages as dirty after mutation
- [ ] Toggle transforms return `boolean` indicating whether elements were added (`true`) or removed (`false`)

### Implementation

**`BasePaginationPlugin.ts`** — Extend the `withPagination` `OverrideEditor` to inject a `pagination` namespace into `editor.tf`:

```ts
// Inside the returned { transforms: { ... } } object, add:
pagination: {
  togglePreview: () => { ... },
  setPageSize: (size) => { ... },
  setMargins: (margins) => { ... },
  toggleHeader: () => { ... },
  toggleFooter: () => { ... },
}
```

Implementation details:
- `togglePreview`: read current `viewMode` via `editor.getOption(BasePaginationPlugin, 'viewMode')`, set to opposite via `editor.setOption`
- `setPageSize`: define `PAGE_SIZES` constant map, call `editor.setOptions` with new sizes
- `setMargins`: call `editor.setOptions` with new margins
- `toggleHeader`/`toggleFooter`: iterate all page children, check first/last child type, insert or remove. Use `withPaginationMutations` + `Editor.withoutNormalizing`.

---

## TDD Cycle 5: Reflow Engine

**File**: `packages/pagination/src/__tests__/reflowEngine.spec.ts`

### Tests to Write (existing behavior, some require DOM)

- [ ] `reflowPageBoundary` — no overflow, no underflow: returns `{ changed: false }`
- [ ] `reflowPageBoundary` — overflow with multiple children: moves overflowing children to next page, returns `{ changed: true, nextPageToContinue: pageIndex + 1 }`
- [ ] `reflowPageBoundary` — overflow creates next page when it doesn't exist
- [ ] `reflowPageBoundary` — single oversized child when `allowTextSplit: true`: splits text block
- [ ] `reflowPageBoundary` — single oversized child when `allowTextSplit: false`: returns `{ changed: false }` (no infinite loop)
- [ ] `reflowPageBoundary` — underflow pulls first child from next page, returns `{ changed: true, nextPageToContinue: pageIndex }`
- [ ] `reflowPageBoundary` — underflow with insufficient space (< `underflowThresholdPx`): no change
- [ ] `reflowPageBoundary` — underflow with no next page: no change
- [ ] `reflowPageBoundary` — underflow with candidate too large for available space: no change
- [ ] `reflowPageBoundary` — underflow with `underflow: false` in options: no change
- [ ] `reflowPageBoundary` — empty trailing page removal
- [ ] `reflowPageBoundary` — overflow beyond `overflowThresholdPx` only
- [ ] `reflowPageBoundary` — does not pollute undo history (`HistoryEditor.withoutSaving`)
- [ ] `findOverflowSplitIndex` — binary search finds first overflowing child
- [ ] `findOverflowSplitIndex` — all children fit: returns `null`
- [ ] `findOverflowSplitIndex` — empty content: returns `null`
- [ ] `splitOversizedBlock` — successfully splits text block at measured boundary
- [ ] `splitOversizedBlock` — returns `false` when editor has no `hasEditableTarget` (no React binding)
- [ ] `splitOversizedBlock` — returns `false` when `ReactEditor.toDOMRange` throws
- [ ] `splitOversizedBlock` — returns `false` when text length < 2
- [ ] `splitOversizedBlock` — returns `false` when `toDOMRange` is unavailable (non-React editor)

### Implementation

**`reflowEngine.ts:210-323`** — `splitOversizedBlock` hardening:

- [ ] Add `await new Promise(r => requestAnimationFrame(r))` before binary search to ensure DOM settled
- [ ] Add fallback path when `toDOMRange` is unavailable: proportional estimation using `fullText.length` mapped to `contentEl.clientHeight`, split point = `floor(charCount * maxHeight / contentEl.scrollHeight)`, find nearest word boundary

**`reflowEngine.ts:129-137`** — Empty page guard:

- [ ] Before removing a page, check if it's the last remaining page. If yes and it's empty, insert a default paragraph block instead of removing.

---

## TDD Cycle 6: PaginationCoordinator (Scheduling & React Integration)

**File**: `packages/pagination/src/__tests__/PaginationCoordinator.spec.tsx`

### Tests to Write

- [ ] Subscribes to runtime dirty notifications; calls `scheduleReflowFrom(minDirty)` on notification
- [ ] Debounces rapid dirty marks: multiple marks within `debounceMs` result in one reflow call with the minimum index
- [ ] Does NOT schedule reflow when `reflow.enabled` is `false`
- [ ] Does NOT schedule reflow when `canProcess` prop is `false`
- [ ] In `'leader'` collaboration mode, does NOT schedule when `isLeaderRef.current` is `false`
- [ ] In `'leader'` collaboration mode, re-rechecks leader status when election changes
- [ ] Uses `requestIdleCallback` when available, falls back to `setTimeout(0)`
- [ ] Reflow on window resize: triggers `scheduleReflowFrom(0)`
- [ ] Resize handler has its own debounce (200ms) independent of reflow debounce
- [ ] Reflow on initial mount: triggers `scheduleReflowFrom(0)`
- [ ] Reflow on `viewMode` change: triggers `scheduleReflowFrom(0)`
- [ ] While running, concurrent calls are re-scheduled instead of dropped
- [ ] Processes at most `maxPagesPerIdle` pages per idle frame, re-schedules remainder
- [ ] Stops cascade when a page has no registered DOM (`registry.getPageDom` returns undefined)
- [ ] `runningRef` guard prevents overlapping reflow runs

### Implementation

**`PaginationCoordinator.tsx:163-168`** — Add resize debounce:

- [ ] Add `resizeTimerRef` using the same `useRef<number>` pattern as `scheduledRef`
- [ ] In resize handler: clear previous timer, set new 200ms timer before calling `scheduleReflowFrom(0)`

---

## TDD Cycle 7: PageElement & React Components

**File**: `packages/pagination/src/__tests__/PageElement.spec.tsx`

### Tests to Write

- [ ] `PageElement` renders children inside content div
- [ ] In `'paginated'` mode, outer div has fixed dimensions from `documentSettings`
- [ ] In `'continuous'` mode, outer div has `width: 100%` and `height: auto`
- [ ] In `'paginated'` mode, content div has correct dimensions (`sizes - margins`)
- [ ] In `'continuous'` mode, content div has `width: 100%` and `height: auto`
- [ ] `PageElement` registers DOM refs with registry on mount
- [ ] `PageElement` unregisters DOM refs on unmount
- [ ] `PageElement` re-registers when `pageIndex` changes
- [ ] `PageElement` does not register when `registry` is null (no provider)
- [ ] `PageElement` does not register when `pageIndex` is null
- [ ] Changing `documentSettings` via `editor.setOptions` triggers re-render with new dimensions
- [ ] Changing `viewMode` via `editor.setOption` triggers re-render with correct styling

### Implementation

No changes needed — `PageElement.tsx` should already handle all above. Tests verify.

---

## TDD Cycle 8: PaginationPlugin (Integration)

**File**: `packages/pagination/src/__tests__/PaginationPlugin.spec.tsx`

### Tests to Write

- [ ] `PaginationPlugin` combined with `BasePaginationPlugin` + `PageElement` renders a page node
- [ ] `PaginationPlugin` can be configured with custom `documentSettings`
- [ ] `PaginationPlugin` can be configured with custom `reflow` options
- [ ] `PaginationPlugin` `afterEditable` render slot works (via `PaginationRegistryProvider` + `PaginationCoordinator`)
- [ ] End-to-end: typing text into a page, causing overflow, triggers reflow to next page

### Implementation

No changes needed — `index.ts` wiring is already correct. Tests verify.

---

## TDD Cycle 9: YjsIntegration (Collaboration Bridge)

**File**: `packages/pagination/src/__tests__/YjsIntegration.spec.tsx`

### Tests to Write

- [ ] `YjsPaginationBridge` renders `PaginationCoordinator` with leader election when awareness and ydoc are present
- [ ] `YjsPaginationBridge` renders `PaginationCoordinator` without leader election when awareness/ydoc are absent
- [ ] `YjsPaginationBridge` sets `canProcess` to `true` only when both `isConnected` and `isSynced` are true
- [ ] `YjsPaginationBridge` sets `canProcess` to `false` when not connected or not synced
- [ ] `YjsPaginationBridge` calls `runtime.markDirty(0)` after initial sync completes
- [ ] `YjsPaginationBridge` sets `awareness.setLocalStateField('pagination', { ready: canProcess })` on connect
- [ ] `YjsPaginationBridge` destroys leader election on unmount
- [ ] `YjsPaginationBridge` handles missing runtime gracefully

### Implementation

No changes needed — `YjsIntegration.tsx` already implements correctly. Tests verify.

---

## Coverage Matrix (100% Target)

| Source File | Functions Covered | Lines | Branches |
|---|---|---|---|
| `runtime.ts` | 2 (createRuntime, getPageIndexFromOp) | 100% | 100% |
| `registry.tsx` | 3 (Provider, register, useRegistry) | 100% | 100% |
| `leaderElection.ts` | 2 (createAlwaysLeader, createAwarenessLeaderElection) | 100% | 100% |
| `types.ts` | 0 (types only, no logic) | N/A | N/A |
| `BasePaginationPlugin.ts` | 7 (plugin, withPagination, normalizeRootChildren, wrapRootRange, withPaginationMutations, getPaginationRuntime, transforms API) | 100% | 100% |
| `refowEngine.ts` | 4 (reflowPageBoundary, findOverflowSplitIndex, splitOversizedBlock, withoutSaving) | 100% | 100% |
| `PaginationCoordinator.tsx` | 1 component (runReflow, scheduleReflowFrom, shouldProcess) | 100% | 100% |
| `PageElement.tsx` | 1 component | 100% | 100% |
| `YjsIntegration.tsx` | 1 component | 100% | 100% |
| `index.ts` | 0 (re-exports only) | N/A | N/A |

---

## Verification Criteria

- [ ] All 9 test files pass with `bun test` from `packages/pagination/`
- [ ] Coverage report (`bun test --coverage`) shows 100% line coverage and 100% branch coverage across all source files with logic
- [ ] `pnpm typecheck` passes for the pagination package (`pnpm turbo typecheck --filter=./packages/pagination`)
- [ ] `PaginationToolbarButton` dropdown toggles page preview without toast fallback
- [ ] Page size changes (A4/Letter/Legal) resize rendered pages
- [ ] Margin preset changes update page padding
- [ ] Header/footer toggles add/remove header/footer blocks
- [ ] Rapid window resize does not cause jank (200ms debounce)
- [ ] Text split path works with DOM measurement and with proportional fallback
- [ ] Empty page edge case guarded (last page never removed if it's the only page)
- [ ] All reflow mutations excluded from undo history

## Potential Risks and Mitigations

1. **[R] DOM-based reflow tests require Happy DOM to accurately report `offsetTop`, `offsetHeight`, `scrollHeight`, `clientHeight`**
   Mitigation: Happy DOM supports these properties. If edge cases fail, mock `getBoundingClientRect` / `offsetTop` on individual test elements using `Object.defineProperty`.

2. **[R] `splitOversizedBlock` binary search uses `ReactEditor.toDOMRange` which may not work in Happy DOM**
   Mitigation: The fallback proportional-estimate path (Task 5) is testable without ReactEditor. The primary path can be tested by mocking `ReactEditor.toDOMRange` to return a stub `DOMRect`. The fallback path is tested by setting `toDOMRange` to `undefined`.

3. **[R] `PaginationCoordinator` tests require mocking `requestIdleCallback` and timing control**
   Mitigation: Use `mock` from `bun:test` (already global in setup). Mock `requestIdleCallback` as `setTimeout` for deterministic test runs. Use fake timers where needed.

4. **[R] YjsIntegration tests require `@platejs/yjs` dependency which is optional**
   Mitigation: Tests import `YjsPlugin` only for the spec file; dependency is already in `devDependencies`. If import fails in test, mock `YjsPlugin` and its options.

## Alternative Approaches

1. **[Alt] Use `editor.api.pagination.*` instead of `editor.tf.pagination.*`**: More aligned with Plate convention (api = custom, tf = Slate transforms). Trade-off: must update toolbar button imports. Evaluation: keep `tf` for now to match toolbar button expectations, consider migration to `api` in a follow-up.

2. **[Alt] Skip DOM tests for reflow engine, test only logic paths**: Would miss coverage on `findOverflowSplitIndex` binary search and `splitOversizedBlock` text split. Trade-off: faster test suite but incomplete coverage. Evaluation: include DOM tests; Happy DOM handles them.

3. **[Alt] Combine all spec files into one**: Simpler file layout but harder to maintain. Trade-off: single file with 80+ tests is messy. Evaluation: keep separate files by module.
