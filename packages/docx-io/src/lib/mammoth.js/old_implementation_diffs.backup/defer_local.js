// lib/promises.ts:103
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
