// lib/zipfile.ts:13
    function read(name, encoding) {
      var file = zipFile.file(name);
      if (file === null) {
        return Promise.reject(new Error('File not found in ZIP: ' + name));
      }
      return file.async('uint8array').then((array) => {
        if (encoding === 'base64') {
          return encodeBase64(array);
        }
        if (encoding) {
          var decoder = new TextDecoder(encoding);
          return decoder.decode(array);
        }
        return array;
      });
    }
