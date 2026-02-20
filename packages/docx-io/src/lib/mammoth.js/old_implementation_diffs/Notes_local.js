// lib/schema.ts:286
export class Notes {
  _notes: NotesMap;

  constructor(notes: NoteNode[] | Record<string, NoteNode>) {
    if (Array.isArray(notes)) {
      this._notes = {};
      for (const note of notes) {
        this._notes[noteKey(note.noteType, note.noteId)] = note;
      }
    } else {
      this._notes = notes;
    }
  }

  resolve(reference: NoteReference): NoteNode | null {
    return this.findNoteByKey(noteKey(reference.noteType, reference.noteId));
  }

  findNoteByKey(key: string): NoteNode | null {
    return this._notes[key] || null;
  }
}
