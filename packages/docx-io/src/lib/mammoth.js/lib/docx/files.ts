var promises = require('../promises.ts');

exports.Files = Files;
exports.uriToPath = uriToPath;

function getFs() {
  return typeof require !== 'undefined' ? require('fs') : null;
}

function getPath() {
  return typeof require !== 'undefined' ? require('path') : null;
}

function getOs() {
  return typeof require !== 'undefined' ? require('os') : null;
}

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

  var fs = getFs();
  var path = getPath();
  if (!fs || !path) {
    return {
      read(uri) {
        return promises.reject(
          new Error(
            "could not read external image '" +
              uri +
              "', file system access not available in browser"
          )
        );
      },
    };
  }

  var dirname = path.dirname;
  var resolvePath = path.resolve;
  var isAbsolutePath = path.isAbsolute;

  var base = options.relativeToFile ? dirname(options.relativeToFile) : null;
  var readFile = promises.promisify(fs.readFile.bind(fs));

  function read(uri, encoding) {
    return resolveUri(uri).then((filePath) =>
      readFile(filePath, encoding).catch((error) => {
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
    var filePath = uriToPath(uri);
    if (isAbsolutePath(filePath)) {
      return promises.resolve(filePath);
    }
    if (base) {
      var resolved = resolvePath(base, filePath);
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

function uriToPath(uriString: string, platform?: string) {
  if (!platform) {
    var os = getOs();
    platform = os ? os.platform() : 'browser';
  }

  var uri;
  try {
    uri = new URL(uriString, 'file://localhost/');
  } catch (e) {
    return decodeURIComponent(uriString);
  }

  if (isRelativeUri(uriString, uri)) {
    return decodeURIComponent(uriString);
  }

  if (isLocalFileUri(uri)) {
    var uriPath = decodeURIComponent(uri.pathname);
    if (platform === 'win32' && /^\/[a-z]:/i.test(uriPath)) {
      return uriPath.slice(1);
    }
    return uriPath;
  }
  throw new Error('Could not convert URI to path: ' + uriString);
}

function isLocalFileUri(uri) {
  return uri.protocol === 'file:' && (!uri.host || uri.host === 'localhost');
}

function isRelativeUri(uriString, uri) {
  // Check if original string had no protocol (relative URI)
  return !uriString.includes('://') && uri.protocol === 'file:';
}
