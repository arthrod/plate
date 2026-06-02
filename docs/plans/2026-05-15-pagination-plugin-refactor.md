# `@platejs/pagination` Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development`. Steps use checkbox (`- [ ]`) syntax for tracking. Tasks are sequential — touch `BasePaginationPlugin.ts` / `reflowEngine.ts` repeatedly.

**Goal:** Land the 18 review findings (P0–P3) from the 2026-05-15 pagination review against `north-star` + `plate-plugin-creator` + `react` skill rules.

**Architecture:** Keep the current Slate-base + Plate-wrapper split. Replace editor-instance bolt-ons with a WeakMap registry, route shared keys through `KEYS`, kill all `as any`, drop manual memoization, split the composition lane (`overrideEditor` for `apply`/`normalizeNode`; `.extendTransforms` for feature methods), make Yjs a subpath export.

**Tech Stack:** TypeScript, Slate 0.112+, Plate 52+, React 18+, React Compiler, Yjs (optional).

**Branch:** `codex/pagination-folder-pick` (current). Commit per task; never push without explicit user ask.

**Verification gates per task:**
- `pnpm install` (only if package.json changed)
- `pnpm turbo build --filter=./packages/pagination` (only if exports/types changed)
- `pnpm turbo typecheck --filter=./packages/pagination`
- `pnpm --filter @platejs/pagination test`
- `pnpm lint:fix` (path-scoped to changed files)
- `pnpm brl` (only on T5 or whenever public files move)

---

## Task 1 — Wire `KEYS.pagination` + `KEYS.p`

**Files:**
- Modify: `packages/pagination/src/BasePaginationPlugin.ts:27` (drop `PAGINATION_KEY`), `:214` (use `KEYS.pagination`), `:243` (use `KEYS.p`)
- Verify: `packages/pagination/src/__tests__/BasePaginationPlugin.spec.ts`

- [ ] **Step 1: Confirm tests pass on current branch**
  - Run: `pnpm --filter @platejs/pagination test`
  - Expected: full green (record baseline; do not proceed if red).

- [ ] **Step 2: Add `KEYS` import + replace key constant**
  - In `BasePaginationPlugin.ts`, add at top: `import { KEYS } from '@platejs/utils';` (use the same import path other Plate packages use — confirm by `grep -n "from '@platejs/utils'" packages/list/src/lib/*.ts`).
  - Delete `const PAGINATION_KEY = 'pagination';` (line 27).
  - Replace `key: PAGINATION_KEY` (line 214) with `key: KEYS.pagination`.
  - Replace `defaultBlockType: 'p'` (line 243) with `defaultBlockType: KEYS.p`.
  - Replace internal references `(editor as any).getType?.(PAGINATION_KEY)` / similar with `editor.getType(BasePaginationPlugin)` (after typing pass — for this task, do search/replace `PAGINATION_KEY` → `KEYS.pagination` only).

- [ ] **Step 3: Add `@platejs/utils` to `dependencies` in `packages/pagination/package.json`**
  - Confirm version matches sibling packages: `grep -A1 '"@platejs/utils"' packages/list/package.json`.

- [ ] **Step 4: Verify typecheck + tests**
  - Run: `pnpm install` (lockfile may change)
  - Run: `pnpm turbo build --filter=./packages/pagination`
  - Run: `pnpm turbo typecheck --filter=./packages/pagination`
  - Run: `pnpm --filter @platejs/pagination test`
  - Expected: all green.

- [ ] **Step 5: Commit**
  - `git add packages/pagination/src/BasePaginationPlugin.ts packages/pagination/package.json pnpm-lock.yaml`
  - `git commit -m "refactor(pagination): route key through KEYS.pagination + KEYS.p"`

---

## Task 2 — WeakMap registry for runtime + mutating flag

**Files:**
- Create: `packages/pagination/src/internal/editorRegistry.ts`
- Modify: `packages/pagination/src/BasePaginationPlugin.ts:55-303` (drop `(editor as any).__paginationRuntime`, `(editor as any).__paginationMutating`)
- Modify: `packages/pagination/src/reflowEngine.ts:347` (consume new registry API)

**Why:** `north-star`/`plate-plugin-creator` forbid bolt-on `__` properties via `as any`. Use `WeakMap<Editor, X>` like `packages/footnote/src/lib/registry.ts`.

- [ ] **Step 1: Write failing test for registry semantics**
  - Create `packages/pagination/src/__tests__/editorRegistry.spec.ts`:
    ```ts
    import { createSlateEditor } from 'platejs';
    import { BasePaginationPlugin } from '../BasePaginationPlugin';
    import { getPaginationRuntime, isPaginationMutating, withPaginationMutations } from '../internal/editorRegistry';

    test('getPaginationRuntime returns runtime once plugin is applied', () => {
      const editor = createSlateEditor({ plugins: [BasePaginationPlugin] });
      expect(getPaginationRuntime(editor)).toBeDefined();
    });

    test('withPaginationMutations toggles mutating flag for the editor only', () => {
      const a = createSlateEditor({ plugins: [BasePaginationPlugin] });
      const b = createSlateEditor({ plugins: [BasePaginationPlugin] });
      let seen = false;
      withPaginationMutations(a, () => {
        seen = isPaginationMutating(a);
        expect(isPaginationMutating(b)).toBe(false);
      });
      expect(seen).toBe(true);
      expect(isPaginationMutating(a)).toBe(false);
    });
    ```
  - Run: `pnpm --filter @platejs/pagination test editorRegistry.spec`
  - Expected: FAIL (module not found).

- [ ] **Step 2: Create `internal/editorRegistry.ts`**
  ```ts
  import type { SlateEditor } from 'platejs';
  import type { PaginationRuntime } from '../types';

  const runtimes = new WeakMap<SlateEditor, PaginationRuntime>();
  const mutating = new WeakSet<SlateEditor>();

  export const setPaginationRuntime = (editor: SlateEditor, r: PaginationRuntime) => {
    runtimes.set(editor, r);
  };
  export const getPaginationRuntime = (editor: SlateEditor): PaginationRuntime | undefined =>
    runtimes.get(editor);
  export const isPaginationMutating = (editor: SlateEditor) => mutating.has(editor);
  export const withPaginationMutations = (editor: SlateEditor, fn: () => void) => {
    const prev = mutating.has(editor);
    mutating.add(editor);
    try {
      fn();
    } finally {
      if (!prev) mutating.delete(editor);
    }
  };
  ```

- [ ] **Step 3: Wire registry into `BasePaginationPlugin.ts`**
  - In `withPagination`, replace lines 60-62:
    ```ts
    const runtime = createPaginationRuntime();
    setPaginationRuntime(editor, runtime);
    ```
  - Replace every `(editor as any).__paginationMutating` read with `isPaginationMutating(editor)`.
  - Delete the bottom helper functions `withPaginationMutations` (`:248-256`) and `getPaginationRuntime` (`:299-303`).
  - Re-export from `internal/editorRegistry` at the top of the file for backward-compat to internal callers.

- [ ] **Step 4: Update `reflowEngine.ts`**
  - Replace `import { ..., withPaginationMutations } from './BasePaginationPlugin'` with `import { withPaginationMutations } from './internal/editorRegistry'`.

- [ ] **Step 5: Run tests**
  - Run: `pnpm --filter @platejs/pagination test`
  - Expected: all green incl. new spec.

- [ ] **Step 6: Commit**
  - `git commit -m "refactor(pagination): move runtime+mutating flag to WeakMap registry"`

---

## Task 3 — Type the `overrideEditor` body (`BasePaginationPlugin.ts`)

**Files:**
- Modify: `packages/pagination/src/BasePaginationPlugin.ts` (entire `withPagination` block + helper fns)

**Goal:** Zero `as any` and zero `any`-typed params in this file. Use plugin context (`editor`, `tf`, `getOptions`, `getOption`, `type`).

- [ ] **Step 1: Type the override editor**
  - The `OverrideEditor<PaginationConfig>` already infers context. Destructure: `({ editor, type, getOptions, tf: { apply, normalizeNode } })`.
  - Type `apply(op: Operation)` (already imported). Strip the `(editor as any)` cast — `editor` is typed.
  - Type `normalizeNode(entry: NodeEntry)` using `import { type NodeEntry }` from `slate`.
  - Replace `(node as any)?.type === type` with `Element.isElement(node) && node.type === type` (import `Element` from slate).

- [ ] **Step 2: Type feature transforms**
  - Define `type PaginationTransforms = { togglePreview: () => boolean; setPageSize: (size: 'A4' | 'Letter' | 'Legal') => void; setMargins: (m: DocumentSettings['margins']) => void; toggleHeader: () => boolean; toggleFooter: () => boolean; };`
  - Stop using `editor.getPlugin(BasePaginationPlugin) as any` — use `getOptions()` from the destructured ctx.

- [ ] **Step 3: Type helper functions**
  - `wrapRootRange(editor: SlateEditor, type: string, start: number, end: number)` — drop `any`.
  - `normalizeRootChildren(editor: SlateEditor, type: string): boolean` — drop `any`.

- [ ] **Step 4: Verify typecheck**
  - Run: `pnpm turbo build --filter=./packages/pagination` then `pnpm turbo typecheck --filter=./packages/pagination`
  - Run: `pnpm --filter @platejs/pagination test`
  - Expected: all green.

- [ ] **Step 5: Grep self-check**
  - Run: `grep -nE "\\b(as any|: any)\\b" packages/pagination/src/BasePaginationPlugin.ts`
  - Expected: zero matches.

- [ ] **Step 6: Commit**
  - `git commit -m "refactor(pagination): remove any from BasePaginationPlugin"`

---

## Task 4 — Type `reflowEngine.ts` + `runtime.ts`

**Files:**
- Modify: `packages/pagination/src/reflowEngine.ts`, `packages/pagination/src/runtime.ts`

- [ ] **Step 1: Type `reflowEngine.ts`**
  - `editor: Editor` (already typed), drop `(editor as any).getType?.` — call `editor.getType(BasePaginationPlugin)` directly (this method exists on `SlateEditor`).
  - Replace `(editor as any).getOption?.(BasePaginationPlugin, 'defaultBlockType')` with `editor.getOption(BasePaginationPlugin, 'defaultBlockType')`.
  - Replace `(editor as any).hasEditableTarget` with a guard `'hasEditableTarget' in editor`.
  - For `(ReactEditor as any).toDOMRange`, do not cast: import the typed method from `slate-react`, accept the type narrowing required by `ReactEditor.toDOMRange(editor, range)` (cast only the editor to `ReactEditor` once via `ReactEditor.isReactEditor(editor)` guard).
  - Strip the `nextPageDom: PageDom | undefined` literal — `PageDom | undefined` is already what `getPageDom` returns; just import it.

- [ ] **Step 2: Type `runtime.ts`**
  - Replace `const anyOp = op as any` with destructured access on `Operation` types. Slate's `Operation` is a discriminated union — switch on `op.type` or use `'path' in op` / `'newPath' in op` narrowing.
  - Final shape:
    ```ts
    export function getPageIndexFromOp(op: Operation): number | null {
      const indices: number[] = [];
      if ('path' in op && Array.isArray(op.path) && op.path.length > 0) indices.push(op.path[0]);
      if ('newPath' in op && Array.isArray(op.newPath) && op.newPath.length > 0) indices.push(op.newPath[0]);
      return indices.length ? Math.min(...indices) : null;
    }
    ```

- [ ] **Step 3: Verify**
  - Run: `pnpm turbo typecheck --filter=./packages/pagination`
  - Run: `pnpm --filter @platejs/pagination test`
  - Expected: all green.

- [ ] **Step 4: Grep self-check**
  - Run: `grep -nE "\\b(as any|: any)\\b" packages/pagination/src/reflowEngine.ts packages/pagination/src/runtime.ts`
  - Expected: zero matches.

- [ ] **Step 5: Commit**
  - `git commit -m "refactor(pagination): remove any from reflowEngine and runtime"`

---

## Task 5 — Generate barrel via `pnpm brl`

**Files:**
- Modify: `packages/pagination/src/index.ts` (regenerated)

- [ ] **Step 1: Run barrel generator**
  - Run: `pnpm --filter @platejs/pagination brl`
  - Inspect the diff; confirm exports cover `BasePaginationPlugin`, `PaginationPlugin`, `PaginationCoordinator`, `PaginationRegistryProvider`, `usePaginationRegistry`, `createAlwaysLeader`, `createAwarenessLeaderElection`, the type re-exports.

- [ ] **Step 2: If brl produces unwanted exports**
  - Move helpers under `src/internal/` so brl skips them (per `plate-plugin-creator` barrel rule).
  - Re-run brl until output is minimal public surface.

- [ ] **Step 3: Verify**
  - Run: `pnpm turbo build --filter=./packages/pagination`
  - Run: `pnpm --filter @platejs/pagination test`

- [ ] **Step 4: Commit**
  - `git commit -m "chore(pagination): regenerate barrel via pnpm brl"`

---

## Task 6 — Yjs subpath export + optional peer

**Files:**
- Modify: `packages/pagination/package.json` (`exports`, `peerDependencies`, `peerDependenciesMeta`)
- Move: `packages/pagination/src/YjsIntegration.tsx` → still in `src/`, but no longer in main barrel
- Remove from main barrel: `YjsPaginationBridge` re-export (`index.ts:27`)
- Create: a separate barrel entry for `./yjs`

- [ ] **Step 1: Update `package.json`**
  - Add to `exports`:
    ```json
    "./yjs": "./dist/yjs.js"
    ```
  - Add `@platejs/yjs` to `peerDependenciesMeta` with `{ "optional": true }`.

- [ ] **Step 2: Move Yjs surface**
  - Create `packages/pagination/src/yjs.ts`:
    ```ts
    export { YjsPaginationBridge } from './YjsIntegration';
    ```
  - Confirm build emits `dist/yjs.js`. If `plate-pkg p:build` requires explicit entry registration, update the package script config — check sibling packages (`grep -l '"./yjs"' packages/*/package.json`).

- [ ] **Step 3: Remove from main barrel**
  - Re-run `pnpm brl` after `YjsIntegration.tsx` is gated. If brl still picks it up, move it under `src/internal/yjs/YjsIntegration.tsx` and re-export only from `src/yjs.ts`.

- [ ] **Step 4: Verify**
  - Run: `pnpm install`
  - Run: `pnpm turbo build --filter=./packages/pagination`
  - Run: `pnpm --filter @platejs/pagination test`
  - Verify a consumer can `import { PaginationPlugin } from '@platejs/pagination'` without `@platejs/yjs` installed.

- [ ] **Step 5: Commit**
  - `git commit -m "feat(pagination): expose Yjs bridge under ./yjs subpath, mark optional"`

---

## Task 7 — Remove manual memoization in `PaginationCoordinator`

**Files:**
- Modify: `packages/pagination/src/PaginationCoordinator.tsx`

**Why:** Repo runs React Compiler (`react-compiler-runtime` in deps). `react` skill: *NEVER use `useCallback`/`useMemo` for perf*.

- [ ] **Step 1: Strip `useCallback` from `shouldProcess`, `runReflow`, `scheduleReflowFrom`**
  - Replace each with plain function declarations.
  - Delete the `scheduleReflowFromRef` ref-dance (lines 69–78, 148) — call `scheduleReflowFrom` directly inside `runReflow`. The compiler memoizes for you.

- [ ] **Step 2: Audit other manual memos**
  - `useRef(leader.amILeader())` (line 45) — keep as ref but re-init in a `useEffect([leader])` to cover prop change (covered fully in Task 12).
  - Keep `useRef` for genuine mutable handles (`scheduledRef`, `resizeTimerRef`, `runningRef`, `pendingStartRef`, `isLeaderRef`).

- [ ] **Step 3: Verify**
  - Run: `pnpm --filter @platejs/pagination test`
  - Expected: all PaginationCoordinator specs still green.

- [ ] **Step 4: Commit**
  - `git commit -m "refactor(pagination): drop manual memoization in PaginationCoordinator"`

---

## Task 8 — Move example files out of `src/`

**Files:**
- Delete: `packages/pagination/src/example_visualization_with_toggle/`

**Why:** A 350-line lucide-react wireframe with zero Plate API doesn't belong in a publishable package's `src`. Two `.md` siblings have the same problem.

- [ ] **Step 1: Confirm the dir has no inbound imports from production code**
  - Run: `grep -rn "example_visualization_with_toggle" packages/pagination/src --include='*.ts' --include='*.tsx'`
  - Expected: zero matches (or only matches within the directory itself).

- [ ] **Step 2: Delete the directory**
  - Run: `git rm -r packages/pagination/src/example_visualization_with_toggle`
  - If user wants the wireframe preserved, ask first; otherwise delete.

- [ ] **Step 3: Verify build**
  - Run: `pnpm turbo build --filter=./packages/pagination`
  - Run: `pnpm --filter @platejs/pagination test`

- [ ] **Step 4: Commit**
  - `git commit -m "chore(pagination): remove non-Plate example wireframe from src"`

---

## Task 9 — Split composition lane via `.extendTransforms`

**Files:**
- Modify: `packages/pagination/src/BasePaginationPlugin.ts`

**Why:** `plate-plugin-creator` composition rule — feature methods go on `.extendTransforms()` (plugin-specific surface), not mixed inside `overrideEditor`.

- [ ] **Step 1: Extract feature methods from `withPagination`**
  - Move `togglePreview`, `setPageSize`, `setMargins`, `toggleHeader`, `toggleFooter` out of the `transforms.pagination` block in `withPagination`.
  - Leave `apply` and `normalizeNode` in `withPagination`.

- [ ] **Step 2: Chain `.extendTransforms` on the plugin definition**
  ```ts
  export const BasePaginationPlugin = createTSlatePlugin<PaginationConfig>({ ... })
    .overrideEditor(withPagination)
    .extendTransforms(({ editor, getOptions }) => ({
      togglePreview() { ... },
      setPageSize(size) { ... },
      setMargins(margins) { ... },
      toggleHeader() { ... },
      toggleFooter() { ... },
    }));
  ```
  - Each method calls `editor.setOption(BasePaginationPlugin, key, value)` / `getOptions()` instead of the old `getPlugin().options` access.

- [ ] **Step 3: Verify**
  - Run: `pnpm turbo typecheck --filter=./packages/pagination`
  - Run: `pnpm --filter @platejs/pagination test`
  - Expected: all green; transforms still callable as `editor.tf.pagination.togglePreview()`.

- [ ] **Step 4: Commit**
  - `git commit -m "refactor(pagination): move feature transforms to .extendTransforms"`

---

## Task 10 — P2 batch A: SSR-safe scheduleIdle + debug-guarded console.error + microtask-coalesced notify

**Files:**
- Create: `packages/pagination/src/internal/scheduleIdle.ts`
- Modify: `packages/pagination/src/PaginationCoordinator.tsx`
- Modify: `packages/pagination/src/reflowEngine.ts:380`
- Modify: `packages/pagination/src/types.ts` (`ReflowOptions.debug?: boolean`)
- Modify: `packages/pagination/src/runtime.ts` (notify coalescing)

- [ ] **Step 1: Test for microtask coalescing (TDD red)**
  - Add `packages/pagination/src/__tests__/runtime.spec.ts` case:
    ```ts
    test('multiple markDirty in same tick produce one notification', async () => {
      const r = createPaginationRuntime();
      let count = 0;
      r.subscribe(() => count++);
      r.markDirty(0); r.markDirty(1); r.markDirty(2);
      await Promise.resolve();
      expect(count).toBe(1);
    });
    ```
  - Run test, expect FAIL (notify fires synchronously 3×).

- [ ] **Step 2: Implement microtask flag in `runtime.ts`**
  ```ts
  let pending = false;
  const notify = () => {
    if (pending) return;
    pending = true;
    queueMicrotask(() => {
      pending = false;
      subscribers.forEach((fn) => fn());
    });
  };
  ```
  - Test goes green.

- [ ] **Step 3: Extract `scheduleIdle`**
  ```ts
  export const scheduleIdle = (cb: () => void): void => {
    if (typeof window === 'undefined') return; // SSR no-op
    const ric = (window as Window & typeof globalThis & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (ric) ric(cb);
    else window.setTimeout(cb, 0);
  };
  ```
  - Replace the inline `ric` block in `PaginationCoordinator.tsx`.

- [ ] **Step 4: Add `debug` flag**
  - `types.ts`: `debug?: boolean` on `ReflowOptions`.
  - `BasePaginationPlugin.ts`: default `debug: false`.
  - `reflowEngine.ts:380`: replace `console.error('Text split failed:', e)` with `if (opts.debug) console.error('Text split failed:', e)`.

- [ ] **Step 5: Verify**
  - Run: `pnpm --filter @platejs/pagination test`
  - Run: `pnpm turbo typecheck --filter=./packages/pagination`

- [ ] **Step 6: Commit**
  - `git commit -m "refactor(pagination): coalesce notify, extract scheduleIdle, gate debug logs"`

---

## Task 11 — P2 batch B: `withPaginationMutations` as a transform + monotonic-offset fallback

**Files:**
- Modify: `packages/pagination/src/BasePaginationPlugin.ts` (extend transforms)
- Modify: `packages/pagination/src/reflowEngine.ts` (consume new transform, add linear fallback)
- Keep: `packages/pagination/src/internal/editorRegistry.ts` (low-level still used)

- [ ] **Step 1: Expose `withMutations` on plugin transforms**
  - In the `.extendTransforms` block from Task 9, add:
    ```ts
    withMutations(fn: () => void) {
      withPaginationMutations(editor, fn);
    },
    ```
  - Call sites in `reflowEngine.ts` use `editor.tf.pagination.withMutations(...)` instead of importing the helper.

- [ ] **Step 2: Linear-scan fallback for non-monotonic `offsetTop`**
  - In `findOverflowSplitIndex` (`reflowEngine.ts:222`), before binary search, sample first 3 children. If `child[i+1].offsetTop < child[i].offsetTop` for any pair, switch to linear scan.
  - Add TDD test with a stub `contentEl` whose `children[1].offsetTop < children[0].offsetTop`. Assert correct index returned.

- [ ] **Step 3: Verify**
  - Run: `pnpm --filter @platejs/pagination test`
  - Run: `pnpm turbo typecheck --filter=./packages/pagination`

- [ ] **Step 4: Commit**
  - `git commit -m "refactor(pagination): expose mutations transform + non-monotonic split fallback"`

---

## Task 12 — P3 batch: leader-ref re-init + setPageSize typing + dedupe markDirty loops + hardcoded type cleanup

**Files:**
- Modify: `packages/pagination/src/PaginationCoordinator.tsx`
- Modify: `packages/pagination/src/BasePaginationPlugin.ts`

- [ ] **Step 1: Re-init leader ref on prop change**
  - In `PaginationCoordinator.tsx`, replace `useRef(leader.amILeader())` with:
    ```ts
    const isLeaderRef = useRef(leader.amILeader());
    useEffect(() => {
      isLeaderRef.current = leader.amILeader();
    }, [leader]);
    ```

- [ ] **Step 2: Narrow `setPageSize` parameter type**
  - In `BasePaginationPlugin.ts`, narrow to `setPageSize(size: 'A4' | 'Letter' | 'Legal')`.

- [ ] **Step 3: Collapse dedup mark-dirty loops**
  - In `toggleHeader` / `toggleFooter`, replace the `for (let i = 0; i < children.length; i++) runtime.markDirty(i)` with `runtime.markDirty(0)` (consumeDirtyMin already cascades).

- [ ] **Step 4: Remove hardcoded `'page'` literal**
  - Audit `BasePaginationPlugin.ts`/`reflowEngine.ts` for `'page'` string literals. Replace with `editor.getType(BasePaginationPlugin)`. The `node.type: 'page'` declaration stays — that's the canonical type name.

- [ ] **Step 5: Final `any`/literal grep**
  - Run: `grep -rnE "\\b(as any|: any)\\b" packages/pagination/src/`
  - Run: `grep -rnE "'(pagination|header|footer)'" packages/pagination/src/ --include='*.ts' --include='*.tsx'`
  - Expected: zero `any`. Strings only where introducing new node types is intentional (`'header'`/`'footer'` block creation).

- [ ] **Step 6: Verify full package**
  - Run: `pnpm turbo build --filter=./packages/pagination`
  - Run: `pnpm turbo typecheck --filter=./packages/pagination`
  - Run: `pnpm --filter @platejs/pagination test`
  - Run: `pnpm lint:fix`

- [ ] **Step 7: Commit**
  - `git commit -m "polish(pagination): leader re-init, narrowed page-size, dedup loops"`

---

## Final Verification (after all tasks)

- [ ] Run: `pnpm turbo build --filter=./packages/pagination`
- [ ] Run: `pnpm turbo typecheck --filter=./packages/pagination`
- [ ] Run: `pnpm --filter @platejs/pagination test`
- [ ] Run: `pnpm lint:fix`
- [ ] Spot-check: `git log --oneline codex/pagination-folder-pick ^origin/codex/pagination-folder-pick` shows 12 commits.
- [ ] Self-grep: `grep -rnE "\\b(as any|: any|__pagination)\\b" packages/pagination/src/` — zero matches.
- [ ] Add changeset per `.agents/rules/changeset.mdc` if package version should bump.

---

## Notes for implementer subagents

- Use the `task` superpower per CLAUDE.md.
- TDD discipline: for behavior changes (T2 microtask coalesce, T11 fallback), write the failing test first. For pure refactors (T1, T3–T9, T12), confirm green → refactor → confirm green again.
- Never push or open PR without explicit user ask. Commit only.
- If a step's verification reveals pre-existing build/typecheck noise unrelated to the change, run `pnpm run reinstall` once before debugging deeper (per CLAUDE.md guidance).
- Each task is independent of the next on file boundaries; do not skip ahead — later tasks assume earlier tasks landed (e.g., T9 assumes T2/T3 done).
