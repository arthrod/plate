// Found in: /schema.ts:790
// Lines 3910-3935 in old_implementation.js
function Matcher(elementType, options) {
  options = options || {};
  this._elementType = elementType;
  this._styleId = options.styleId;
  this._styleName = options.styleName;
  if (options.list) {
    this._listIndex = options.list.levelIndex;
    this._listIsOrdered = options.list.isOrdered;
  }
}

Matcher.prototype.matches = function (element) {
  return (
    element.type === this._elementType &&
    (this._styleId === undefined || element.styleId === this._styleId) &&
    (this._styleName === undefined ||
      (element.styleName &&
        this._styleName.operator(
          this._styleName.operand,
          element.styleName
        ))) &&
    (this._listIndex === undefined ||
      isList(element, this._listIndex, this._listIsOrdered))
  );
};
