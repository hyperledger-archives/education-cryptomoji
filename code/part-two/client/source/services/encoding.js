// Maps over an array with the provided iterator function,
// concatenating the resulting arrays
const concatMap = (array, iterator) => {
  return array.reduce((mapped, item) => {
    return mapped.concat(iterator(item));
  }, [])
};

// Recursively fetches all of the keys in nested objects
const listKeys = obj => {
  if (!obj || typeof obj !== 'object') {
    return [];
  }

  if (Array.isArray(obj)) {
    return concatMap(obj, item => listKeys(item));
  }

  const topKeys = Object.keys(obj);
  const nestedKeys = concatMap(topKeys, key => listKeys(obj[key]));
  return topKeys.concat(nestedKeys);
};

/**
 * Takes an object and encodes it as a Buffer made from a sorted JSON string.
 */
export const encode = obj => {
  const sortedKeys = listKeys(obj).sort();
  return Buffer.from(JSON.stringify(obj, sortedKeys));
};

/**
 * Takes a base64 encoded Buffer, and decodes it back into an object
 */
export const decode = base64Str => {
  return JSON.parse(Buffer.from(base64Str, 'base64').toString());
};
