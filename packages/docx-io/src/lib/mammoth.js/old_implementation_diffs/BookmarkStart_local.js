// lib/documents.ts:270
function BookmarkStart(options) {
  return {
    type: types.bookmarkStart,
    name: options.name,
  };
}
