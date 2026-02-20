// lib/writers/html-writer.ts:3
function writer(options) {
  options = options || {};
  if (options.prettyPrint) {
    return prettyWriter();
  }
  return simpleWriter();
}
