// Lines 16591-16594 in old_implementation.js
function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}
