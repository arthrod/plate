---
'@platejs/pagination': patch
---

Constrain header/footer bands with `overflow: hidden` so authored chrome content cannot bleed past the configured band height. Page Setup dialog inputs now auto-select on focus and re-sync with external option changes (preset clicks / unit toggles), so typing replaces rather than appends — fixes pathological values like a `96 → 96300` margin from quick edits.
