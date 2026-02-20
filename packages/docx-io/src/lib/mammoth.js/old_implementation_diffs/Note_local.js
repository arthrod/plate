// lib/documents.ts:136
function Note(options) {
  return {
    type: types.note,
    noteType: options.noteType,
    noteId: options.noteId,
    body: options.body,
  };
}
