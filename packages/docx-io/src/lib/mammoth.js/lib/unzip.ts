var promises = require('./promises.ts');
var zipfile = require('./zipfile.ts');

exports.openZip = openZip;

function openZip(options) {
  if (options.arrayBuffer) {
    return promises.resolve(zipfile.openArrayBuffer(options.arrayBuffer));
  }
  if (options.path) {
    var fs = typeof require !== 'undefined' ? require('fs') : null;
    if (!fs) {
      return promises.reject(new Error('fs is not available in browser environment'));
    }
    var readFile = promises.promisify(fs.readFile);
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
