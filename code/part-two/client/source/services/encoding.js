// Maps over an array with the provided iterator function,
// concatenating the resulting arrays
const concatMap = (array, iterator) => {
  return array.reduce((mapped, item) => {
    return mapped.concat(iterator(item));
  }, [])
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
export const encode = object => {
  const sortedKeys = listKeys(object).sort();
  return Buffer.from(JSON.stringify(object, sortedKeys));
};

/**
 * A function that takes a base64 string and decodes it into an object.
 *
 * Hint:
 *   Although you encoded it as a Buffer originally, the REST API will send
 *   any binary data as a base64 string. So you will need to go from
 *   base64 string -> Buffer -> JSON string -> object
 */
export const decode = base64Str => {
  return JSON.parse(Buffer.from(base64Str, 'base64').toString());
};
