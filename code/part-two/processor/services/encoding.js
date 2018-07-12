'use strict';

// Maps over an array with the provided iterator function,
// concatenating the resulting arrays
const concatMap = (array, iterator) => {
  return array.reduce((mapped, item) => {
    return mapped.concat(iterator(item));
  }, []);
};

// Recursively fetches all of the keys in nested objects
const listKeys = object => {
  if (!object || typeof object !== 'object') {
    return [];
  }

  if (Array.isArray(object)) {
    return concatMap(object, item => listKeys(item));
  }

  const topKeys = Object.keys(object);
  const nestedKeys = concatMap(topKeys, key => listKeys(object[key]));
  return topKeys.concat(nestedKeys);
};

/**
 * A function that takes an object and returns it encoded as JSON Buffer.
 * Should work identically to the client version. Feel free to copy and paste
 * any work you did there.
 *
 * Example:
 *   const encoded = encode({ hello: 'world', foo: 'bar' })
 *   console.log(encoded)  // <Buffer 7b 22 66 6f 6f 22 3a 22 62 61 72 22 ... >
 *   console.log(encoded.toString())  // '{"foo":"bar","hello":"world"}'
 *
 * Hint:
 *   Remember that all transactions and blocks must be generated
 *   deterministically! JSON is convenient, but you will need to sort
 *   your object's keys or random transactions may fail.
 */
const encode = object => {
  const sortedKeys = listKeys(object).sort();
  return Buffer.from(JSON.stringify(object, sortedKeys));
};

/**
 * A function that takes a JSON Buffer and decodes it into an object. Unlike
 * the client version, there is no need to handle base64 strings.
 */
const decode = buffer => {
  return JSON.parse(buffer.toString());
};

module.exports = {
  encode,
  decode
};
