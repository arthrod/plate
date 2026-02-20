// lib/index.ts:24
function convertToMarkdown(input, options) {
  var markdownOptions = Object.create(options || {});
  markdownOptions.outputFormat = 'markdown';
  return withDone(convert(input, markdownOptions));
}
