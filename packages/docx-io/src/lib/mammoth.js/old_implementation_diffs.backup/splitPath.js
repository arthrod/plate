// Lines 4799-4809 in old_implementation.js
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
