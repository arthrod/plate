// Lines 3058-3067 in old_implementation.js
function flatMap(values, func) {
  return _.flatten(_.map(values, func), true);
}

var emptiers = {
  element: elementEmptier,
  text: textEmptier,
  forceWrite: neverEmpty,
};
