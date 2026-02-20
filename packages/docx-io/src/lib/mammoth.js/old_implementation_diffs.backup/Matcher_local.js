// lib/styles/document-matchers.ts:38
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
