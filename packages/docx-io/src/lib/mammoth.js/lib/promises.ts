// @ts-nocheck
exports.defer = defer;
exports.when = function (value) {
  return Promise.resolve(value);
};
exports.resolve = function (value) {
  return Promise.resolve(value);
};
exports.all = function (promises) {
  return Promise.all(promises);
};
exports.props = props;
exports.reject = function (reason) {
  return Promise.reject(reason);
};
exports.promisify = promisify;
exports.mapSeries = mapSeries;
exports.attempt = attempt;

exports.nfcall = function (func) {
  var args = Array.prototype.slice.call(arguments, 1);
  var promisedFunc = promisify(func);
  return promisedFunc.apply(null, args);
};

function promisify(func) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var context = this;
    return new Promise(function (resolve, reject) {
      func.apply(context, args.concat(function (error, value) {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      }));
    });
  };
}

/**
 * Resolve all promise-valued properties of an object concurrently.
 * Equivalent to bluebird.props().
 */
function props(obj) {
  var keys = Object.keys(obj);
  var values = keys.map(function (key) {
    return obj[key];
  });
  return Promise.all(values).then(function (resolvedValues) {
    var result = {};
    keys.forEach(function (key, index) {
      result[key] = resolvedValues[index];
    });
    return result;
  });
}

/**
 * Sequential map: apply func to each item in order, waiting for each to resolve.
 * Equivalent to bluebird.mapSeries().
 */
function mapSeries(items, func) {
  var results = [];
  return items
    .reduce(function (chain, item, index) {
      return chain.then(function () {
        return Promise.resolve(func(item, index)).then(function (value) {
          results.push(value);
        });
      });
    }, Promise.resolve())
    .then(function () {
      return results;
    });
}

/**
 * Try to call func synchronously; wrap result in a promise.
 * If func throws, return a rejected promise.
 * Equivalent to bluebird.attempt() / bluebird.try().
 */
function attempt(func) {
  try {
    return Promise.resolve(func());
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Chain helper: merge new keys (possibly promise-valued) into an accumulated object.
 * Replacement for the bluebird.prototype.also() extension.
 */
exports.also = function (promise, func) {
  return promise.then(function (value) {
    var additions = func(value);
    var merged = Object.assign({}, value, additions);
    return props(merged);
  });
};

function defer() {
  var resolve;
  var reject;
  var promise = new Promise(function (resolveArg, rejectArg) {
    resolve = resolveArg;
    reject = rejectArg;
  });

  return {
    resolve: resolve,
    reject: reject,
    promise: promise,
  };
}
