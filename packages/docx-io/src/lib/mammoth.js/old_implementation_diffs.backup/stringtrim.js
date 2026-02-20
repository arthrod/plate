// Lines 17435-17439 in old_implementation.js
function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}
