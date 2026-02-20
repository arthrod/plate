// Lines 838-845 in old_implementation.js
function NoteReference(options) {
  return {
    type: types.noteReference,
    noteType: options.noteType,
    noteId: options.noteId,
  };
}
