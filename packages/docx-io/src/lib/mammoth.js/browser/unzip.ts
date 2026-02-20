var promises = require('../lib/promises.ts');
var zipfile = require('../lib/zipfile.ts');

exports.openZip = browserOpenZip;

function browserOpenZip(options) {
  if (options.arrayBuffer) {
    return promises.resolve(zipfile.openArrayBuffer(options.arrayBuffer));
  }

  return promises.reject(new Error('Could not find file in options'));
}
