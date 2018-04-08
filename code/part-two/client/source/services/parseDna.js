// A parseDna function to display cryptomoji
'use strict';

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

/**
 * Takes a hexadecimal DNA string and parses it into an object
 * with two keys:
 *   - view: a string, the actual characters of the moji to display
 *   - tags: an array of strings, tags associated with this moji
 */
export default const parseDna = dna => {
  throw new Error('Method not implemented: parseDna');
};
