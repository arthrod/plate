// Found in: /promises.ts:1
// Lines 3362-3379 in old_implementation.js
function defer() {
  var resolve;
  var reject;
  var promise = new bluebird.Promise((resolveArg, rejectArg) => {
    resolve = resolveArg;
    reject = rejectArg;
  });

  return {
    resolve,
    reject,
    promise,
  };
}

},{"bluebird/js/release/promise":69,"underscore":104}],25:[function(require,module,exports){
var documents = require('./documents');
