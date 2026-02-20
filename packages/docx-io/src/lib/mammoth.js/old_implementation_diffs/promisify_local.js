// lib/promises.ts:25
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
