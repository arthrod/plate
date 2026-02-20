// Found in: /document-to-html.ts:9
// Lines 106-118 in old_implementation.js
function DocumentConverter(options) {
  return {
    convertToHtml(element) {
      var comments = _.indexBy(
        element.type === documents.types.document ? element.comments : [],
        'commentId'
      );
      var conversion = new DocumentConversion(options, comments);
      return conversion.convertToHtml(element);
    },
  };
}
