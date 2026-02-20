// Lines 2511-2519 in old_implementation.js
function readAbstractNums(root) {
  var abstractNums = {};
  root.getElementsByTagName('w:abstractNum').forEach((element) => {
    var id = element.attributes['w:abstractNumId'];
    abstractNums[id] = readAbstractNum(element);
  });
  return abstractNums;
}
