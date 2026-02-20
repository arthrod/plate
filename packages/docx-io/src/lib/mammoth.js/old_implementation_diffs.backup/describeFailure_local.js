// lib/style-reader.ts:383
function describeFailure(input, parseResult) {
  return (
    'Did not understand this style mapping, so ignored it: ' +
    input +
    '\n' +
    parseResult.errors().map(describeError).join('\n')
  );
}
