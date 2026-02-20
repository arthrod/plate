// Found in: /schema.ts:34
// Lines 858-866 in old_implementation.js
function Note(options) {
  return {
    type: types.note,
    noteType: options.noteType,
    noteId: options.noteId,
    body: options.body,
  };
}
