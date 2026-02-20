// lib/documents.ts:179
function inserted(children, options) {
  options = options || {};
  return {
    type: types.inserted,
    children,
    author: options.author || null,
    date: options.date || null,
    changeId: options.changeId || null,
  };
}
