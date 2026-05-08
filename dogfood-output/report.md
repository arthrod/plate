# Dogfood Report: plate-playground

| Field | Value |
|-------|-------|
| **Date** | 2026-05-08 |
| **App URL** | https://plate-playground.cicero-im.workers.dev |
| **Session** | plate-playground |
| **Scope** | Test every pagination button and config (mode dropdown, paper presets, margins dialog, hybrid footer, paged overlay) |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| **Total** | **0** |

## Status: BLOCKED — could not dogfood

The session ended without reaching the editor UI. Every navigation to the deployed worker (`/`, `/editor`, post-Reload) renders Chromium's *"This page couldn't load"* page in this `agent-browser` container. None of the pagination controls (toolbar dropdown, margins dialog, mode toggle, footer chrome, page overlay) could be exercised.

## Diagnosis: harness limit, not a deploy bug

The failure is in the local browser environment. The deployed worker is healthy.

| Signal | Result |
|---|---|
| `curl -i https://plate-playground.cicero-im.workers.dev/` | `HTTP/2 307 → /editor` |
| `curl -i …/editor` | `HTTP/2 200`, `x-opennext: 1`, 220 KiB HTML, `<title>Create Next App</title>` |
| Server HTML grep for `slate-editor` / `playground` / `paragraph` | Match — SSR fine |
| `agent-browser open https://example.com` (control) | Renders cleanly, see `screenshots/control-example.png` |
| `agent-browser open …/editor` (3 attempts: `/`, `/editor`, post-Reload) | Chromium error page each time |
| Initial Chrome launch | Required `--args "--no-sandbox"` to start at all |
| `agent-browser console` post-crash | Empty — renderer never reaches `console.*` calls |
| Worker upload size | 36 437 KiB (gzipped 7 880 KiB) |

The Plate playground bundle is heavy (~36 MiB JS). Chromium under `--no-sandbox` in this container is OOM-ing the renderer process before hydration. example.com works, so Chrome itself is healthy — only the Plate bundle reproduces.

## What this session DID confirm

- Cloudflare Worker `plate-playground` is live (HTTP 200, OpenNext markers)
- SSR emits the Plate editor markup (`class="slate-editor …"`, "Plate playground" text)
- Repo-level gates passed in this same turn: lint clean, typecheck green, `bun test` 33/33 pagination + `pnpm test` 92/92 docx-io

## What this session did NOT verify

- `<PaginationToolbar/>` dropdown (Standard / A4 / Letter / Legal / Custom…) — visual + click + `setMode` behaviour
- `<MarginsDialog/>` open / submit / unit toggle / `setMargins` patch
- Standard-mode hybrid sticky-when-short / anchored-when-long footer transition on doc growth
- Paged-mode `<PageOverlay/>` thumbnails + `setPageSize` round trip
- pretext-driven re-pagination smoothness (rAF coalescing visible to a human)
- Footnote well placement (standard end-of-doc well vs paged per-page wells)
- Browser console for runtime errors

## Recommendation

To actually dogfood pagination on this build:

1. **Use a real Chrome on a workstation** — the bundle hydrates fine outside a `--no-sandbox` container. Open https://plate-playground.cicero-im.workers.dev/editor in your normal browser.
2. **Or run locally** — `bun run dev` inside `templates/plate-playground-template` and dogfood against `localhost:3000`. The dev bundle is lighter and won't pressure the renderer.
3. **Or run agent-browser from a host with a sandboxed Chrome** — the OOM is specific to this container's `--no-sandbox` mode.

## Evidence

| Screenshot | Description |
|---|---|
| [screenshots/initial.png](screenshots/initial.png) | First load → Chromium "This page couldn't load" |
| [screenshots/after-reload.png](screenshots/after-reload.png) | Same after clicking Reload |
| [screenshots/control-example.png](screenshots/control-example.png) | Sanity: example.com renders fine in same session |
| [screenshots/playground-after-wait.png](screenshots/playground-after-wait.png) | Same crash after `wait --load networkidle` + 5 s |
| [screenshots/root-attempt.png](screenshots/root-attempt.png) | Same crash on root URL `/` |

## Issues

None — the application UI never rendered. Server health is intact (HTTP 200, full SSR HTML reaches the wire). No issues attributable to the deploy itself can be filed from this session.
