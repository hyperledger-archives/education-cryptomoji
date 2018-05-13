// Imports a JSON object with a listing of parts,
// including a count of their appearances.
//
// The definitions object this format:
// {
//   mouths: {
//     <part string>: {
//       count: <number>,
//       tags: [ <tag stings> ]
//     },
//
//     ...
//   },
//
//   eyes: { ... },
//
//   ...
// }
import definitions from './part_definitions.json';


const DNA_BITS = 2 * 8;
const GENE_SIZE = 2 ** DNA_BITS;
const HEX_COUNT = DNA_BITS / 4;
const MAX_WHITESPACE = 4;
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

// A predicate function for use with filter
const unique = (item, i, items) => {
  return !items.slice(0, i).includes(item);
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

// Converts a hexadecimal string into an array of integers
const hexToInts = hexString => {
  return hexString
    .match(RegExp(`[0-9a-f]{${HEX_COUNT},${HEX_COUNT}}`, 'g'))
    .map(hex => parseInt(hex, 16));
};

// Converts an integer into an array of booleans
const intToSpacingGuide = (spacingInt) => {
  const bits = spacingInt.toString(2);

  return ('0'.repeat(DNA_BITS) + bits).slice(-DNA_BITS)
    .split('')
    .map(bit => !Number(bit))
    .map((space, i, spaces) => {
      const tooManySpaces = i >= MAX_WHITESPACE
        && spaces.slice(i - MAX_WHITESPACE, i).every(s => s);
      return tooManySpaces
        ? [ false, space ]
        : space;
    })
    .reduce(flatten, []);
};

// Convert an array of integers to part tuples
const intsToParts = ints => {
  return ints.map((int, i) => {
    const type = GENE_TYPES[i];
    if (type === 'WHITESPACE') {
      return [ intToSpacingGuide(int), [] ];
    }

    const index = Math.floor(int * (PARTS[type].length / GENE_SIZE));
    return PARTS[type][index];
  });
};

// Pad the characters of a part with whitespace
const spacePart = (partChars, spacingGuide) => {
  const chars = partChars.split('').reverse();
  let spacedPart = '';

  for (let i = 0; true; i++) {
    if (i >= spacingGuide.length) {
      i = 0;
    }

    if (spacingGuide[i]) {
      spacedPart += ' ';
    } else {
      const char = chars.pop();

      if (!char) {
        return spacedPart;
      }

      spacedPart += char;
    }
  }
};

// A function to be used with map, which spaces out parts
const spaceParts = (part, i, parts) => {
  if (Array.isArray(parts[i])) {
    return null;
  }

  if (Array.isArray(parts[i + 1])) {
    return spacePart(part, parts[i + 1]);
  }

  return part;
};

// Combines an array of parts into a single kaomoji string
const combineParts = parts => {
  const armsIndex = GENE_TYPES
    .filter(type => type !== 'WHITESPACE')
    .findIndex(type => type === 'arms');


  const combined = parts.reduce((combined, part, i) => {
    if (i !== armsIndex) {
      return part.replace('%', combined);
    }

    const isOffRight = part.length === 3
      && part[0] === '%'
      && part[1] === part[2];
    if (isOffRight) {
      return combined[0] + part[1] + combined.slice(1) + part[2];
    }

    const isOffLeft = part.length === 3 &&
      part[2] === '%' &&
      part[0] === part[1];

    if (isOffLeft) {
      return part[0] + combined.slice(0, -1) + part[1] + combined.slice(-1);
    }

    return part.replace('%', combined);
  });

  return combined.trim();
};

/**
 * Takes a 36 character hexadecimal DNA string and returns an object
 * with two keys:
 *   - view: a string, the actual characters of the moji to display
 *   - tags: an array of strings, tags associated with this moji
 *
 * Example:
 *   const moji = parseDna('ad41bd46798e8fc24aa33c29b564ba3a644e');
 *   console.log(moji.view)  // '٩( * ᵒ⌄ ᵒ ꐐ * )۶'
 *   console.log(moji.tags)  // [ 'happy', 'bear', 'sad' ]
 */
export const parseDna = dna => {
  const dnaArray = hexToInts(dna);
  const partsAndTags = intsToParts(dnaArray);

  const parts = partsAndTags
    .map(([ part, _ ]) => part)
    .map(spaceParts)
    .filter(part => part !== null);

  const tags = partsAndTags
    .map(([ _, tags ]) => tags)
    .reduce(flatten, [])
    .filter(unique);

  return {
    tags,
    view: combineParts(parts)
  };
};
