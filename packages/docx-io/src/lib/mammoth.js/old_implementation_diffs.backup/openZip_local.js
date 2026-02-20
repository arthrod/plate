// lib/unzip.ts:10
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
