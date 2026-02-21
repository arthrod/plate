import promises from '../lib/promises';
import * as zipfile from '../lib/zipfile';

type OpenZipOptions = {
  arrayBuffer?: ArrayBuffer;
};

export function openZip(options: OpenZipOptions) {
  if (options.arrayBuffer) {
    return promises.resolve(zipfile.openArrayBuffer(options.arrayBuffer));
  }

  return promises.reject(new Error('Could not find file in options'));
}
