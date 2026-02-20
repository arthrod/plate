// Consolidated short-name functions (<= 3 chars)
// Each with 10 lines context before/after from old_implementation.js

// ======================================================================
// Function: Run  (lines 781-807)
// Context starts at line 771
// ======================================================================
    indent: {
      start: indent.start || null,
      end: indent.end || null,
      firstLine: indent.firstLine || null,
      hanging: indent.hanging || null,
    },
    paraId: properties.paraId || null,
  };
}

function Run(children, properties) {
  properties = properties || {};
  return {
    type: types.run,
    children,
    styleId: properties.styleId || null,
    styleName: properties.styleName || null,
    isBold: !!properties.isBold,
    isUnderline: !!properties.isUnderline,
    isItalic: !!properties.isItalic,
    isStrikethrough: !!properties.isStrikethrough,
    isAllCaps: !!properties.isAllCaps,
    isSmallCaps: !!properties.isSmallCaps,
    verticalAlignment:
      properties.verticalAlignment || verticalAlignment.baseline,
    font: properties.font || null,
    fontSize: properties.fontSize || null,
    highlight: properties.highlight || null,
  };
}

var verticalAlignment = {
  baseline: 'baseline',
  superscript: 'superscript',
  subscript: 'subscript',
};

function Text(value) {
  return {
    type: types.text,
    value,
  };
}

function Tab() {
  return {
    type: types.tab,

// ======================================================================
// Function: Tab  (lines 815-820)
// Context starts at line 805
// ======================================================================
  subscript: 'subscript',
};

function Text(value) {
  return {
    type: types.text,
    value,
  };
}

function Tab() {
  return {
    type: types.tab,
  };
}

function Checkbox(options) {
  return {
    type: types.checkbox,
    checked: options.checked,
  };
}

function Hyperlink(children, options) {
  return {
    type: types.hyperlink,

// ======================================================================
// Function: run  (lines 3898-3901)
// Context starts at line 3888
// ======================================================================
exports.lineBreak = new BreakMatcher({ breakType: 'line' });
exports.pageBreak = new BreakMatcher({ breakType: 'page' });
exports.columnBreak = new BreakMatcher({ breakType: 'column' });
exports.equalTo = equalTo;
exports.startsWith = startsWith;

function paragraph(options) {
  return new Matcher('paragraph', options);
}

function run(options) {
  return new Matcher('run', options);
}

function table(options) {
  return new Matcher('table', options);
}

function highlight(options) {
  return new HighlightMatcher(options);
}

function Matcher(elementType, options) {
  options = options || {};

// ======================================================================
// Function: run  (lines 4122-4125)
// Context starts at line 4112
// ======================================================================
exports.run = run;
exports._elements = elements;
exports._elementsOfType = elementsOfType;
exports.getDescendantsOfType = getDescendantsOfType;
exports.getDescendants = getDescendants;

function paragraph(transform) {
  return elementsOfType('paragraph', transform);
}

function run(transform) {
  return elementsOfType('run', transform);
}

function elementsOfType(elementType, transform) {
  return elements((element) => {
    if (element.type === elementType) {
      return transform(element);
    }
    return element;
  });
}

function elements(transform) {

// ======================================================================
// Function: any  (lines 10230-10257)
// Context starts at line 10220
// ======================================================================
    )
  }

  return parts.join('')
}

},{}],49:[function(require,module,exports){
"use strict";
module.exports = function(Promise) {
var SomePromiseArray = Promise._SomePromiseArray;
function any(promises) {
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(1);
    ret.setUnwrap();
    ret.init();
    return promise;
}

Promise.any = function (promises) {
    return any(promises);
};

Promise.prototype.any = function () {
    return any(this);
};

};

},{}],50:[function(require,module,exports){
(function (process){(function (){
"use strict";
var firstLineError;
try {throw new Error(); } catch (e) {firstLineError = e;}
var schedule = require("./schedule");
var Queue = require("./queue");
var util = require("./util");

function Async() {
    this._customScheduler = false;
    this._isTickUsed = false;
    this._lateQueue = new Queue(16);
    this._normalQueue = new Queue(16);
    this._haveDrainedQueues = false;
    this._trampolineEnabled = true;
    var self = this;
    this.drainQueues = function () {
        self._drainQueues();

// ======================================================================
// Function: map  (lines 12710-12810)
// Context starts at line 12700
// ======================================================================
        if (booleans[i]) ret[j++] = values[i];
    }
    ret.length = j;
    this._resolve(ret);
};

MappingPromiseArray.prototype.preservedValues = function () {
    return this._preservedValues;
};

function map(promises, fn, options, _filter) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }

    var limit = 0;
    if (options !== undefined) {
        if (typeof options === "object" && options !== null) {
            if (typeof options.concurrency !== "number") {
                return Promise.reject(
                    new TypeError("'concurrency' must be a number but it is " +
                                    util.classString(options.concurrency)));
            }
            limit = options.concurrency;
        } else {
            return Promise.reject(new TypeError(
                            "options argument must be an object but it is " +
                             util.classString(options)));
        }
    }
    limit = typeof limit === "number" &&
        isFinite(limit) && limit >= 1 ? limit : 0;
    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
}

Promise.prototype.map = function (fn, options) {
    return map(this, fn, options, null);
};

Promise.map = function (promises, fn, options, _filter) {
    return map(promises, fn, options, _filter);
};


};

},{"./util":83}],66:[function(require,module,exports){
"use strict";
module.exports =
function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
var util = require("./util");
var tryCatch = util.tryCatch;

Promise.method = function (fn) {
    if (typeof fn !== "function") {
        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
    }
    return function () {
        var ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._pushContext();
        var value = tryCatch(fn).apply(this, arguments);
        var promiseCreated = ret._popContext();
        debug.checkForgottenReturns(
            value, promiseCreated, "Promise.method", ret);
        ret._resolveFromSyncValue(value);
        return ret;
    };
};

Promise.attempt = Promise["try"] = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._pushContext();
    var value;
    if (arguments.length > 1) {
        debug.deprecated("calling Promise.try with more than 1 argument");
        var arg = arguments[1];
        var ctx = arguments[2];
        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
                                  : tryCatch(fn).call(ctx, arg);
    } else {
        value = tryCatch(fn)();
    }
    var promiseCreated = ret._popContext();
    debug.checkForgottenReturns(
        value, promiseCreated, "Promise.try", ret);
    ret._resolveFromSyncValue(value);
    return ret;
};

Promise.prototype._resolveFromSyncValue = function (value) {
    if (value === util.errorObj) {
        this._rejectCallback(value.e, false);
    } else {
        this._resolveCallback(value, true);
    }
};
};

},{"./util":83}],67:[function(require,module,exports){
"use strict";
var util = require("./util");
var maybeWrapAsError = util.maybeWrapAsError;
var errors = require("./errors");
var OperationalError = errors.OperationalError;
var es5 = require("./es5");

function isUntypedError(obj) {
    return obj instanceof Error &&
        es5.getPrototypeOf(obj) === Error.prototype;
}

var rErrorKey = /^(?:name|message|stack|cause)$/;
function wrapAsOperationalError(obj) {
    var ret;
    if (isUntypedError(obj)) {
        ret = new OperationalError(obj);

// ======================================================================
// Function: env  (lines 15708-15711)
// Context starts at line 15698
// ======================================================================
        return null;
    };
}

var isNode = typeof process !== "undefined" &&
        classString(process).toLowerCase() === "[object process]";

var hasEnvVariables = typeof process !== "undefined" &&
    typeof process.env !== "undefined";

function env(key) {
    return hasEnvVariables ? process.env[key] : undefined;
}

function getNativePromise() {
    if (typeof Promise === "function") {
        try {
            var promise = new Promise(function(){});
            if ({}.toString.call(promise) === "[object Promise]") {
                return Promise;
            }
        } catch (e) {}
    }
}

// ======================================================================
// Function: dec  (lines 18658-18661)
// Context starts at line 18648
// ======================================================================
    var scalarValue = {
        codePoint: codePoint_1,
        string: fromCodePoint(codePoint_1),
    };
    dingbatsByCodePoint[dingbat["Typeface name"].toUpperCase() + "_" + dingbat["Dingbat dec"]] = scalarValue;
}
function codePoint(typeface, codePoint) {
    return dingbatsByCodePoint[typeface.toUpperCase() + "_" + codePoint];
}
exports.codePoint = codePoint;
function dec(typeface, dec) {
    return codePoint(typeface, parseInt(dec, 10));
}
exports.dec = dec;
function hex(typeface, hex) {
    return codePoint(typeface, parseInt(hex, 16));
}
exports.hex = hex;
function fromCodePointPolyfill(codePoint) {
    if (codePoint <= 0xFFFF) {
        // BMP
        return String.fromCharCode(codePoint);
    }
    else {

// ======================================================================
// Function: hex  (lines 18662-18665)
// Context starts at line 18652
// ======================================================================
    dingbatsByCodePoint[dingbat["Typeface name"].toUpperCase() + "_" + dingbat["Dingbat dec"]] = scalarValue;
}
function codePoint(typeface, codePoint) {
    return dingbatsByCodePoint[typeface.toUpperCase() + "_" + codePoint];
}
exports.codePoint = codePoint;
function dec(typeface, dec) {
    return codePoint(typeface, parseInt(dec, 10));
}
exports.dec = dec;
function hex(typeface, hex) {
    return codePoint(typeface, parseInt(hex, 16));
}
exports.hex = hex;
function fromCodePointPolyfill(codePoint) {
    if (codePoint <= 0xFFFF) {
        // BMP
        return String.fromCharCode(codePoint);
    }
    else {
        // Astral
        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var highSurrogate = Math.floor((codePoint - 0x10000) / 0x400) + 0xD800;
        var lowSurrogate = (codePoint - 0x10000) % 0x400 + 0xDC00;

