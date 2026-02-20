// lib/docx/numbering-xml.ts:112
function readNums(root) {
  var nums = {};
  root.getElementsByTagName('w:num').forEach((element) => {
    var numId = element.attributes['w:numId'];
    var abstractNumId = element.first('w:abstractNumId').attributes['w:val'];
    nums[numId] = { abstractNumId };
  });
  return nums;
}
