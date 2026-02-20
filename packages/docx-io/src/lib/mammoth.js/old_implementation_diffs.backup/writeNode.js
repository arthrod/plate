// Lines 2971-2980 in old_implementation.js
function writeNode(writer, node) {
  toStrings[node.type](writer, node);
}

var toStrings = {
  element: generateElementString,
  text: generateTextString,
  forceWrite() {},
};
