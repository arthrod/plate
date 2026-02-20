// Lines 2345-2351 in old_implementation.js
function stripPrefix(value, prefix) {
  if (value.substring(0, prefix.length) === prefix) {
    return value.substring(prefix.length);
  }
  return value;
}
