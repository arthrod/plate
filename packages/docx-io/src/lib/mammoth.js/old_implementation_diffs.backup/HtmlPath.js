// Lines 4014-4025 in old_implementation.js
function HtmlPath(elements) {
  this._elements = elements;
}

HtmlPath.prototype.wrap = function wrap(children) {
  var result = children();
  for (var index = this._elements.length - 1; index >= 0; index--) {
    result = this._elements[index].wrapNodes(result);
  }
  return result;
};
