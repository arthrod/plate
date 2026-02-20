// Found in: /schema.ts:125
// Lines 2921-2944 in old_implementation.js
function text(value) {
  return {
    type: 'text',
    value,
  };
}

var forceWrite = {
  type: 'forceWrite',
};

exports.freshElement = freshElement;
exports.nonFreshElement = nonFreshElement;
exports.elementWithTag = elementWithTag;
exports.text = text;
exports.forceWrite = forceWrite;

var voidTagNames = {
  br: true,
  hr: true,
  img: true,
  input: true,
};
