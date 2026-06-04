# Pagination rewrite v2 — scorch the mutator, rebuild on pretext (rigid TDD)

Supersedes `2026-05-21-pagination-rewrite.md`. That doc planned a block-level
overlay; this one commits to **full pretext (line/run) measurement** and the
**deletion of the document-mutator path**.

`north-star reaffirmed: laws` (runtime boundary: document is the source of truth,
pagination is a derived projection — no model mutation).

## Locked decisions (user)

1. **Measurement = full pretext everywhere.** `@chenglou/pretext` is the only
   measurement source, live and print. Deterministic across machines + SSR,
   true premirror parity, real run model. Satisfies the pretext gate
   (`.agents/AGENTS.md` → "Pagination (pretext gate)") with no attestation owed.
2. **Scorch first, host second** (path #1). PR1 is a pure deletion of the
   mutator; the projection host is a later PR. Each PR small, green, reviewable.
3. **Rigid TDD order** below — every phase is one stacked branch/PR, red→green,
   one behavior at a time (no horizontal slicing).

## Open decision — split-block render (pros/cons, pick before Phase 7)

How to show a block taller than one page. Full pretext changes the calculus
because we now have per-line `LineBox` with absolute coordinates and `pmRange`.

| Option | Pros | Cons |
|---|---|---|
| **A. Overlay clipped clones** (single flowing `Editable` + read-only clones per later slice) | Native contenteditable selection/IME just works on the live block; verified in browser already; no model mutation (yjs-safe) | Clones read-only (no caret in continuation); needs `data-slate-*` strip + `aria-hidden`+`inert` (F-021); two coordinate systems to keep aligned |
| **B. Line projection** (premirror-style: absolute-position every `LineBox` on its page; editable is a projection surface) | True premirror parity; no clones; split is free (lines just land on different pages); caret continuation works everywhere | Native selection/IME is lost — must build `useProjectedSelection`; biggest research effort; highest risk |
| **C. Place whole, overflow** (oversized block bleeds past the page edge + dev warning) | Trivial; caret always correct; matches compose atomic-block handling | Tall tables/code visibly clipped; not Word-class |

**DECIDED: C — place whole, overflow.** Oversized blocks are placed whole and
allowed to bleed past the page edge (with a dev warning). Caret is always
correct (no read-only clones), selection stays native, and it matches compose's
atomic-block handling. Consequence: **no clone machinery** — `react/splitClones.ts`
+ its spec become dead code and are deleted when the "place whole" path lands in
the compose rewrite (PR5). F-021 (clone hazards) is fully moot. B (line
projection) remains the aspirational endpoint if Word-class split is wanted
later, but is explicitly out of scope.

## What full pretext reshapes (vs. the current block-level survivors)

The current pure pipeline measures block `offsetHeight` and fakes
`lineCount = round(h/lineHeight)`. Full pretext replaces that with a run/line model:

- `snapshot.ts` must emit `StyledRun[]` per block: `{ id, text, font, marks,
  slateRange:{path,offsetStart,offsetEnd}, atomic? }` (Slate analog of
  premirror's `StyledRun` keyed by Slate path instead of PM pos).
- `measure/` calls `prepareWithSegments(text, font, {whiteSpace:'pre-wrap'})`
  then `layoutNextLine(prepared, cursor, widthPx)` to wrap → real `LineBox` +
  `PlacedRun` with per-run `x`/`width` and `slateRange`.
- `compose.ts` fills pages by **real lines**, widow/orphan on lines that exist,
  atomic-run protection, `breakReason` per boundary. Kills F-003, F-024,
  F-003-determinism, and the half-line/round bug in one move.
- `mapping.ts` can finally implement `pmPosToLayout`/`layoutToPmPos` because
  every line carries a `slateRange` (closes F-004).

## Rigid TDD phase order (stacked PRs)

Each phase: write the failing test first, confirm it fails for the right reason,
minimal green, refactor. `bun test` per phase; `dev-browser` gate on any phase
that changes a browser surface. `pnpm brl` whenever exports/files move.

- **PR1 — Scorch the mutator (pure deletion).**
  Delete: `BasePaginationPlugin.ts`, `internal/reflowEngine.ts`,
  `PaginationCoordinator.tsx`, `PageElement.tsx`, `registry.tsx`,
  `internal/runtime.ts`, `leaderElection.ts`, `yjs/YjsIntegration.tsx`,
  `types.ts` (root), `internal/editorRegistry.ts`,
  `internal/PaginationAboveEditable.tsx`, `PaginationPlugin.ts`,
  `internal/scheduleIdle.ts` + their 12 specs. Drop `./yjs` export from
  `package.json`. `.` → re-exports `./react`. Run `pnpm brl`.
  Also delete `react/splitClones.ts` + spec (dead under option C) and the
  clone-only `projection.ts` consumers' barrel wiring; trim now-dead deps
  (`@lifeomic/attempt`, `@platejs/yjs`, `y-protocols`, `yjs`, `slate-history`);
  neutralize the template (delete `pagination-kit.tsx` + `pagination-toolbar-button.tsx`,
  strip from `editor-kit.tsx` / `fixed-toolbar-buttons.tsx` / scratch demo — waiver granted).
  *DONE & green: 32/32 specs pass, typecheck clean, lint clean.*
  Closes the runtime side of F-001, F-005, F-007, F-008, F-009, F-010, F-012,
  F-013, F-014, F-015, F-016, F-018, F-021, F-022, F-026, F-028, F-030 (deleted).

- **PR2 — Cache-key correctness on the survivor (F-006).**
  RED: two widths for one block must not thrash one slot. GREEN: key the map by
  `${id}@${widthPx}`. (F-024/F-011 deliberately deferred — obviated by pretext
  in PR3–PR5.)

- **PR3 — pretext measurement primitive.**
  Add `@chenglou/pretext`. New `measure/pretext.ts`: `(text, font, widthPx) →
  LineBox[]` via `prepareWithSegments`+`layoutNextLine`. Deterministic →
  ideal unit tests (known string + font + width → known line count/widths).

- **PR4 — run-level snapshot.**
  RED: a Slate paragraph with mixed marks/inline-void → expected `StyledRun[]`
  with correct `slateRange`s + `atomic` on voids. GREEN: rewrite `snapshot.ts`.

- **PR5 — line/run compose.**
  RED: fixtures with declared expected page count + break events; widow/orphan
  on real lines; atomic run never mid-broken. GREEN: rewrite `compose.ts` to
  consume measured runs → `LineBox`/`PlacedRun`/pages; oversized blocks placed
  whole (option C). (`splitClones` already removed in PR1.) Closes F-003, F-024,
  F-023 (partial: obstacles still later).

- **PR6 — mapping in LayoutOutput (F-004, F-007, F-019).**
  RED: `pmPosToLayout(point)` and inverse round-trip; `composeLayout` returns a
  prebuilt `mapping` (no 3× rebuild). GREEN: build index once during compose.

- **PR7 — projection host plugin (F-002, F-001 render side).**
  The new `PaginationPlugin`: subscribes to editor changes, runs
  snapshot→measure→compose, renders absolute page chrome + content. Oversized
  blocks placed whole (option C) — no clones. `.` exports it. *`dev-browser` gate.*

- **PR8 — selection/caret projection.**
  `useProjectedSelection` equivalent via PR6 mapping (scroll-into-view across
  pages, page-anchored decorations). Unblocks split-render option B if chosen.
  *`dev-browser` gate.*

- **PR9 — headers/footers/page-setup (F-026 avoided).**
  Render-layer chrome from plugin options; `setPageSize`/`setMargins` as
  `setOption` (O(1)), not per-page model inserts. Unify the preset enum (F-029).

- **PR10 — migrate template/demo + cleanup.**
  Replace the scratch `dev/pagination2` demo with the real plugin; delete vendored
  scratch; redeploy; final `dev-browser` verification.

## Deferred / explicitly out of v1
- F-023 obstacles (floats/`shape-outside`) — needs the line model (now present
  after PR5) but is additive; schedule after PR9.
- F-025 stable-id requirement — decide during PR4 (pretext snapshot): likely
  **require** node ids and document it, rather than content-hash.
- F-011 width-correct offscreen measurement — moot once pretext measures at a
  given `widthPx` directly (PR3).

## Test strategy
Fixture tiers smoke/core/stress with declared expected page count + break events;
determinism gate (same input → identical LayoutOutput — now genuinely true with
pretext, no DOM); semantic assertions paired with snapshots; pinned font metrics
for measurement tests.

## Status
Caches/dist cleared. Mutator inventory mapped (13 files / 1389 LOC + 12 specs).
Pretext confirmed: `@chenglou/pretext@^0.0.3` (`prepareWithSegments`,
`layoutNextLine`). Awaiting split-render decision (A/B/C) before PR7.
