// Lines 751-760 in old_implementation.js
function Document(children, options) {
  options = options || {};
  return {
    type: types.document,
    children,
    notes: options.notes || new Notes({}),
    comments: options.comments || [],
  };
}
