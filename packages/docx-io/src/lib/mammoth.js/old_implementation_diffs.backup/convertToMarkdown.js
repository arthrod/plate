// Lines 3149-3154 in old_implementation.js
function convertToMarkdown(input, options) {
  var markdownOptions = Object.create(options || {});
  markdownOptions.outputFormat = 'markdown';
  return convert(input, markdownOptions);
}
