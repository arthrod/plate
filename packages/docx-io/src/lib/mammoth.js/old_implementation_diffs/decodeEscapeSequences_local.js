// lib/style-reader.ts:339
function decodeEscapeSequences(value) {
  return value.replace(
    /\\(.)/g,
    (match, code) => escapeSequences[code] || code
  );
}
