// Lines 1904-1912 in old_implementation.js
function combineResults(results) {
  var result = Result.combine(_.pluck(results, '_result'));
  return new ReadResult(
    _.flatten(_.pluck(result.value, 'element')),
    _.filter(_.flatten(_.pluck(result.value, 'extra')), identity),
    result.messages
  );
}
