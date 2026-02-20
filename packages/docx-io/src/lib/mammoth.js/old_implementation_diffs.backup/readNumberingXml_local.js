// lib/docx/numbering-xml.ts:51
function readNumberingXml(root, options) {
  if (!options || !options.styles) {
    throw new Error('styles is missing');
  }

  var abstractNums = readAbstractNums(root);
  var nums = readNums(root, abstractNums);
  return new Numbering(nums, abstractNums, options.styles);
}
