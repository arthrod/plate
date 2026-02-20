// lib/zipfile.ts:67
function splitPath(path) {
  var lastIndex = path.lastIndexOf('/');
  if (lastIndex === -1) {
    return { dirname: '', basename: path };
  }
  return {
    dirname: path.substring(0, lastIndex),
    basename: path.substring(lastIndex + 1),
  };
}
