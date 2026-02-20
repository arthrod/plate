// Lines 3849-3857 in old_implementation.js
function describeFailure(input, parseResult) {
  return (
    'Did not understand this style mapping, so ignored it: ' +
    input +
    '\n' +
    parseResult.errors().map(describeError).join('\n')
  );
}
