// lib/docx/files.ts:13
function Files(options) {
  options = options || {};
  if (!options.externalFileAccess) {
    return {
      read(uri) {
        return promises.reject(
          new Error(
            "could not read external image '" +
              uri +
              "', external file access is disabled"
          )
        );
      },
    };
  }

  var base = options.relativeToFile ? dirname(options.relativeToFile) : null;

  function read(uri, encoding) {
    return resolveUri(uri).then((path) =>
      readFile(path, encoding).catch((error) => {
        var message =
          "could not open external image: '" +
          uri +
          "' (document directory: '" +
          base +
          "')\n" +
          error.message;
        return promises.reject(new Error(message));
      })
    );
  }

  function resolveUri(uri) {
    var path = uriToPath(uri);
    if (isAbsolutePath(path)) {
      return promises.resolve(path);
    }
    if (base) {
      var resolved = resolvePath(base, path);
      // Prevent path traversal attacks
      if (!resolved.startsWith(base)) {
        return promises.reject(
          new Error("path traversal detected in external image: '" + uri + "'")
        );
      }
      return promises.resolve(resolved);
    }
    return promises.reject(
      new Error(
        "could not find external image '" +
          uri +
          "', path of input document is unknown"
      )
    );
  }

  return {
    read,
  };
}
