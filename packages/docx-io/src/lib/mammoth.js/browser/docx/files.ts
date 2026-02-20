var promises = require('../../lib/promises.ts');

exports.Files = createFiles;

function createFiles() {
  function read(uri) {
    return promises.reject(
      new Error(
        "could not open external image: '" +
          uri +
          "'\ncannot open linked files from a web browser"
      )
    );
  }

  return {
    read,
  };
}
