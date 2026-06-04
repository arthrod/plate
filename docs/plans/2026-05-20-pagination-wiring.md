# Wire `@platejs/pagination` into apps/www (+ auto-mount runtime)

**Goal:** Make `PaginationPlugin` usable as a one-line plugin and wire it into the
main `apps/www` `EditorKit` so the playground editor is paginated.

**Decisions (user-confirmed 2026-05-20):**
- Wiring location: main `EditorKit` (default playground becomes paginated).
- Package fix: yes — React `PaginationPlugin` auto-mounts its required runtime.

**north-star reaffirmed: laws** — React wrapper owns mounting its own React
runtime (registry provider + coordinator). Leader-collab mode delegates
coordinator ownership to the yjs bridge. No new public API shape.

**Branch / PR strategy (stacked):**
- PR1 `codex/pagination-plugin-automount` (off `codex/pagination-folder-pick`):
  package change.
- PR2 `codex/pagination-www-wiring` (off PR1): apps/www wiring.

---

## PR1 — Package: auto-mount provider + coordinator

The React `PaginationPlugin` currently only wires `render.node: PageElement`.
`PageElement` calls `usePaginationRegistry()` (warns without provider) and reflow
only runs if a `PaginationCoordinator` is mounted. Fix: the wrapper mounts both.

- `render.aboveEditable = PaginationRegistryProvider` (wraps the Editable → pages).
- `render.afterEditable = PaginationAfterEditable` (internal wrapper that mounts
  `PaginationCoordinator` unless `collaboration.mode === 'leader'`).

### TDD cycles (packages/pagination)
- [ ] Cycle 1 (RED→GREEN): `PaginationPlugin.render.aboveEditable === PaginationRegistryProvider`.
- [ ] Cycle 2: `PaginationPlugin.render.afterEditable` is defined (auto coordinator).
- [ ] Cycle 3 (behavior): `PaginationAfterEditable` renders a `PaginationCoordinator`
      when `collaboration.mode === 'all'`, renders `null` when `mode === 'leader'`.

### Verify
- `pnpm --filter @platejs/pagination test`
- `pnpm turbo build --filter=./packages/pagination` then `typecheck`
- `pnpm brl` (new internal file shouldn't change barrel; confirm)
- `pnpm lint:fix`
- changeset (patch/minor: pagination now auto-mounts its runtime)

---

## PR2 — apps/www wiring

- [ ] Add `@platejs/pagination` to `apps/www/package.json` deps.
- [ ] Create `apps/www/src/registry/components/editor/plugins/pagination-kit.tsx`
      exporting `PaginationKit = [PaginationPlugin]`.
- [ ] Add `...PaginationKit` to `EditorKit` in `editor-kit.tsx`.
- [ ] Add to `registry-kits.ts` if other kits are registered there.

### Verify
- `pnpm install`
- `pnpm turbo typecheck --filter=./apps/www` (build deps first)
- `pnpm lint:fix`
- Browser: load the playground via dev-browser, confirm pages render + reflow,
  no `usePaginationRegistry` warning in console.
