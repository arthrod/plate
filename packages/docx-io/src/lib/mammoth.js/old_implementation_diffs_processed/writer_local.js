// Found in: /writers/markdown-writer.ts:149
// Lines 4185-4199 in old_implementation.js
function writer(options) {
  options = options || {};
  if (options.prettyPrint) {
    return prettyWriter();
  }
  return simpleWriter();
}

var indentedElements = {
  div: true,
  p: true,
  ul: true,
  li: true,
};
