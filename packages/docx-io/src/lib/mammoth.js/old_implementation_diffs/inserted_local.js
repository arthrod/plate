// Found in: /styles/document-matchers.ts:14
// Lines 901-911 in old_implementation.js
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
