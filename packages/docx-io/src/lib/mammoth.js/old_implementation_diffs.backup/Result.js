// Lines 3401-3427 in old_implementation.js
function Result(value, messages) {
  this.value = value;
  this.messages = messages || [];
}

Result.prototype.map = function (func) {
  return new Result(func(this.value), this.messages);
};

Result.prototype.flatMap = function (func) {
  var funcResult = func(this.value);
  return new Result(funcResult.value, combineMessages([this, funcResult]));
};

Result.prototype.flatMapThen = function (func) {
  return func(this.value).then(
    (otherResult) =>
      new Result(otherResult.value, combineMessages([this, otherResult]))
  );
};

Result.combine = (results) => {
  var values = _.flatten(_.pluck(results, 'value'));
  var messages = combineMessages(results);
  return new Result(values, messages);
};
