'use strict';

// Maps over an array with an iterator, concatenating the resulting arrays
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

// Encodes an object as a Buffer of sorted JSON string
const encode = obj => {
  const jsonString = JSON.stringify(obj, listKeys(obj).sort());
  return Buffer.from(jsonString);
};

// Decodes JSON Buffers back into objects
const decode = encoded => JSON.parse(encoded.toString());

module.exports = {
  encode,
  decode
};
