var htmlWriter = require('./html-writer.ts');
var markdownWriter = require('./markdown-writer.ts');

exports.writer = writer;

function writer(options) {
  options = options || {};
  if (options.outputFormat === 'markdown') {
    return markdownWriter.writer();
  }
  return htmlWriter.writer(options);
}
