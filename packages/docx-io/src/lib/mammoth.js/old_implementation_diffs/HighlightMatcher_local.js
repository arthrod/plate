// Found in: /schema.ts:804
// Lines 3936-3947 in old_implementation.js
function HighlightMatcher(options) {
  options = options || {};
  this._color = options.color;
}

HighlightMatcher.prototype.matches = function (element) {
  return (
    element.type === 'highlight' &&
    (this._color === undefined || element.color === this._color)
  );
};
