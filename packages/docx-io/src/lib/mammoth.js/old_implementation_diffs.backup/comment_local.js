// lib/documents.ts:152
function comment(options) {
  return {
    type: types.comment,
    commentId: options.commentId,
    body: options.body,
    authorName: options.authorName || null,
    authorInitials: options.authorInitials || null,
    date: options.date || null,
    paraId: options.paraId || null,
    parentParaId: options.parentParaId || null,
  };
}
