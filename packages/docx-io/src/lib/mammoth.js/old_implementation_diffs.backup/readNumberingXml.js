// Lines 2501-2510 in old_implementation.js
function readNumberingXml(root, options) {
  if (!options || !options.styles) {
    throw new Error('styles is missing');
  }

  var abstractNums = readAbstractNums(root);
  var nums = readNums(root, abstractNums);
  return new Numbering(nums, abstractNums, options.styles);
}
