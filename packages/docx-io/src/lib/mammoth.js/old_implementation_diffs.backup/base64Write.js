// Lines 16599-16602 in old_implementation.js
function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}
