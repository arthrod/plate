var fs = require('fs');

var promises = require('./promises.ts');
var zipfile = require('./zipfile.ts');

exports.openZip = openZip;

var readFile = promises.promisify(fs.readFile);

function openZip(options) {
  if (options.path) {
    return readFile(options.path).then(zipfile.openArrayBuffer);
  }
  if (options.buffer) {
    return promises.resolve(zipfile.openArrayBuffer(options.buffer));
  }
  if (options.file) {
    return promises.resolve(options.file);
  }
  return promises.reject(new Error('Could not find file in options'));
}
