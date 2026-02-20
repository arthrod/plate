// lib/zipfile.ts:78
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
