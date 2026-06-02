# Pagination Translation — Failure Assessment

This document tracks the gaps between **premirror** (the source: a deterministic
ProseMirror-targeted snapshot→measure→compose pipeline) and the **`@platejs/pagination`**
translation. Each entry is *appended* as the audit proceeds: it never rewrites prior
findings. Severity is informal — read the "Pros / Cons" of each proposed fix before
acting.

Legend:

- **Location** — file paths and ranges that exhibit the problem.
- **What premirror does** — the source-of-truth behavior.
- **What plate does** — what the translation actually ships.
- **Why it's a failure** — the user-visible / correctness consequence.
- **Fix options** — concrete remediation paths with pros and cons.

---

## F-001 — Two parallel architectures coexist (pure pipeline vs. document mutator)

### Location

- Pure pipeline (premirror-faithful):
  - `src/layout/snapshot.ts`
  - `src/layout/compose.ts`
  - `src/layout/projection.ts`
  - `src/layout/mapping.ts`
  - `src/measure/measure.ts`
  - `src/react/geometry.ts`
  - `src/react/alignContent.ts`
  - `src/react/splitClones.ts`
  - `src/react/domMeasure.ts`
- Document mutator (the runtime path actually used):
  - `src/BasePaginationPlugin.ts` (lines 85–126, `withPagination` + `normalizeRootChildren`)
  - `src/internal/reflowEngine.ts` (entire file)
  - `src/PaginationCoordinator.tsx` (lines 70–114, `runReflow`)

### What premirror does

Quoting `src/layout/types.ts:8`: "The document model never changes — pages are a
derived projection." Premirror's composer (`packages/composer/src/index.ts`) is
*pure*: given `(MeasuredDocumentSnapshot, previous, LayoutInput)` it returns a
`LayoutOutput` of pages → frames → fragments → lines. No PM transactions are
emitted by the engine. Page chrome is rendered as a viewport overlay
(`PremirrorPageViewport` in `packages/react/src/index.tsx`).

### What plate does

The runtime path **mutates the Slate value**: `normalizeRootChildren` wraps loose
top-level blocks into synthetic `{ type: 'page', children: [...] }` elements, and
`reflowPageBoundary` moves nodes between sibling `page` elements via `moveNodes`,
`insertNodes`, `splitNodes`, and `removeNodes`. The pure pipeline under
`src/layout/**` exists but is *never called* from the React plugin chain.

### Why it's a failure

1. The model is no longer portable: any consumer reading `editor.children`
   sees `page` wrapper elements that don't exist in their schema.
2. Serialization (Markdown, HTML, DOCX) must now special-case unwrapping `page`
   or it leaks pagination state into exports.
3. Two clients running pagination produce slightly different `page` wrapping
   when their viewport widths differ — Yjs then replicates conflicting moves.
4. The premirror-faithful pipeline shipped in `src/layout/**` is dead code from
   the React surface's perspective — increasing bundle size and confusing
   readers about which path is authoritative.

### Fix options

**Option A — Delete the document mutator; ship the pure pipeline.**
- Pros:
  - Restores premirror's invariant ("document is the source of truth").
  - One implementation to test and maintain.
  - Yjs replay becomes trivial: only authored ops cross the wire.
- Cons:
  - Requires building the viewport overlay (à la `PremirrorPageViewport`) that
    Plate currently delegates to `PageElement` rendering pages as block nodes.
  - Selection / caret projection must be implemented (premirror's `MappingIndex`
    has no equivalent in plate's mapping layer — see F-004).
  - Large breaking change for any caller already shaped around `page` elements.

**Option B — Delete the pure pipeline; commit to the mutator.**
- Pros:
  - Smallest diff; ships what already runs in production.
  - Avoids the overlay/decoration rewrite.
- Cons:
  - Abandons every premirror correctness property (determinism, no model writes,
    no collab divergence).
  - Keeps tracked failures F-002, F-003, F-005, F-006 indefinitely.
  - Throws away ~800 lines of tested code.

**Option C — Bridge: run the pure pipeline as the *truth*, keep the mutator as
a fallback for non-React surfaces.**
- Pros:
  - Incremental migration; new features land on the pure path.
  - Mutator remains as the "compat" exporter for legacy callers.
- Cons:
  - Doubles the surface area to test (every behavior across two code paths).
  - Hard to keep the two paths in agreement; subtle drift will show up as
    intermittent test flakes.
  - Probably the worst long-term choice for an "editor law" package.

### Recommendation seed

Option A is the only outcome that matches the stated translation goal. Stage
it behind a `viewMode: 'projected'` flag if the breaking change is too large
to land at once.

---

## F-002 — Pure pipeline is never wired into the runtime

### Location

- `src/PaginationPlugin.ts` (whole file — 25 lines)
- `src/internal/PaginationAboveEditable.tsx` (whole file — 27 lines)
- `src/PaginationCoordinator.tsx:70-114` (`runReflow`)
- `src/layout/compose.ts` (exported but unreferenced from React entrypoints)
- `src/measure/measure.ts` (same)
- `src/react/alignContent.ts`, `src/react/splitClones.ts` (same)

### What premirror does

`packages/react/src/index.tsx:51-86` exposes `usePremirrorEngine`, which on
every `editorState` change runs `runtime.toSnapshot → measureSnapshot →
composeLayout` synchronously inside `useMemo`, then `useLayoutEffect` caches
the previous layout. The resulting `LayoutOutput` is the only authority used
by `PremirrorPageViewport` and `useProjectedSelection`.

### What plate does

`PaginationPlugin` registers `aboveEditable: PaginationAboveEditable`, which
mounts `<PaginationRegistryProvider>` and `<PaginationCoordinator />`. The
coordinator's `runReflow` reads DOM heights and calls `reflowPageBoundary`,
which mutates the document. None of `buildSnapshot`, `measureSnapshot`,
`composeLayout`, `buildMappingIndex`, `fragmentRects`, `computePageStartSpacers`,
`alignContentToLayout`, `getPageGeometry`, or `renderSplitClones` is referenced
from any non-test file outside the `src/layout/` and `src/react/` islands.

`rg --files-with-matches 'composeLayout\\(|buildSnapshot\\(|measureSnapshot\\('
src` returns *only* the files where those functions are *defined* plus their
`__tests__/*.spec.ts` neighbours.

### Why it's a failure

1. The translation effort has shipped two implementations and runs the wrong
   one. Anything fixed in the pure pipeline (widow/orphan policy in
   `compose.ts`, atomic block handling in `snapshot.ts`) has no production
   effect.
2. Reviewers reading `index.ts` cannot tell which APIs are "live": the barrel
   exports `composeLayout` alongside `BasePaginationPlugin`, suggesting both
   are part of the contract.
3. Tests for the pure pipeline pass without exercising the runtime path, so
   green CI does not imply working pagination.

### Fix options

**Option A — Replace `PaginationAboveEditable` with a pipeline-driven host.**
Write a `PaginationViewport` that runs the pure pipeline on each editor
content change (via `useEditorSelector` or `editor.children` subscription),
renders page chrome over the editable, and applies `alignContentToLayout` /
`renderSplitClones` as CSS-only side effects.

- Pros:
  - Activates the dead code immediately.
  - No model mutation, so it composes cleanly with Yjs (F-006/F-007).
  - Selection projection becomes possible once a `MappingIndex` is built
    (see F-004).
- Cons:
  - Needs an overlay container in the React tree that isn't part of Slate's
    editable subtree (or accept that `aboveEditable` is the host).
  - `PageElement` becomes inert; consumers who customized it must migrate to a
    page-chrome render prop.

**Option B — Delete the pure pipeline (mirror of F-001 Option B).**

- Pros: shrinks bundle and removes the "which path?" confusion.
- Cons: throws away the only premirror-faithful code and locks the package
  into the mutator design.

**Option C — Compute the pure layout for diagnostics only and keep mutating
the document for rendering.**

- Pros: lets tooling show "this is where the composer thinks page 3 starts"
  without changing the runtime.
- Cons: extra CPU per edit for no behavior change; the diagnostic layout and
  the mutator can disagree, which is worse than not having the layout at all.

### Recommendation seed

Option A. If shipping a viewport host is too large a change in one PR, at
minimum re-export `composeLayout` / `buildSnapshot` from a separate
`@platejs/pagination/layout` entry so the runtime barrel does not falsely
imply they're the live API.

---

## F-003 — Line-level fidelity lost (block-granularity composer)

### Location

- `src/layout/compose.ts` (whole file)
- `src/layout/types.ts:48-119` (`MeasuredBlock`, `BlockFragment`)
- `src/measure/measure.ts` (whole file)

### What premirror does

`packages/composer/src/index.ts:349-506` (`breakBlockIntoLineDrafts`) walks
every `StyledRun` inside a block, splits on `\n`, measures with
`@chenglou/pretext` (`prepareWithSegments` / `layoutNextLine`), wraps at the
last whitespace before overflow, fixes mid-word splits (`fixWordBoundarySplits`),
honours atomic runs (`run.atomic`), and emits `LineBox` / `PlacedRun` records
with per-run `x` and `width`. Selection projection in `useProjectedSelection`
relies on those per-line PM ranges (`line.pmRange.from..to`).

### What plate does

`composeLayout` consumes `MeasuredBlock { heightPx, lineCount, lineHeightPx }`
and emits `BlockFragment { lineStart, lineCount, heightPx, y }`. There is no
run, no `PlacedRun`, no per-line text, no per-line PM range, no whitespace
break logic, no word-boundary fixup, no atomic-run handling, and no
typography awareness. A "line" is just `Math.round(heightPx / lineHeightPx)`.

### Why it's a failure

1. Premirror's `widow_orphan_protection` reasons about lines that *exist*;
   plate's reasons about lines that the DOM happened to render at the moment
   of measurement. A late font load changes `lineHeightPx`, which changes
   `lineCount`, which silently shifts every page break.
2. Caret projection is impossible: nothing in plate's mapping records the
   per-line PM range, so `pmPosToLayout` cannot be implemented faithfully
   (see F-004).
3. Atomic runs (inline-void links, inline images, mentions) cannot be
   protected from being mid-broken because the composer never sees them.
4. The composer's "splittable" hint comes from `buildSnapshot` based only on
   top-level block type. Inline-level "do not break" hints from premirror
   (`atomic: true` on a `StyledRun`) have no equivalent.

### Fix options

**Option A — Adopt premirror's runs + line-drafts model verbatim.**
Import `BlockSnapshot` / `StyledRun` / `PlacedRun` shapes, port
`breakBlockIntoLineDrafts`, and integrate `pretext` (or a Slate-compatible
text shaper) for width measurement.

- Pros:
  - True premirror parity: deterministic layout, accurate widows/orphans,
    atomic-run protection, real caret projection.
  - Unlocks features that require line-level data (selection rects,
    keyboard navigation by visual line, hyphenation).
- Cons:
  - Requires a text-measurement dependency (`pretext` or canvas-based).
  - Snapshot extraction from Slate's tree is non-trivial (Slate doesn't have
    PM's `nodeSize` / `forEach` semantics).
  - Large change; touches `snapshot.ts`, `compose.ts`, `mapping.ts`,
    `measure.ts`, and every test under `src/layout/__tests__/`.

**Option B — Keep block-level composer; emit "line stub" records that hold
the DOM-measured line bottoms.**

- Pros: small diff; reuses `collectLineBottoms` from `splitClones.ts`.
- Cons:
  - Layout becomes DOM-dependent and non-deterministic across machines.
  - Yjs / SSR / headless tests can't run the composer.
  - Still no PM ranges per line, so caret projection remains impossible.

**Option C — Treat block-level as a deliberate scope reduction; document it.**
Mark every "line" feature as out-of-scope and remove the line-related fields
from `BlockFragment`.

- Pros: zero work; honest about current capability.
- Cons: kills the most valuable premirror properties; admits the translation
  is a downgrade.

### Recommendation seed

Option A, sequenced after F-001/F-002. There is no way to deliver real caret
projection or correct widows/orphans without line-level data.

---

## F-004 — No PM/Slate-position ↔ layout mapping

### Location

- `src/layout/mapping.ts` (whole file)
- `src/layout/projection.ts:30-83` (`fragmentRects`, `blockLinePosition`)
- (absent) — no equivalent of premirror's `MappingIndex.pmPosToLayout` /
  `layoutToPmPos`.

### What premirror does

`packages/composer/src/index.ts:556-598` builds a sorted `LineRef[]` index and
exposes `pmPosToLayout(pmPos): LayoutPoint | null` and the inverse. Selection
projection (`useProjectedSelection` in `packages/react/src/index.tsx:328-344`)
walks every `LineBox.pmRange` to emit rects for any PM range.

### What plate does

`MappingIndex` only exposes `fragmentsOfBlock`, `pageOfBlock`, and
`fragmentOfBlockLine(blockIndex, lineIndex)`. There is **no** function from a
Slate `Point` (or even a top-level path) to a `LayoutPoint`, and no inverse.

### Why it's a failure

1. The package cannot project the editor's selection onto page coordinates.
   Any caller wanting "scroll caret into view across pages" must duplicate
   the work outside the package.
2. Plugins that draw decorations relative to the page (page-anchored
   tooltips, footnote markers, sidebar comments aligned to caret line) have
   no public API.
3. `fragmentOfBlockLine(blockIndex, lineIndex)` assumes a *single* line index
   per block — but a block can have multiple lines and the index is in
   "line within block", which the caller must compute outside this package
   (using DOM, not the layout) because the composer never records line PM
   ranges (F-003).

### Fix options

**Option A — After F-003, add `pmPosToLayout` / `layoutToPmPos` to
`MappingIndex`.** Requires line-PM ranges to exist.

- Pros: closes the contract gap; matches premirror exactly.
- Cons: dependent on F-003.

**Option B — Approximate via Slate `Path` ↔ `BlockFragment`.**
Expose `pathToFragment(path: Path)` and `fragmentToPath(ref)` only.

- Pros: shippable today against the current block-level model.
- Cons: cannot resolve to a *line* or a caret offset; degrades when blocks
  span pages.

**Option C — Defer entirely; advertise pagination as "visual only".**

- Pros: nothing to build.
- Cons: makes the package useless for accessibility, keyboard navigation,
  caret-tracking comments, and most premirror-class features.

### Recommendation seed

Option B today (cheap, useful for split-block rendering), Option A after
F-003 lands.

---

## F-005 — Reflow emits Yjs ops; collab peers diverge

### Location

- `src/internal/reflowEngine.ts:21-27` (`withoutSaving`)
- `src/internal/reflowEngine.ts:104-117, 167-181, 217-225, 382-411`
  (all `editor.tf.moveNodes`, `insertNodes`, `removeNodes`, `splitNodes`
  calls inside reflow)
- `src/yjs/YjsIntegration.tsx:12-56` (the bridge that pretends collaboration
  is safe)
- `src/leaderElection.ts` (the gate that's supposed to prevent the divergence)

### What premirror does

The composer mutates nothing. Pagination output is a derived value; collab
peers see the same `editorState` and independently render the same
`LayoutOutput`. Selection rects can differ per peer (different viewport
widths) without producing transactions.

### What plate does

`reflowPageBoundary` issues Slate transforms that **are** persisted to the
document. `withoutSaving` only wraps them with `HistoryEditor.withoutSaving`,
which suppresses undo entries but **not** Yjs CRDT updates — the Yjs binding
observes the resulting Slate operations and replicates them. The bridge tries
to elect a single "leader" peer (`collabOpts.mode === 'leader'`), but:

1. The leader gate is checked only in `shouldProcess()` *inside* the React
   coordinator. `normalizeRootChildren` (called from `withPagination` and
   `normalizeInitialValue`) runs on every peer regardless of leader status,
   so initial wrapping conflicts on first sync.
2. `createAwarenessLeaderElection` picks "min client id with
   `pagination.ready === true`". Until the first peer flips
   `awareness.setLocalStateField('pagination', { ready: true })`, *every*
   peer thinks it is the leader (`clientId === clientId`) and proceeds.
3. Reflow happens after a debounce + idle callback; two peers can both pass
   the leader check, both move nodes, and produce conflicting CRDT updates.

### Why it's a failure

1. Two peers editing the same document produce different page counts after a
   resize race, then replicate those page boundaries to each other, producing
   double-wraps or empty pages that the next reflow tries to "fix" — an
   amplification loop.
2. Cursor position references baked into Yjs anchors can land *inside* the
   synthetic `page` element after wrapping, and become invalid when the
   other peer un-wraps.
3. Server-persisted documents now carry layout-time decisions: opening the
   same JSON in a different viewport will trigger more wrapping ops,
   permanently growing the document.

### Fix options

**Option A — Make pagination purely projected (F-001 Option A).**
- Pros: collab safety becomes definitional; no ops to replicate.
- Cons: requires the F-001 rewrite.

**Option B — Tag reflow ops with a meta flag and have the Yjs binding skip
them.**
- Pros: minimal change; works with the current mutator architecture.
- Cons: requires upstream `@platejs/yjs` support; introduces an op-level
  contract that all collab plugins must honor. Easy to miss in third-party
  bindings.

**Option C — Strict leader-only reflow, gated *before* initial normalize.**
Hoist `isPaginationMutating` and leader checks into `normalizeInitialValue`
and `withPagination.normalizeNode`.

- Pros: keeps the mutator design; works today.
- Cons: a follower joining mid-document still sees the leader's `page`
  wrappers materialize as CRDT inserts, which is the same divergence in
  slow-motion. Also: "what if the leader leaves?" — promotion mid-edit will
  reflow against the new leader's viewport and re-wrap everything.

### Recommendation seed

Option A. Anything else is a guard against a problem the design created.

---

## F-006 — Measure cache key vs. cache map disagree on dimensionality

### Location

- `src/measure/measure.ts:52-79`

### What premirror does

`pretextWidthCache` (`packages/composer/src/index.ts:24-42`) keys by
`${font}\n${text}`, so width depends only on the inputs to measurement.

### What plate does

```ts
const cacheKey = `${block.id}@${widthPx}`;
const cached = cache?.get(block.id);          // ← keyed by id alone
if (cached && cached.key === cacheKey) { ... }
else {
  metrics = measure(block);
  if (metrics && cache) cache.set(block.id, { key: cacheKey, metrics });
}
```

The `MeasureCache` is `Map<string, { key: string; metrics }>` keyed by
`block.id`, but the *logical* key includes `widthPx`. The cache holds **one
slot per block**, not one per (block, width) pair. Two viewports measuring
the same document at different widths thrash a single cache entry, each
invalidating the other's measurement.

### Why it's a failure

1. Resize storms invalidate the cache even when the new width is one the
   document was just measured at — defeats the cache's purpose.
2. Two side-by-side editors (e.g., comparison view) trample each other's
   measurements.
3. The bug is silent: cache hits become rare but nothing logs the miss rate,
   so performance regressions look like "measurement is slow" rather than
   "cache doesn't cache".

### Fix options

**Option A — Key the map by the composite key.**
```ts
cache.set(`${block.id}@${widthPx}`, { metrics });
const cached = cache?.get(`${block.id}@${widthPx}`);
```
- Pros: one-line fix; correct cache semantics.
- Cons: cache grows unbounded with viewport-width changes; needs an LRU or
  width-bucket eviction.

**Option B — Cache per-width as nested maps.**
`Map<blockId, Map<widthPx, metrics>>`.
- Pros: explicit; easy to evict a whole block on content change.
- Cons: slightly more code; same unbounded-growth concern.

**Option C — Quantize `widthPx` (snap to nearest 16px) before keying.**
- Pros: bounds the cardinality of cached widths.
- Cons: introduces fuzz; needs justification per content type. A 1px width
  delta usually doesn't matter for block height; sometimes it does
  (justification, RTL, long URLs).

### Recommendation seed

Option A first (correctness), Option C later as an optimization with a
measured cache hit-rate baseline.

---

## F-007 — `getPageIndexFromOp` confuses path with page index

### Location

- `src/internal/runtime.ts:49-60`
- `src/BasePaginationPlugin.ts:96-105` (consumer)

### What premirror does

Premirror tracks invalidation as a *PM position range*
(`PremirrorInvalidationState = { from: number; to: number }` in
`packages/prosemirror-adapter/src/index.ts:49-81`). The range covers the
changed PM positions; recomposition recomputes any block touching that range.

### What plate does

```ts
export function getPageIndexFromOp(op: Operation): number | null {
  const indices: number[] = [];
  if ('path' in op && op.path.length > 0) indices.push(op.path[0]);
  if ('newPath' in op && op.newPath.length > 0) indices.push(op.newPath[0]);
  return indices.length ? Math.min(...indices) : null;
}
```

`op.path[0]` is only the page index *if the document is currently wrapped*.
That wrapping is itself produced by reflow, so during initial normalize or
between `normalizeRootChildren` calls, `op.path[0]` is a top-level block
index, not a page index. Worse, `set_selection` operations don't have a
`path` at all — they're ignored entirely.

### Why it's a failure

1. Before the first wrap, `markDirty(blockIndex)` marks a *block* as dirty
   but the coordinator reads it as a *page* index, so reflow starts from
   the wrong DOM node (or `getPageDom(blockIndex)` returns `undefined` and
   reflow silently no-ops).
2. After `wrapRootRange`, a `move_node` op might use `path: [3]` (moving
   block 3 inside the wrap operation) — the runtime then marks "page 3"
   dirty even when there are only 2 pages, polluting the dirty set with
   nonexistent indices.
3. Operations from `set_node` deep inside a block (`path: [0, 5, 1, 0]`)
   correctly mark page 0 dirty, but a `set_node` on the *root selection*
   carries no path, so caret-only changes never invalidate.

### Fix options

**Option A — Resolve `op.path` to a page index by walking the live tree.**
Look up the ancestor `page` element of the given path and emit its index.

- Pros: correct semantics; works regardless of wrap state.
- Cons: requires reading `editor.children` per op (cheap, but synchronous);
  still breaks during wrap-in-progress.

**Option B — Move from "page dirty" to "block dirty" sets.**
Track the set of block paths (or PM-equivalent positions) and let the
coordinator compute which page to start reflow from after looking up the
current layout.

- Pros: matches premirror's invalidation model; survives re-wrapping.
- Cons: requires F-001 / F-002 since "block dirty → page" needs the layout
  index.

**Option C — Mark "everything dirty" (`markDirty(0)`) on every op.**

- Pros: trivially correct.
- Cons: kills the entire incremental reflow optimization; pagination becomes
  O(pages) per keystroke.

### Recommendation seed

Option B once the pure pipeline is live. Until then, Option A as a
correctness patch.

---

## F-008 — Coordinator races: mutation guard doesn't span the async reflow

### Location

- `src/PaginationCoordinator.tsx:70-114` (`runReflow`)
- `src/internal/editorRegistry.ts:21-31` (`withPaginationMutations`)
- `src/internal/reflowEngine.ts:107-117, 178-184, 218-225` (mutation sites)

### What premirror does

Layout is synchronous within a React commit (`useMemo` inside
`usePremirrorEngine`). There is no "are we currently paginating?" flag
because there is no asynchronous mutation.

### What plate does

`runReflow` is `async` and awaits a `requestAnimationFrame` before mutating.
Each call to `reflowPageBoundary` *internally* wraps its `editor.tf.moveNodes`
in `HistoryEditor.withoutSaving`, but **not** in `withPaginationMutations`.
The `mutating` `WeakSet` is set only inside specific transforms
(`paginationTf.withMutations(...)` in `splitOversizedBlock`,
`_withPaginationMutations` in `toggleHeader` / `toggleFooter`).

So in the normal overflow path:

1. `runReflow` schedules an idle callback.
2. User types between rAF and the mutation.
3. The typed op fires `apply` → `markDirty(pageIndex)` → notifies subscribers.
4. The subscriber `consumeDirtyMin()` clears the set and reschedules.
5. `runReflow` then calls `moveNodes`, which fires its own `apply` →
   `getPageIndexFromOp` returns a page index → `markDirty` again →
   another reflow scheduled.

`isPaginationMutating` returns `false` for the reflow's own ops because
nothing in `reflowPageBoundary`'s overflow branch wraps with
`_withPaginationMutations`.

### Why it's a failure

1. Reflow ops re-enter the dirty queue, producing a self-sustaining reflow
   loop on any document larger than `maxPagesPerIdle`.
2. User keystrokes during reflow can land in a DOM node that the mutator is
   about to move; the selection is then placed in a node that no longer
   exists, throwing `NodeNotFoundError`.
3. The guard exists for `splitOversizedBlock` and the toggle transforms but
   not the hot path, so the asymmetry is silent and easy to regress.

### Fix options

**Option A — Wrap the entire `reflowPageBoundary` call in
`_withPaginationMutations`.**
Move the guard into the coordinator:
```ts
withPaginationMutations(editor, () => {
  reflowPageBoundary(editor, page, ctx);
});
```

- Pros: closes the loop; one line in the coordinator.
- Cons: any *legitimate* user op interleaved between rAF and the mutation is
  also marked as "pagination", suppressing its dirty notification. This is
  usually fine (the next reflow tick covers it) but rare interleavings can
  drop edits from the dirty set.

**Option B — Make reflow synchronous and run inside `flushSync`.**

- Pros: no race window.
- Cons: blocks the main thread during layout; defeats the idle scheduling
  that's the whole point of the coordinator.

**Option C — Track op causality via op metadata (Slate's `op.tags`).**
Tag every reflow op as `{ source: 'pagination' }` and skip those in the
runtime.

- Pros: clean separation; works even across async boundaries.
- Cons: Slate operations don't carry metadata by default; requires wrapping
  the editor to add it. Plus collab bindings must propagate the tag, which
  most don't.

### Recommendation seed

Option A. The race is real and Option B's perf hit is unacceptable for large
documents.

---

## F-009 — `findOverflowSplitIndex` linear-scan fallback returns the wrong split

### Location

- `src/internal/reflowEngine.ts:231-277`

### Symptom

```ts
if (!monotonic) {
  for (let i = 0; i < children.length; i++) {
    const bottom = children[i].offsetTop + children[i].offsetHeight;
    if (bottom > maxHeight) return i;
  }
  return null;
}
```

The fallback returns the first child whose *bottom* exceeds `maxHeight`. In
a non-monotonic layout (CSS columns, absolute positioning, `flex` with
`order:`), the first child *in document order* whose bottom overflows is
not necessarily the first child *visually* overflowing. The mutator then
moves the wrong subset of children to the next page, leaving the actual
overflowing content in place — so the same page reflows infinitely.

### Why it's a failure

1. Any consumer using multi-column layout, floats, or
   `position: absolute` blocks triggers an infinite reflow loop.
2. The "infinite loop" is partially masked by `maxPagesPerIdle: 6`, so the
   symptom is "pagination just stops working after a resize" rather than a
   hang.
3. The binary-search path also makes the same assumption (children sorted by
   `offsetTop`), so if a customization makes the layout monotonic *except*
   for one outlier, the binary search converges to a child near the outlier
   but not necessarily the first overflower.

### Fix options

**Option A — Sort children by `offsetTop + offsetHeight` first; then linear
scan.**
- Pros: handles any layout deterministically.
- Cons: O(n log n) per reflow; for documents with thousands of top-level
  blocks per page (rare) that's measurable.

**Option B — Pre-flight detect "is this page layout pageable?" and refuse to
reflow non-monotonic layouts.**
- Pros: prevents the corruption.
- Cons: silently disables pagination for multi-column / flex `order:` users.

**Option C — Replace heuristic with a layout-aware split derived from
`composeLayout` (after F-002 lands).**
- Pros: deterministic, layout-agnostic; the composer already knows where
  pages break.
- Cons: requires the pure pipeline to be live.

### Recommendation seed

Option A as a stopgap, Option C as the final answer.

---

## F-010 — `splitOversizedBlock` is unsound under decorations and inline voids

### Location

- `src/internal/reflowEngine.ts:279-418`

### What it does

Binary-searches a text offset in a block using `editor.api.string(blockPath)`
character offsets, converts each midpoint to a Slate `Point` via
`pointAtOffset`, builds a Slate `Range`, and calls `ReactEditor.toDOMRange`
to read the DOM bottom. The first midpoint with `rect.bottom <= maxBottom`
becomes the split point.

### Why it's a failure

1. `editor.api.string(blockPath)` concatenates text leaves without
   accounting for inline voids (`<mention />`, `<image />`,
   `<equation />`). The character offset returned by `pointAtOffset` for a
   midpoint inside a void is "inside the void's surrounding zero-width
   text" — splitting there either errors (Slate refuses to split a void) or
   silently splits *around* the void on one side.
2. Slate `Range` decorations (search highlights, comments, suggestions)
   alter the DOM range layout; the `getBoundingClientRect()` reading is
   then unstable across keystrokes.
3. Some decorations wrap the range in a separate DOM node with its own
   line box, producing a `rect.bottom` reading that depends on whether the
   decoration is currently mounted — pagination becomes non-deterministic.
4. The fallback "proportional estimate" (`maxHeight / scrollHeight * length`)
   ignores font kerning and is wrong by tens of percent for justified text.

### Fix options

**Option A — Limit `allowTextSplit` to blocks with no inline voids and no
active decorations.**
Inspect `editor.api.nodes` first and bail if any non-text descendant is
present, or if `editor.api.decorate` returns non-empty for the range.

- Pros: avoids the unsoundness in practice.
- Cons: most rich content has decorations; option degenerates to "never
  split", reintroducing the oversized-block hang.

**Option B — Use the `composeLayout` result to know exactly how many lines
fit, then split at `lineStart + lineCount` (after F-002/F-003).**

- Pros: deterministic; respects voids and decorations because they're known
  to the composer.
- Cons: requires F-003's line-level layout to exist.

**Option C — Stop splitting oversized blocks; place them whole and let them
overflow visually (with a debug warning).**

- Pros: trivial; matches the "atomic block" handling in
  `composeLayout` lines 105-121.
- Cons: tall content (long tables, code blocks) overflows the visible page;
  users see a clipped paragraph and lose content visually.

### Recommendation seed

Option C in the short term (correctness over feature), Option B as the
permanent fix once the pure pipeline lands.

---

## F-011 — `domMeasure.createDomMeasure` ignores the configured content width

### Location

- `src/react/domMeasure.ts:34-46`
- `src/measure/measure.ts:30-50` (declared `widthPx` in `MeasureOptions`)

### What it does

```ts
return (block) => {
  const dom = topLevelBlockElements(editable)[block.path[0]];
  if (!dom) return null;
  return {
    heightPx: dom.offsetHeight,
    lineHeightPx: resolveLineHeight(getComputedStyle(dom)),
  };
};
```

The measurement reads `dom.offsetHeight` at the *current* DOM width, never
consulting the `widthPx` that `measureSnapshot` was called with. The cache
key (already broken — see F-006) records `widthPx` as if it were the
measurement geometry, but the measurement was actually taken at whatever
width the live editable happened to be at that moment.

### Why it's a failure

1. If the coordinator calls `measureSnapshot({ widthPx: 720 })` but the
   editable is currently rendered at 600px (because the page chrome hasn't
   applied the new size yet), the cache stores the wrong height under the
   `@720` key.
2. After the user resizes from 720 → 480, the cache returns the *720* entry
   for the 480-width measurement, because nothing actually re-measured at
   480.
3. Side-by-side editors with the same document at different widths get the
   same heights, then look broken when the layouts diverge from reality.

### Fix options

**Option A — Render the block into a hidden offscreen iframe / shadow root
sized to `widthPx`, measure there.**

- Pros: width-correct; no interference with the live editable.
- Cons: heavy; needs a parallel React tree or a serialized HTML clone;
  consumers must ensure their styles apply to the measurement frame.

**Option B — Trust the live DOM and remove `widthPx` from the measurement
contract entirely.**

- Pros: honest about what the measurer actually does.
- Cons: cache keys become meaningless; same content at different widths
  collides; documents with one editor only "work" because of luck.

**Option C — Apply `width: ${widthPx}px` temporarily to the DOM block,
measure, restore.**

- Pros: width-correct without a separate tree.
- Cons: causes layout thrash (synchronous reflow per block); measurable on
  large documents; can flash content during measurement.

### Recommendation seed

Option B is the honest short-term move (and forces F-006 to be re-thought).
Option A is the right long-term answer.

---

## F-012 — `normalizeRootChildren` wraps on *every* peer at sync time

### Location

- `src/BasePaginationPlugin.ts:128-158, 311-333` (`normalizeInitialValue`,
  `normalizeRootChildren`)
- `src/BasePaginationPlugin.ts:139-154` (`onNodeChange` re-runs the wrap)

### What premirror does

The "is this content paginated?" question never touches the document. Each
peer composes its own layout from the shared document state.

### What plate does

`normalizeInitialValue` calls `normalizeRootChildren(editor, type)` on first
mount, *before* leader election can resolve. Every peer that opens the
document at roughly the same time runs the wrap, each producing an
independent set of `insert_node` / `move_node` operations for the synthetic
`page` element. Yjs then merges those concurrent inserts, producing
*duplicate* `page` ancestors that the next normalize tries to unwrap (`if
ElementApi.isElement(node) && node.type === type && path.length !== 1
{ editor.tf.unwrapNodes ... }`), which produces *more* ops, which produces
more conflicts.

### Why it's a failure

1. First-sync convergence is undefined: two peers opening simultaneously
   may end up with N+1 nested pages, then race to unwrap.
2. The unwrap rule `path.length !== 1` only catches strict nesting; pages
   accidentally created at sibling positions of legitimate pages are not
   detected as duplicates.
3. The "rescue" `onNodeChange` handler that re-wraps non-page roots will
   *re-create* the conflict immediately after the unwrap settles.
4. Stored documents that *already* contain `page` wrappers (saved by a
   previous session) are correct on load, but if anyone opens the doc in a
   schema without `BasePaginationPlugin`, the `page` wrappers persist as
   unknown elements — pagination becomes a serialization concern.

### Fix options

**Option A — Move wrapping out of normalize and into a render-time
projection (F-001 Option A).**

- Pros: deletes the entire failure class.
- Cons: requires the full pure-pipeline migration.

**Option B — Make wrapping leader-only; followers ignore the wrap.**

- Pros: works inside the mutator architecture.
- Cons: a follower opening alone is its own leader and wraps anyway. As
  soon as a second peer joins, the duplicates appear. The fix is
  fundamentally racy.

**Option C — Store pagination metadata in `editor.meta` (a separate Yjs
sub-document, ignored by serialization), and never wrap the main tree.**

- Pros: keeps the main document portable; gives a place for layout state.
- Cons: pages-as-nodes is what `PageElement` renders today; changing that
  invalidates every customization. Effectively requires F-001.

### Recommendation seed

Option A. The mutator design cannot be patched into collab safety.

---

## F-013 — `PaginationAboveEditable` cannot be replaced; double-coordinator hazard

### Location

- `src/PaginationPlugin.ts:20-25`
- `src/yjs/YjsIntegration.tsx:12-56`

### What it does

`PaginationPlugin` is `toPlatePlugin(BasePaginationPlugin, { render: {
aboveEditable: PaginationAboveEditable } })`. `PaginationAboveEditable`
hard-mounts both `PaginationRegistryProvider` *and*
`<PaginationCoordinator />`. There is no way to swap one without the other.

Consumers wanting the Yjs bridge mount `<YjsPaginationBridge />` separately,
which itself renders a *second* `<PaginationCoordinator />` with a leader
election. Both coordinators subscribe to the same runtime and both call
`runReflow`.

### Why it's a failure

1. With two coordinators, every dirty page triggers two `runReflow`
   invocations. The "first wins" race is decided by whichever subscriber
   `consumeDirtyMin()` first; the second sees `dirty.size === 0` and
   no-ops. But under load both can win for *different* indices.
2. The second coordinator misses the leader election entirely — it was
   mounted by `PaginationAboveEditable` with `leaderElection: undefined`,
   so it uses `createAlwaysLeader`. Meanwhile the Yjs coordinator does
   leader-gating. Followers run reflow via the always-leader coordinator
   even when the Yjs gate would block them.
3. There is no `unmountCoordinator` / `disableCoordinator` option, so the
   bug cannot be fixed by configuration.

### Fix options

**Option A — Add a `mountCoordinator: boolean` option (default true).**
Allow `PaginationAboveEditable` to skip the coordinator when the consumer
provides their own.

- Pros: smallest change; fixes the Yjs bridge case.
- Cons: another boolean knob; consumers must remember to flip it; default
  remains lossy for Yjs users who forget.

**Option B — Make the coordinator side a separate React plugin extension
(e.g., `PaginationCoordinatorPlugin`) that consumers compose in.**

- Pros: opt-in by construction; no double-mount.
- Cons: breaks the "just register `PaginationPlugin` and it works" promise.

**Option C — Detect a mounted coordinator in the runtime and short-circuit
the second one.**

- Pros: zero API change.
- Cons: introduces a hidden global; debuggability worsens.

### Recommendation seed

Option B aligns with how Yjs and history plugins are composed elsewhere in
Plate.

---

## F-014 — Yjs bridge waits for sync but trusts `_isConnected` / `_isSynced` internals

### Location

- `src/yjs/YjsIntegration.tsx:14-22`

### What it does

```ts
const isConnected = usePluginOption(YjsPlugin, '_isConnected');
const isSynced    = usePluginOption(YjsPlugin, '_isSynced');
const canProcess  = Boolean(isConnected && isSynced);
```

These option keys are explicitly prefixed `_` — by convention, internal /
unstable. The bridge depends on them being read-only signals.

### Why it's a failure

1. `_isConnected` / `_isSynced` are not part of `@platejs/yjs`'s public API.
   A minor-version bump to the Yjs plugin can rename or remove them, and
   the pagination bridge silently degrades to "never paginate" (always
   false) or "always paginate" (undefined coerced to false in the boolean).
2. Tests for `YjsIntegration.spec.tsx` mock these directly, so the public
   API breakage is invisible until production.

### Fix options

**Option A — Subscribe to the underlying Yjs provider events
(`y-websocket` / `y-webrtc` emit `status` / `sync`) directly.**

- Pros: no dependency on unstable plugin internals.
- Cons: requires the bridge to know about the provider type; couples to
  specific Yjs providers.

**Option B — Lobby `@platejs/yjs` to expose stable `isConnected` /
`isSynced` selectors and use those.**

- Pros: clean upstream contract.
- Cons: requires cross-package coordination; not actionable from this
  package alone.

**Option C — Add a `canProcess?: boolean` prop on `YjsPaginationBridge` and
let the consumer wire it up.**

- Pros: pushes the policy decision to the integrator.
- Cons: every consumer has to learn how to detect Yjs sync; defeats the
  purpose of a bridge.

### Recommendation seed

Option B, with Option A as the transitional implementation.

---

## F-015 — `runReflow` calls `requestAnimationFrame` unconditionally in SSR

### Location

- `src/PaginationCoordinator.tsx:81-83`
- `src/internal/scheduleIdle.ts:7-17` (which *does* SSR-guard)

### What it does

```ts
runningRef.current = true;
try {
  await new Promise((r) => requestAnimationFrame(r));
  ...
```

`requestAnimationFrame` is a `window` global; on Node `globalThis.requestAnimationFrame`
is `undefined`. Calling it raises `ReferenceError`.

### Why it's a failure

1. Server-render of a Plate document with `PaginationPlugin` registered
   throws if `runReflow` is invoked (it is, by `scheduleReflowFrom(0)` in
   the mount effect — and effects can fire during hydration depending on
   the React version).
2. `scheduleIdle` is SSR-safe, but the rAF inside `runReflow` is not, so
   the safety guarantee leaks.
3. Static site generators (Next.js `getStaticProps`, Remix's loader) trip
   this if any code path renders the editor.

### Fix options

**Option A — Guard the rAF with `typeof window !== 'undefined'`.**

- Pros: trivial.
- Cons: still relies on `window` directly; the function shape becomes
  "promise that may never resolve in SSR".

**Option B — Bail at the top of `runReflow` when `typeof window ===
'undefined'`.**

- Pros: identical SSR contract to `scheduleIdle`.
- Cons: code paths that *want* to run a "headless" reflow (for snapshotting
  during SSR) lose the option.

**Option C — Inject the scheduler so tests can replace `rAF` with a
synchronous shim.**

- Pros: improves testability.
- Cons: more plumbing for one line of code.

### Recommendation seed

Option B; the package isn't designed for headless pagination today.

---

## F-016 — `PageElement` registry effect re-runs on every render with `pageIndex` change

### Location

- `src/PageElement.tsx:22-40`
- `src/registry.tsx:24-32`

### What it does

```ts
const path = usePath(BasePaginationPlugin.key);
const pageIndex = typeof path?.[0] === 'number' ... ? path[0] : null;

useEffect(() => {
  if (!registry || pageIndex === null || !outerRef.current || !contentRef.current)
    return;
  return registry.registerPage(pageIndex, {
    outer: outerRef.current,
    content: contentRef.current,
  });
}, [registry, pageIndex]);
```

`usePath` returns a fresh array reference on every render. `pageIndex` is
a primitive so the dep array is fine, but when the mutator moves pages
around, page 2 becomes page 1 — the effect on the *previous* page-2
instance cleans up (deletes the entry from the registry under key `2`)
*after* the new page-1 instance has already registered its DOM under key
`1`. Order is non-deterministic across React 18 strict-mode double-effects.

### Why it's a failure

1. After every reflow that renumbers pages, the registry may briefly miss
   the entry for the renumbered page until both effects settle. A reflow
   scheduled during that window calls `getPageDom(pageIndex)` → `undefined`
   → silently no-ops.
2. The cleanup guard `if (current?.outer === dom.outer) delete` is meant
   to prevent stale deletes, but it's racy: the next register call writes
   the new `outer` ref *under the same `pageIndex`*, then the stale
   cleanup deletes it because `current?.outer === dom.outer` is true (same
   DOM node — pages share the same `<div>` recycled by React's keyed
   reconciliation).

### Fix options

**Option A — Key page DOM by a stable identity (e.g., Slate node `id`),
not by `path[0]`.**

- Pros: stable across reflow / moves.
- Cons: requires Slate elements to carry stable ids; `PageElement` doesn't
  set one today.

**Option B — Re-register on every render via `useLayoutEffect` with no
deps (always re-runs).**

- Pros: registry is always current.
- Cons: every commit triggers a registry write; perf cost on large docs.

**Option C — Treat the registry as an inversion: pages publish their refs
into a context that `PaginationCoordinator` reads via `forwardRef`s
keyed by Slate path, computed at read time.**

- Pros: lazy and racefree.
- Cons: bigger refactor.

### Recommendation seed

Option A; in the meantime, document the race and add a "registry stale"
log in dev.

---

## F-017 — Tests don't exercise the runtime path under collaboration or SSR

### Location

- `src/__tests__/YjsIntegration.spec.tsx` (mostly mocks)
- `src/__tests__/PaginationCoordinator.spec.tsx`
- `src/__tests__/reflowEngine.spec.ts` (uses `Object.defineProperty` to fake
  `offsetHeight` / `scrollHeight`)
- (absent) — no test asserts cross-peer page convergence; no test asserts
  SSR-safety; no test asserts behavior with `splittable: false`; no test
  exercises the pure pipeline against the runtime.

### What premirror does

The composer has unit tests against deterministic snapshots; the React
layer is tested with real `editorState` transitions. SSR safety is implicit
because the composer is pure.

### What plate does

Tests are split between:
1. **Pure pipeline tests** (`src/layout/__tests__/*`, `src/measure/__tests__/*`,
   `src/react/__tests__/*`) — green, exercise dead code (F-002).
2. **Runtime mutator tests** (`src/__tests__/reflowEngine.spec.ts`,
   `BasePaginationPlugin.spec.ts`) — exercise the live path but fake DOM
   metrics via `Object.defineProperty`. No real layout reflow is invoked.
3. **Coordinator tests** — mock `runReflow` rather than exercising it.

### Why it's a failure

1. CI cannot detect any of F-005, F-008, F-012, F-015, F-016 because the
   relevant scenarios are mocked away.
2. Refactors that change the runtime path can pass all "pure" tests while
   breaking production behavior.
3. The pure pipeline's tests are the strongest evidence in the repo, yet
   none of that code runs.

### Fix options

**Option A — Add integration tests with a real jsdom that mounts the
editor, types content, and asserts the resulting page boundaries.**

- Pros: catches end-to-end regressions.
- Cons: jsdom layout is not real CSS; some failures only show up in real
  browsers (Playwright / Cypress).

**Option B — Promote the pure pipeline tests to "the" contract; deprecate
the mutator-specific tests after F-001.**

- Pros: focuses test effort on the desired final architecture.
- Cons: requires F-001 / F-002 to land first.

**Option C — Add cross-peer convergence tests with a fake Y.Doc.**

- Pros: catches F-005 / F-012.
- Cons: setting up Yjs in unit tests is non-trivial; tests are slow.

### Recommendation seed

Option B is the strategic direction; Option C is the highest-value tactical
test to add immediately.

---

## F-018 — `reflowEngine` is hard-coupled to `slate-react` / `slate-history`

### Location

- `src/internal/reflowEngine.ts:12-13`
  ```ts
  import { HistoryEditor } from 'slate-history';
  import { ReactEditor } from 'slate-react';
  ```
- `src/internal/reflowEngine.ts:287` (`if (!('hasEditableTarget' in editor))`)
- `src/internal/reflowEngine.ts:332` (`const toDOMRange = ReactEditor.toDOMRange`)

### What premirror does

The composer is framework-agnostic. ProseMirror coupling lives in the
adapter (`packages/prosemirror-adapter`), not the layout engine. The
composer can run in any environment that produces a `MeasuredDocumentSnapshot`.

### What plate does

`reflowEngine.ts` *is* the layout engine for the live path, but it
unconditionally imports `slate-react` and `slate-history` at module top
level. Consumers using `@platejs/core` headless (server-side rendering,
markdown converters, AI agents that mutate a Slate value without a React
host) cannot import the package without dragging in React.

### Why it's a failure

1. The package's `BasePaginationPlugin` is supposed to be headless (`Base*`
   convention everywhere in Plate), but importing it transitively pulls
   `slate-react`. Tree-shaking can't drop the React import because of how
   the engine references `ReactEditor.toDOMRange`.
2. Tests that want to verify `BasePaginationPlugin` semantics without React
   end up loading React anyway.
3. The "Base/React" split that the rest of `@platejs/*` enforces is
   broken here — readers can't trust the convention.

### Fix options

**Option A — Inject the DOM split function as a dependency of `withPagination`.**
Move all `ReactEditor` calls into `PaginationPlugin` (React layer), pass a
`splitOversizedBlock?: (editor, path) => boolean` callback into the base
plugin options.

- Pros: restores the Base/React split.
- Cons: more wiring; consumers replacing the splitter must implement a
  non-trivial function.

**Option B — Lazy-load `slate-react` inside `splitOversizedBlock` using a
dynamic `import()`.**

- Pros: minimal API change.
- Cons: introduces async into a synchronous code path; React bundlers
  often refuse to code-split for that pattern.

**Option C — Drop `splitOversizedBlock` entirely (F-010 Option C).**

- Pros: removes the React coupling along with the unsound feature.
- Cons: loses the only path that handles oversized single blocks.

### Recommendation seed

Option A; Option C as a stop-gap until the React layer ships its own splitter.

---

## F-019 — `projection.fragmentRects` rebuilds the mapping index on every call

### Location

- `src/layout/projection.ts:31-57, 60-83`

### What it does

```ts
export function fragmentRects(layout, geometry, blockIndex) {
  const mapping = buildMappingIndex(layout);   // ← per call
  ...
}
export function blockLinePosition(layout, geometry, blockIndex, lineIndex, lineHeightPx) {
  const mapping = buildMappingIndex(layout);   // ← per call
  ...
}
```

Each invocation walks all pages × frames × fragments to construct the index.
A consumer rendering N split-block clones calls `fragmentRects` N times,
producing O(N × pages × fragments) work.

### What premirror does

Premirror's `buildMappingIndex` is computed once per layout
(`composeLayout` returns `{ mapping }` already constructed in
`packages/composer/src/index.ts:801`) and callers reuse it.

### Why it's a failure

1. For a 100-page document with 10 split blocks, the projection step runs
   `buildMappingIndex` 10× — quadratic in page count for what should be
   constant.
2. Memoization isn't possible at the call site because `layout` is a fresh
   object each compose; consumers can't compare references.

### Fix options

**Option A — Have `composeLayout` (or a one-shot `buildLayout`) return the
mapping pre-built, identical to premirror.**

- Pros: matches the source; O(1) at call sites.
- Cons: changes `LayoutOutput` shape (breaking).

**Option B — Cache the mapping inside `buildMappingIndex` via a WeakMap
keyed by `layout`.**

- Pros: no API change.
- Cons: weak-map cache is invisible; hard to debug stale entries.

**Option C — Accept the cost; document that the projection helpers are
"hot" and should be called sparingly.**

- Pros: zero work.
- Cons: shifts the burden to every consumer.

### Recommendation seed

Option A; the contract should mirror premirror's.

---

## F-020 — `alignContentToLayout` mutates DOM `style.marginTop` outside React

### Location

- `src/react/alignContent.ts:56-69`

### What it does

```ts
topLevelBlockElements(editable).forEach((el, index) => {
  el.style.marginTop = spacers.has(index) ? `${spacers.get(index)}px` : '';
});
```

It rewrites inline `margin-top` on every top-level block element directly,
not through React. The next React render that touches `style.marginTop`
(e.g., a plugin animating a block in) will wipe the spacer.

### What premirror does

Premirror's projection paints page boundaries on an overlay div; it never
mutates the editor's content layout DOM.

### Why it's a failure

1. Any custom `RenderElementProps` that sets `style.marginTop` (theming,
   draft.js-style inline spacing plugins) collides — last writer wins,
   pagination loses on every re-render of that block.
2. CSS animations on `margin-top` glitch because React's reconciler can't
   tween a property it doesn't own.
3. Snapshot testing of the editor's rendered HTML now includes pagination
   spacers, which makes snapshots brittle to viewport changes.

### Fix options

**Option A — Express spacers as a `data-pagination-page-start` attribute
and use a stylesheet `[data-pagination-page-start] { margin-top: var(...) }`.**

- Pros: React-friendly; consumers can override via CSS specificity.
- Cons: per-block dynamic value requires CSS custom properties; still need
  inline `style.setProperty('--page-spacer', ...)`.

**Option B — Wrap each block in a positioned overlay rather than
modifying its margin.**

- Pros: zero collision with React rendering.
- Cons: layout cost; double the DOM nodes per top-level block.

**Option C — Stop trying to align the editable to page chrome — render the
page chrome as a separate scrolling layer with its own positions.**

- Pros: clean separation.
- Cons: parallel scroll layers don't synchronize perfectly across
  browsers; complex selection rendering.

### Recommendation seed

Option A; smallest change with the cleanest semantics.

---

## F-021 — `splitClones.renderSplitClones` clones contenteditable trees, breaking selection

### Location

- `src/react/splitClones.ts:88-120, 130-208`

### What it does

For each block that spans pages, the live block is clipped to the first
fragment's height (`maxHeight: <height>px; overflow: hidden`) and a deep
DOM clone of the same element is appended to an overlay div per
subsequent fragment. The clone has `contenteditable` stripped, but it
still carries `data-slate-node`, `data-slate-leaf`, and `data-slate-string`
attributes.

### What premirror does

Premirror renders the editor on a single absolute-positioned layer; pages
are static page surfaces drawn behind. There are no DOM clones.

### Why it's a failure

1. `slate-react` looks up DOM nodes by `data-slate-*` to translate
   selection events; the cloned nodes carry the same attributes as the
   originals. If a user clicks the cloned slice (even with
   `pointer-events: none`, focus / IME can still target descendants under
   some configurations), Slate may resolve the click to a node that
   doesn't reflect the live caret.
2. Mutation observers inside Slate may pick up the cloned subtree as a
   "new node" insertion and emit normalization ops.
3. Decoration plugins that walk `data-slate-leaf` (search highlights,
   spellcheck overlays) double-render their decorations on the clones,
   which then drift from the live state.
4. Accessibility: cloned content is exposed to screen readers as
   duplicate text (the clone is `contenteditable="false"` but still
   readable). Long documents become unreadable.

### Fix options

**Option A — Strip `data-slate-*` attributes from clones before inserting.**

- Pros: prevents Slate's mutation observer and selection logic from
  treating clones as live.
- Cons: misses any other Slate-specific markers that ship in future
  versions.

**Option B — Use `aria-hidden="true"` and `inert` on the overlay container.**

- Pros: protects accessibility.
- Cons: doesn't address Slate's DOM lookup confusion.

**Option C — Replace clones with screenshots (canvas drawing of the slice).**

- Pros: zero collision with Slate.
- Cons: pixel-perfect rendering is hard for complex content; selection
  inside the slice becomes impossible (read-only by design).

**Option D — Render pagination as a single non-paginated stream and let
CSS Pagination Module / `column-count` handle the visual paging.**

- Pros: no clones needed; browsers handle the split.
- Cons: CSS Pagination is poorly supported and doesn't expose hooks for
  custom page chrome.

### Recommendation seed

Option A + Option B together as the minimum; Option C only if the visual
fidelity gap is acceptable.

---

## F-022 — `viewMode: 'continuous'` partially honored; reflow still runs

### Location

- `src/PageElement.tsx:45-94` (renders differently based on `viewMode`)
- `src/PaginationCoordinator.tsx:32-40, 205-209` (still subscribes and
  reflows in continuous mode)

### What it does

`PageElement` checks `viewMode === 'paginated'` to decide whether to
constrain height, show page numbers, and apply page-shadow styling. In
`continuous` mode it renders the page as a full-width unstyled flow.

`PaginationCoordinator`, however, **does** still call `scheduleReflowFrom(0)`
on `viewMode` change and continues to subscribe to runtime dirty
notifications. `reflowPageBoundary` reads `pageDom.content.clientHeight`,
which in continuous mode is just `auto` → typically the full content
height, never overflowing → reflow is a no-op every time but still costs
the debounce + idle + rAF cycle on every keystroke.

### What premirror does

Premirror has no analog. Pagination is purely projected; turning it off
means not mounting the viewport. No background work happens.

### Why it's a failure

1. Continuous mode pays the full pagination cost (per-keystroke debounce,
   per-resize debounce, per-rAF reflow tick) for zero benefit.
2. Toggling between modes triggers a chain reaction:
   `scheduleReflowFrom(0)` → `markDirty(0)` → coordinator wakes → no-op
   → reschedules. Each toggle leaves a pending timer on the heap.
3. Devs reading the code can't tell that "continuous" disables reflow,
   because it doesn't — the savings are accidental, not intentional.

### Fix options

**Option A — Short-circuit `scheduleReflowFrom` when `viewMode !== 'paginated'`.**

- Pros: one-line fix.
- Cons: continuous-mode users who *want* page-break overlay data lose it.

**Option B — Render `PaginationCoordinator` conditionally on
`viewMode === 'paginated'`.**

- Pros: cleanly unmounts everything in continuous mode.
- Cons: state (dirty set, leader election) is rebuilt on every toggle —
  one-time cost but visible flicker on slow machines.

**Option C — Treat `viewMode` as the only switch; in `continuous` mode,
also skip the wrap normalization so the document doesn't carry `page`
elements.**

- Pros: enables "pagination is a view, not a model" semantics partially.
- Cons: switching back to paginated re-runs `normalizeRootChildren`,
  generating ops again.

### Recommendation seed

Option B. Continuous mode should be the cheapest configuration.

---

## F-023 — `LayoutPolicies` lost premirror's `minSlotWidthPx` and `slotSelectionPolicy`

### Location

- `src/layout/types.ts:26-34` (`LayoutPolicies`)
- `src/BasePaginationPlugin.ts:70-79` (`DEFAULT_REFLOW_OPTIONS`)

### What premirror has

```ts
export type LayoutPolicyConfig = {
  widowLinesMin?: number;
  orphanLinesMin?: number;
  keepWithNextEnabled?: boolean;
  minSlotWidthPx?: number;          // ← gone in plate
  slotSelectionPolicy?: "single_slot_flow" | "multi_slot_fill";   // ← gone
};
```

### What plate has

```ts
export type LayoutPolicies = {
  widowLinesMin: number;
  orphanLinesMin: number;
  keepWithNextEnabled: boolean;
};
```

`minSlotWidthPx` and `slotSelectionPolicy` are dropped. The composer never
considers obstacles (the `BandObstacle` type from premirror is also missing
from plate's `types.ts`), so wrap-around content (sidebar callouts,
floated images, marginalia) isn't representable.

### Why it's a failure

1. Any document with a floated figure / callout is laid out as if the
   float doesn't exist. Pages overflow visually but the composer thinks
   they fit.
2. Premirror's "leftmost usable slot" logic (`usableSlotForBand` in
   `packages/composer/src/index.ts:159-181`) has no equivalent — there's
   no way to express "this line shares horizontal space with an obstacle."
3. The translation is a strict subset; users porting from premirror lose
   the feature with no migration path.

### Fix options

**Option A — Add `obstacles?: BandObstacle[]` to `LayoutInput` and have
the composer carve slots.**

- Pros: restores premirror parity.
- Cons: requires line-level layout (F-003). Block-level can't represent
  per-line slot widths.

**Option B — Document the loss as a deliberate scope reduction in the
package README.**

- Pros: zero work.
- Cons: admits the translation is incomplete.

**Option C — Expose `obstacles` as a *render-only* concept (CSS `shape-outside`
on overlays) without changing the composer.**

- Pros: gets visual parity for floats.
- Cons: composer's height calculation still ignores the float, so
  pagination decisions stay wrong.

### Recommendation seed

Option A after F-003; Option B in the meantime so users aren't surprised.

---

## F-024 — `MeasuredBlock.lineCount` rounds away half-lines

### Location

- `src/measure/measure.ts:39-43`
  ```ts
  function lineCountFrom(heightPx: number, lineHeightPx: number): number {
    if (lineHeightPx <= 0) return 1;
    return Math.max(1, Math.round(heightPx / lineHeightPx));
  }
  ```

### What it does

The line count is computed as `round(heightPx / lineHeightPx)`. A 2.4-line
block (e.g., a paragraph with a partial third line due to font-fallback
metrics) is reported as 2 lines.

### Why it's a failure

1. The composer (`compose.ts:131-159`) multiplies `fit * lineHeight` to
   compute the placed fragment height. If `lineCount` is rounded down, the
   trailing partial line vanishes from the layout — content overflows
   into the next page even though the composer placed only "2 lines"
   on the current page.
2. Widow/orphan minimums become wrong: a 3-line paragraph reported as 2
   never triggers orphan protection.
3. The same content with a different font yields a different line count,
   making pagination font-dependent without acknowledging it.

### Fix options

**Option A — Use `Math.ceil` instead of `Math.round`.**

- Pros: never under-reports lines; safer for overflow.
- Cons: documents with descenders inflate line counts; layouts use more
  pages than strictly necessary.

**Option B — Keep `lineHeightPx` as a float and let the composer compute
fractional lines.**

- Pros: most accurate.
- Cons: line-based widow/orphan policies become floating-point comparisons.

**Option C — Track total `heightPx` directly and stop using `lineCount`
in the composer; replace `cap = floor(remaining / lineHeight)` with
`fits = (b.heightPx <= remaining)`.**

- Pros: removes the rounding ambiguity.
- Cons: loses the line-level widow/orphan policy granularity entirely.

### Recommendation seed

Option A immediately, Option B once the line model becomes first-class
(F-003).

---

## F-025 — `stableId` falls back to a content hash that collides across edits

### Location

- `src/layout/snapshot.ts:46-50`
  ```ts
  function stableId(node: SlateNode): string {
    if (typeof node.id === 'string' && node.id.length > 0) return node.id;
    return `${node.type ?? 'node'}#${hash(nodeText(node))}`;
  }
  ```

### What premirror does

Premirror keys runs by `${runFrom}-${runIndex}` (PM position based) for
`MeasuredDocumentSnapshot.measuredRuns`. Each PM transaction re-derives
runs deterministically — there is no need for a "stable" id across edits
because the snapshot is fully rebuilt per transaction.

### What plate does

When a node has no `id`, `stableId` derives a djb2 hash from the
*concatenated text* of the node. Two paragraphs with identical text
("hello") produce identical ids. The `MeasureCache` keys by this id —
two paragraphs with the same content share the same cache slot but live
at different paths.

### Why it's a failure

1. Two `"hello"` paragraphs cache the same `heightPx`, even if one is
   inside a deeply nested wrapper that adds margin and the other isn't.
2. Editing one paragraph to a new value invalidates the *other*
   paragraph's cache entry because the id changes only for the edited
   one, but the cache lookup for the unedited duplicate now misses (the
   slot is the same string, but the value was overwritten by the edited
   one before).
3. `id`-less Slate values (the default for any Plate setup that doesn't
   enable a stable-id plugin) cascade these collisions through the entire
   measurement layer.

### Fix options

**Option A — Require stable ids on every block; refuse to operate without
them.**

- Pros: deterministic; matches premirror's reliance on PM positions.
- Cons: forces every consumer to ship a node-id plugin (`@platejs/node-id`
  or similar).

**Option B — Key by `${path.join('.')}#${nodeText(node)}` instead of
content hash.**

- Pros: ids become unique within a tree.
- Cons: path-based ids invalidate on every reorder; cache misses skyrocket
  when blocks move.

**Option C — Keep the hash but include `path` and a structural fingerprint
(child types) in the hash input.**

- Pros: reduces collisions for visually identical content.
- Cons: still not deterministic if paths shift; can be patched piecemeal
  without forcing consumers to add ids.

### Recommendation seed

Option A. The right call is to depend on stable ids and document the
requirement clearly.

---

## F-026 — `toggleHeader` / `toggleFooter` are O(pages) and dirty the entire document

### Location

- `src/BasePaginationPlugin.ts:199-241` (`toggleHeader`)
- `src/BasePaginationPlugin.ts:242-286` (`toggleFooter`)

### What it does

Both transforms iterate every existing page and `insertNodes` /
`removeNodes` a header/footer in each. Then they `markDirty(i)` for every
page index, which queues the full set into the runtime dirty set.

### Why it's a failure

1. For a 200-page document, toggling the header inserts 200 nodes in a
   single `withoutNormalizing` block, then schedules reflow for every
   page index — the entire pagination model is recomputed.
2. The dirty notification is `markDirty(0..N-1)`; the runtime collapses
   to `consumeDirtyMin() === 0`, so the coordinator restarts reflow at
   page 0 anyway — but `markDirty` calls 200 times still trigger 200
   subscriber notifications (the `notify` microtask is rate-limited, but
   each `dirty.add(i)` runs).
3. Headers / footers are page chrome — they're *not* document content.
   Embedding them in every page node bloats the model with repeated
   identical structures.

### What premirror does

Premirror doesn't expose page chrome at the model level. Headers/footers
would be drawn by the React layer per page placement, not inserted into
the document.

### Fix options

**Option A — Store header/footer templates in plugin options and render
them in `PageElement` per page.**

- Pros: model stays clean; toggle is `setOption` (O(1)).
- Cons: breaks the current API where consumers can author per-page
  headers; needs per-page overrides keyed by page index instead.

**Option B — Hoist header/footer to the first page only and let the React
layer clone for display.**

- Pros: O(1) toggle; preserves per-document customization.
- Cons: multi-page documents with different headers per section can't be
  represented.

**Option C — Leave it; document the O(pages) cost.**

- Pros: zero work.
- Cons: bad UX for large documents.

### Recommendation seed

Option A; pagination's header/footer concern belongs in the rendering
layer, not the document model.

---

## F-027 — `pageDom.content.children[0]` cast loses TypeScript type safety

### Location

- `src/internal/reflowEngine.ts:198-203`
  ```ts
  const firstChildEl = nextPageDom.content.children[0] as
    | HTMLElement
    | undefined;
  if (!firstChildEl) {
    return { changed: false, nextPageToContinue: null };
  }
  ```

### Why it's a failure

`Element.children[0]` returns `Element | undefined`. Casting to
`HTMLElement | undefined` loses the SVG/MathML case (SVGElement is an
Element but not HTMLElement). A document containing inline SVG or
MathML at the top of a page reads `firstChildEl.offsetHeight` — but
SVGElement does not have `offsetHeight`. Result: `NaN` or `undefined`
arithmetic, false underflow detection, content yanked between pages
incorrectly.

### Fix options

**Option A — Guard with `instanceof HTMLElement`.**

- Pros: correctness; falls back gracefully for SVG.
- Cons: SVG-first content has no measurement path at all.

**Option B — Use `getBoundingClientRect().height` instead of `offsetHeight`.**

- Pros: works for SVG and MathML.
- Cons: includes transforms (rotations would inflate the measurement).

**Option C — Define a `getBlockHeight(el)` helper that handles every
element type.**

- Pros: encapsulates the platform quirks.
- Cons: adds a new module.

### Recommendation seed

Option B; `getBoundingClientRect` is the cross-element measurement.

---

## F-028 — `resizeTimerRef` and `scheduledRef` don't deduplicate across modes

### Location

- `src/PaginationCoordinator.tsx:47-52, 161-183`

### What it does

The coordinator keeps two independent timer refs (`scheduledRef`,
`resizeTimerRef`). On a resize storm, both can fire reflow:

1. `resizeTimerRef` waits 200ms after the last `resize` event and calls
   `scheduleReflowFrom(0)`.
2. `scheduleReflowFrom(0)` arms `scheduledRef` (100ms by default).
3. Meanwhile, the resize also caused layout changes that mutated the DOM,
   firing `onNodeChange` → `markDirty(0)` → runtime subscriber →
   `scheduleReflowFrom(0)` → `scheduledRef` armed *again* (the existing
   timer is preserved because of `if (scheduledRef.current !== null) return`).
4. The `pendingStartRef` is updated with `min(..., 0)` → still 0.
5. After 200ms the resize timer fires; 100ms later the scheduled timer
   fires. Two reflow runs back-to-back.

### Why it's a failure

1. Each resize triggers ~2× the work it needs to.
2. If the user is *also* typing during a resize, all three signal paths
   (resize, scheduleIdle from typing, runtime dirty) fight for the timer
   slot. Symptoms: layout jitter, "the resize handle dragging is laggy."
3. The cleanup logic on unmount only clears the *current* `scheduledRef`
   and `resizeTimerRef`, not any pending idle callbacks queued via
   `scheduleIdle`. Those still fire after unmount, calling `runReflow`
   on a torn-down editor.

### Fix options

**Option A — Use a single timer ref + `pendingStartRef`; merge resize into
the same debounce.**

- Pros: one execution path; fewer races.
- Cons: resize-specific debounce duration (200ms) is lost — typing
  becomes laggier or resize becomes thrashier depending on the chosen
  shared value.

**Option B — Use `AbortController` to cancel queued idle callbacks on
unmount.**

- Pros: clean teardown.
- Cons: `requestIdleCallback` doesn't accept an `AbortSignal`; needs a
  wrapper.

**Option C — Replace all of this with a single derived `useMemo`
following premirror (F-002 Option A).**

- Pros: kills the entire scheduling layer.
- Cons: requires the rewrite.

### Recommendation seed

Option C is the right outcome; Option B as the immediate teardown fix.

---

## F-029 — `PageSpec.preset` is declared but never consumed

### Location

- `src/layout/types.ts:11-17` (`PagePreset`, `PageSpec.preset`)

### What premirror does

`packages/core/src/index.ts:227-229`:
```ts
export function pageSpecForPreset(preset: PagePreset): PageSpec {
  return preset === "a4" ? { ...A4_PAGE_PX } : { ...LETTER_PAGE_PX };
}
```

The preset is a way to resolve `PageSpec` dimensions from a label.

### What plate does

`PageSpec` exposes `preset?: PagePreset`. There is no `pageSpecForPreset`
helper; the only place that consumes presets is `setPageSize` in
`BasePaginationPlugin.ts:178-189`, which takes a string `'A4' | 'Letter' | 'Legal'`
(note: capitalized; different from `PagePreset` which is lowercase
`'a4' | 'letter'`) and reads a hard-coded `PAGE_SIZES` map.

### Why it's a failure

1. `PagePreset` from `layout/types.ts` is `'a4' | 'letter'`; `setPageSize`
   takes `'A4' | 'Letter' | 'Legal'`. The two type universes don't
   communicate, so a caller building a `PageSpec` via the layout types
   can't pass it through `setPageSize`.
2. `'Legal'` exists in `PAGE_SIZES` but not in `PagePreset`, so the
   layout layer doesn't know about it.
3. The `preset?` field on `PageSpec` is documentation only — never read
   by the composer or the React layer.

### Fix options

**Option A — Unify the two enums: a single `PagePreset = 'a4' | 'letter'
| 'legal'`; `setPageSize` takes it directly.**

- Pros: one type; consistent vocabulary.
- Cons: API break for callers using `'A4'`.

**Option B — Map between the two enums in `setPageSize`.**

- Pros: no API break.
- Cons: keeps the two-universe confusion; new presets must be added in
  two places.

**Option C — Drop `preset` from `PageSpec` entirely; force dimensions in
all consumers.**

- Pros: simplest contract.
- Cons: loses premirror's preset helper convenience.

### Recommendation seed

Option A; consistency wins.

---

## F-030 — `paginationTf.withMutations` only works via `editor.getTransforms`

### Location

- `src/internal/reflowEngine.ts:379-411`
  ```ts
  const paginationTf =
    editor.getTransforms<PaginationConfig>(BasePaginationPlugin).pagination;
  withoutSaving(editor, () => {
    paginationTf.withMutations(() => { ... });
  });
  ```
- `src/BasePaginationPlugin.ts:30-33` (re-exports `withPaginationMutations`)

### What it does

`splitOversizedBlock` calls the transform via
`editor.getTransforms(...).pagination.withMutations`. But there's also a
direct export `_withPaginationMutations` (from
`internal/editorRegistry.ts`) that's used by `toggleHeader` /
`toggleFooter`. They're the same function under the hood but exposed
through two paths.

### Why it's a failure

1. Two paths to the same primitive multiply the chance of forgetting one
   in a future refactor. If `_withPaginationMutations` gains behavior
   (e.g., op tagging from F-008 Option C), the `editor.getTransforms`
   path won't pick it up unless explicitly forwarded.
2. The direct export crosses the "internal/" boundary; the file is named
   `internal/editorRegistry.ts` but its function is re-exported from
   the public `BasePaginationPlugin.ts`.
3. `editor.getTransforms` is an undocumented path for accessing transforms
   outside of `tf.*`; relying on it ties the package to current Plate
   internals.

### Fix options

**Option A — Pick one entrypoint (`editor.tf.pagination.withMutations`) and
remove the other.**

- Pros: single API surface.
- Cons: requires migrating call sites; consumers using the direct export
  must switch.

**Option B — Make `_withPaginationMutations` the canonical implementation
and have the transform delegate to it (which it already does).**

- Pros: matches the current code; documents the relationship.
- Cons: doesn't reduce surface area.

**Option C — Move `_withPaginationMutations` out of the public barrel.**

- Pros: enforces the "internal" naming.
- Cons: the React coordinator currently imports it directly via
  `BasePaginationPlugin.ts`, so the import chain needs reshuffling.

### Recommendation seed

Option A; one public API per behavior.

---

## Triage Summary

| ID    | Severity   | Blocks shipping a faithful translation | Cheapest mitigation                                             |
| ----- | ---------- | -------------------------------------- | --------------------------------------------------------------- |
| F-001 | Critical   | Yes                                    | None below "delete the mutator"                                 |
| F-002 | Critical   | Yes                                    | At least re-route via Option A                                  |
| F-003 | Critical   | Yes (selection / widows/orphans)       | Documented downgrade (Option C)                                 |
| F-004 | High       | Yes (caret API)                        | Path↔fragment helpers (Option B)                                |
| F-005 | Critical   | Yes (collab)                           | Strict leader gate (Option C); not a real fix                   |
| F-006 | High       | No (perf only)                         | Composite key (Option A) — 1-line fix                           |
| F-007 | High       | No                                     | Resolve via tree walk (Option A)                                |
| F-008 | Critical   | No (correctness)                       | Wrap reflow in mutation guard (Option A) — 1-line fix           |
| F-009 | High       | No                                     | Sort children before scan (Option A)                            |
| F-010 | High       | No                                     | Drop the splitter (Option C)                                    |
| F-011 | Medium     | No                                     | Remove `widthPx` from contract (Option B)                       |
| F-012 | Critical   | Yes (collab)                           | None; requires F-001                                            |
| F-013 | Medium     | No                                     | Make coordinator opt-in (Option B)                              |
| F-014 | Medium     | No                                     | Bridge upstream (Option B)                                      |
| F-015 | High       | No                                     | SSR guard at top of `runReflow` (Option B) — 1-line fix         |
| F-016 | Medium     | No                                     | Stable-id keying (Option A)                                     |
| F-017 | Medium     | No (process)                           | Add cross-peer test (Option C)                                  |
| F-018 | High       | Yes (Base/React split)                 | Inject splitter (Option A)                                      |
| F-019 | Low        | No (perf only)                         | WeakMap cache (Option B)                                        |
| F-020 | Medium     | No                                     | Data-attribute spacers (Option A)                               |
| F-021 | Critical   | No (correctness/A11y)                  | Strip `data-slate-*` (Option A)                                 |
| F-022 | Low        | No                                     | Conditional render (Option B)                                   |
| F-023 | Medium     | Yes (feature parity)                   | Document the gap (Option B); requires F-003 to fix              |
| F-024 | Medium     | No (correctness)                       | `ceil` (Option A) — 1-line fix                                  |
| F-025 | High       | No                                     | Require stable ids (Option A)                                   |
| F-026 | Low        | No (perf only)                         | Chrome-as-render-prop (Option A)                                |
| F-027 | Low        | No                                     | `getBoundingClientRect` (Option B)                              |
| F-028 | Low        | No (perf only)                         | Single timer (Option A); fully cured by F-002                   |
| F-029 | Low        | No                                     | Unify enums (Option A)                                          |
| F-030 | Low        | No                                     | One entrypoint (Option A)                                       |

### Strategic recommendation

Pursue **F-001 Option A** (pure projection) as the single anchor change.
Most criticals (F-002, F-005, F-007, F-008 partially, F-010, F-012, F-018,
F-020, F-021, F-022, F-028) dissolve once the document model stops being
mutated. The remaining work — F-003 (line-level fidelity), F-023
(obstacles), F-004 (PM↔layout), F-025 (stable ids) — then becomes
incremental, additive work on a known-good foundation.

The 1-line fixes (F-006, F-008 Option A, F-015 Option B, F-024 Option A)
should land immediately regardless of whether the larger F-001 migration
is approved: they're correctness patches with no architectural risk.




