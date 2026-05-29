---
"@platejs/pagination": patch
---

Fix pagination not working for consumers on published `platejs`: use a literal `'pagination'` key instead of `KEYS.pagination` (unreleased in `@platejs/utils`), mount the registry provider and reflow coordinator in one shared subtree so reflow can read registered pages, and render the page number in each page's bottom margin
