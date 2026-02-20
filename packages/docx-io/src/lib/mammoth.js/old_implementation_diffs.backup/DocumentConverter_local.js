// lib/document-to-html.ts:19
function DocumentConverter(options) {
  return {
    convertToHtml(element) {
      var comments = (
        element.type === documents.types.document ? element.comments : []
      ).reduce((indexedComments, comment) => {
        indexedComments[comment.commentId] = comment;
        return indexedComments;
      }, {});
      var conversion = new DocumentConversion(options, comments);
      return conversion.convertToHtml(element);
    },
  };
}
