// Found in: /schema.ts:278
// Lines 846-857 in old_implementation.js
function Notes(notes) {
  this._notes = _.indexBy(notes, (note) => noteKey(note.noteType, note.noteId));
}

Notes.prototype.resolve = function (reference) {
  return this.findNoteByKey(noteKey(reference.noteType, reference.noteId));
};

Notes.prototype.findNoteByKey = function (key) {
  return this._notes[key] || null;
};
