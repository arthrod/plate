// Lines 912-922 in old_implementation.js
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
