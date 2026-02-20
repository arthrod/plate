// lib/documents.ts:190
function deleted(children, options) {
  options = options || {};
  return {
    type: types.deleted,
    children,
    author: options.author || null,
    date: options.date || null,
    changeId: options.changeId || null,
  };
}
