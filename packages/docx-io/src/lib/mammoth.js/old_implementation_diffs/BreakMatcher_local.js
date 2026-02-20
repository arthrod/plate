// Found in: /styles/document-matchers.ts:16
// Lines 3948-3959 in old_implementation.js
function BreakMatcher(options) {
  options = options || {};
  this._breakType = options.breakType;
}

BreakMatcher.prototype.matches = function (element) {
  return (
    element.type === 'break' &&
    (this._breakType === undefined || element.breakType === this._breakType)
  );
};
