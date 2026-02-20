// lib/documents.ts:112
function NoteReference(options) {
  return {
    type: types.noteReference,
    noteType: options.noteType,
    noteId: options.noteId,
  };
}
