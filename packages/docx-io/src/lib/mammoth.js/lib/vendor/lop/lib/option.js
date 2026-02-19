var nonePrototype = {
  value: function() {
    throw new Error('Called value on none');
  },
  isNone: function() {
    return true;
  },
  isSome: function() {
    return false;
  },
  map: function() {
    return exports.none;
  },
  flatMap: function() {
    return exports.none;
  },
  filter: function() {
    return exports.none;
  },
  toArray: function() {
    return [];
  },
  orElse: callOrReturn,
  valueOrElse: callOrReturn,
};

exports.none = Object.create(nonePrototype);

function callOrReturn(value) {
  if (typeof value === 'function') {
    return value();
  }
  return value;
}

exports.some = function(value) {
  return new Some(value);
};

function Some(value) {
  this._value = value;
}

Some.prototype.value = function() {
  return this._value;
};

Some.prototype.isNone = function() {
  return false;
};

Some.prototype.isSome = function() {
  return true;
};

Some.prototype.map = function(func) {
  return new Some(func(this._value));
};

Some.prototype.flatMap = function(func) {
  return func(this._value);
};

Some.prototype.filter = function(predicate) {
  return predicate(this._value) ? this : exports.none;
};

Some.prototype.toArray = function() {
  return [this._value];
};

Some.prototype.orElse = function() {
  return this;
};

Some.prototype.valueOrElse = function() {
  return this._value;
};

exports.isOption = function(value) {
  return value === exports.none || value instanceof Some;
};

exports.fromNullable = function(value) {
  if (value == null) {
    return exports.none;
  }
  return new Some(value);
};
