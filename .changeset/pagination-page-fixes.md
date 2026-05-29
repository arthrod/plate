---
"@platejs/pagination": patch
---

Pagination works for consumers on published `platejs`: registration uses a literal `'pagination'` key (the `KEYS.pagination` constant is unreleased in `@platejs/utils`), the registry provider and reflow coordinator share one mounted subtree so reflow can read registered pages, and each page renders its page number in the bottom margin.
