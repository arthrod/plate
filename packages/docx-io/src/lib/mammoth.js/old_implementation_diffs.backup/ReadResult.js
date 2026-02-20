// Lines 1854-1903 in old_implementation.js
function ReadResult(element, extra, messages) {
  this.value = element || [];
  this.extra = extra || [];
  this._result = new Result(
    {
      element: this.value,
      extra,
    },
    messages
  );
  this.messages = this._result.messages;
}

ReadResult.prototype.toExtra = function () {
  return new ReadResult(
    null,
    joinElements(this.extra, this.value),
    this.messages
  );
};

ReadResult.prototype.insertExtra = function () {
  var extra = this.extra;
  if (extra && extra.length) {
    return new ReadResult(joinElements(this.value, extra), null, this.messages);
  }
  return this;
};

ReadResult.prototype.map = function (func) {
  var result = this._result.map((value) => func(value.element));
  return new ReadResult(result.value, this.extra, result.messages);
};

ReadResult.prototype.flatMap = function (func) {
  var result = this._result.flatMap((value) => func(value.element)._result);
  return new ReadResult(
    result.value.element,
    joinElements(this.extra, result.value.extra),
    result.messages
  );
};

ReadResult.map = (first, second, func) =>
  new ReadResult(
    func(first.value, second.value),
    joinElements(first.extra, second.extra),
    first.messages.concat(second.messages)
  );
