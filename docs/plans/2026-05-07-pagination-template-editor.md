# Pagination template editor work

## Goal

Finish pagination/template-editor integration: split-section action, resizable page preview, plugin-backed ghost text, safe footer insertion, customizable page size/borders, richer PlateStatic preview, intuitive controls, footnote placement choices, regenerated plugin/template output, deployment/dogfood, commit/push.

## Phases

1. Inspect current pagination/template patterns.
2. Implement pagination package UX/API changes.
3. Wire pagination controls into registry/template editor.
4. Regenerate barrels/templates and remove generated `dist`.
5. Verify package/app validators.
6. Deploy OpenNext template to Cloudflare and dogfood.
7. Commit and push.

## Notes

- Ignore PR374 comments per user.
- Planning files live under `docs/plans/` per repo instruction.
- Template files are CI-controlled; prefer registry/source changes and generated update scripts.

## Errors

| Error | Resolution |
| --- | --- |
| `docs/solutions/patterns/critical-patterns.md` missing | Continue with targeted solution docs. |
| `pnpm --filter @platejs/pagination test ...` failed because `plate-pkg` was not installed (`node_modules` missing) | Run `pnpm install` before final package verification, per repo required sequence. |
| `pnpm --filter www typecheck` reported many unresolved workspace-package imports after local app code was fixed | Run the repo build warm-up before rerunning app typecheck, per repo guidance. |
