// A parseDna function to display cryptomoji
'use strict';

// An object with a listing of parts, including a count of their appearances.
// Follows this format:
// {
//   mouths: {
//     <part>: {
//       count: <number>,
//       tags: [ <tags> ]
//     },
//     ...
//   },
//   eyes: { ... },
//   ...
// }
import definitions from './part_definitions.json';


const DNA_BITS = 2 * 8;
const MAX_WHITESPACE = 4;
const HEX_COUNT = DNA_BITS / 4;
const DNA_SIZE = 2 ** DNA_BITS;

const GENE_TYPES = [
  'mouths',
  'WHITESPACE',
  'eyes',
  'insides',
  'WHITESPACE',
  'sides',
  'arms',
  'outsides',
  'WHITESPACE'
];

// Creates an empty array of a given length
const emptyArray = length => {
  return Array.apply(null, Array(length));
};

// A shallow non-recursive flatten to use with reduce
const flatten = (flattened, itemOrArray) => {
  return flattened.concat(itemOrArray);
};

// Transform the part definitions into arrays of tuples, where each part
// gets one entry per appearance. The first index of the tuple is the part,
// the second is the tags associated with the part.
//
// The final object will follow this format:
//   {
//     mouths: [[<part>, [<tags>]], [<part>, [<tags>]]],
//     eyes: [ ... ],
//     ...
//   }
const PARTS = Object.keys(definitions).reduce((parts, type) => {
  parts[type] = Object.keys(definitions[type]).map(part => {
    const { count, tags } = definitions[type][part];
    return emptyArray(count).map(() => [part, tags]);
  }).reduce(flatten, []);

    return parts;
}, {});

/**
 * Takes a hexadecimal DNA string and parses it into an object
 * with two keys:
 *   - view: a string, the actual characters of the moji to display
 *   - tags: an array of strings, tags associated with this moji
 */
export default const parseDna = dna => {
  throw new Error('Method not implemented: parseDna');
};
