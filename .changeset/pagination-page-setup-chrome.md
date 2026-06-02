---
"@platejs/pagination": minor
---

Render document page setup as live chrome: `resolvePageSetupChromeOptions` builds header/footer page-number bands from the `page_setup` node, the overlay reads page setup reactively (via the editor value, so it tracks document changes instead of memoizing a stale read), and a geometry-signature watcher recomputes the layout when page size / margins / chrome change — but not on ordinary text edits. Adds `pageSetupFromValue` and `pageNumberAlign`.

Fix `usePluginOption(plugin, 'chrome')` throwing `OPTION_UNDEFINED` when no chrome is configured by declaring a `chrome` default.
