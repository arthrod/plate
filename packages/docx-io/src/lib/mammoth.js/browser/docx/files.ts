import promises from '../../lib/promises';

export function Files() {
  function read(uri: string) {
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
