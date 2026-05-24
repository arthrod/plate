# Pagination Demo Print Regression

## Goal

Find why the demo printed a page successfully on branch
`codex/pagination-e2e-tests` but not on `codex/playground-pagination-toggle`,
then fix this branch.

## Constraints

- Pagination work must use pretext for faithful pagination.
- Do not edit `templates/**` manually.
- If code changes, verify in the same turn.
- If browser surface changes, verify with `dev-browser` before handoff.

## Plan

- [x] Load repo skills and rules.
- [x] Check existing pagination plans and documented learnings.
- [ ] Reproduce the current failure.
- [ ] Compare current branch with `codex/pagination-e2e-tests`.
- [ ] Identify root cause before patching.
- [ ] Implement focused fix.
- [ ] Run tests, coverage, lint/type checks, and browser proof as applicable.
- [ ] Evaluate whether to capture a `docs/solutions/` learning.

## Findings

- Current branch: `codex/playground-pagination-toggle`.
- Known-good comparison branch exists locally: `codex/pagination-e2e-tests`.
- `docs/solutions/patterns/critical-patterns.md` is referenced by the skill but
  is absent in this repo.
- Existing pagination plans emphasize derived layout, pretext-based measurement,
  and browser verification for render surfaces.
- The repo app route `/dev/pagination2` renders pagination labels on this branch:
  `Page 1 of 4` through `Page 4 of 4`.
- The template `/editor` route renders zero page markers on load because
  `PaginationKit` configures `PaginationPlugin` with `enabled: false`.
- Root cause: the comparison branch tests a direct demo plugin install; this
  branch's playground integration starts the plugin disabled.
- Second root cause: full playground editors wrap each top-level Slate element
  in block UI chrome (`div.relative.group`), while `topLevelBlockElements`
  only measured direct `[data-slate-node="element"]` children. That made every
  block fall back to one line, so the full editor composed as a single page.

## Progress

- 2026-05-24: Started branch comparison and regression investigation.
- 2026-05-24: Reproduced template `/editor` missing pagination markers; direct
  `/dev/pagination2` demo remains green.
- 2026-05-24: Fixed measurement lookup for wrapped block DOM, enabled pagination
  by default in the playground integration, added registry wiring and E2E tests.
- 2026-05-24: Verified template `/editor` renders `Page 1 of 2` / `Page 2 of 2`.

## Verification

- `pnpm install`
- `bun test --coverage packages/pagination/src` — 56 pass; package lines are
  100% except `react/domMeasure.ts` at 81.48%; Bun did not emit branch coverage.
- `pnpm turbo build --filter=./packages/pagination`
- `pnpm turbo typecheck --filter=./packages/pagination --filter=./apps/www`
- `pnpm lint:fix`
- `bun typecheck` in `templates/plate-playground-template`
- `PLAYWRIGHT_BASE_URL=http://localhost:3002 pnpm exec playwright test tooling/e2e/pagination.spec.ts --browser=chromium --workers=1`
- Browser probe for `http://localhost:3001/editor` — 1 break line, 1 page marker,
  labels `Page 1 of 2`, `Page 2 of 2`, no console errors.
- `dev-browser --connect http://127.0.0.1:9222 --help` blocked: CLI not installed
  in this environment.
