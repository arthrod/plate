// Found in: /zipfile.ts:5
// Lines 4810-4843 in old_implementation.js
function joinPath() {
  var nonEmptyPaths = Array.prototype.filter.call(arguments, (path) => path);

  var relevantPaths = [];

  nonEmptyPaths.forEach((path) => {
    if (path.startsWith('/')) {
      relevantPaths = [path];
    } else {
      relevantPaths.push(path);
    }
  });

  return relevantPaths.join('/');
}

},{"base64-js":48,"jszip":89}],42:[function(require,module,exports){
'use strict'

/**
 * Ponyfill for `Array.prototype.find` which is only available in ES6 runtimes.
 *
 * Works with anything that has a `length` property and index access properties, including NodeList.
 *
 * @template {unknown} T
 * @param {Array<T> | ({length:number, [number]: T})} list
 * @param {function (item: T, index: number, list:Array<T> | ({length:number, [number]: T})):boolean} predicate
 * @param {Partial<Pick<ArrayConstructor['prototype'], 'find'>>?} ac `Array.prototype` by default,
 * 				allows injecting a custom implementation in tests
 * @returns {T | undefined}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 * @see https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.find
 */