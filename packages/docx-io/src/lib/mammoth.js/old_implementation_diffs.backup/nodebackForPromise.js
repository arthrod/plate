// Lines 12837-12863 in old_implementation.js
function nodebackForPromise(promise, multiArgs) {
    return function(err, value) {
        if (promise === null) return;
        if (err) {
            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
            promise._attachExtraTrace(wrapped);
            promise._reject(wrapped);
        } else if (!multiArgs) {
            promise._fulfill(value);
        } else {
            var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0)); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];};
            promise._fulfill(args);
        }
        promise = null;
    };
}

module.exports = nodebackForPromise;

},{"./errors":59,"./es5":60,"./util":83}],68:[function(require,module,exports){
"use strict";
module.exports = function(Promise) {
var util = require("./util");
var async = Promise._async;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
