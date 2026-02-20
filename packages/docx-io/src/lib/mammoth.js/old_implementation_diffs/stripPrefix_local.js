// lib/docx/docx-reader.ts:244
function stripPrefix(value, prefix) {
  if (value.substring(0, prefix.length) === prefix) {
    return value.substring(prefix.length);
  }
  return value;
}
