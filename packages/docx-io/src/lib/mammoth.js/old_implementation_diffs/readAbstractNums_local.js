// lib/docx/numbering-xml.ts:61
function readAbstractNums(root) {
  var abstractNums = {};
  root.getElementsByTagName('w:abstractNum').forEach((element) => {
    var id = element.attributes['w:abstractNumId'];
    abstractNums[id] = readAbstractNum(element);
  });
  return abstractNums;
}
