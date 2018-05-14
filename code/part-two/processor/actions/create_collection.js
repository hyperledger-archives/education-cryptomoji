'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const {
  getCollectionAddress,
  getMojiAddress
} = require('../services/addressing');
const { encode } = require('../services/encoding');
const getPrng = require('../services/prng');


const NEW_MOJI_COUNT = 3;
const DNA_LENGTH = 9;
const GENE_SIZE = 2 ** (2 * 8);

// A quick convenience function to throw an error with a joined message
const reject = (...msgs) => { throw new InvalidTransaction(msgs.join(' ')); };

// Creates an empty array of a certain size
const emptyArray = size => Array.apply(null, Array(size));

// Uses a PRNG function to generate a pseudo-random dna string
const makeDna = prng => {
  return emptyArray(DNA_LENGTH).map(() => {
    const randomHex = prng(GENE_SIZE).toString(16);
    return ('0000' + randomHex).slice(-4);
  }).join('');
};

// Creates an array of new moji objects from a public key and a PRNG
const makeMoji = (publicKey, prng) => {
  return emptyArray(NEW_MOJI_COUNT).map(() => ({
    dna: makeDna(prng),
    owner: publicKey,
    sire: null,
    breeder: null,
    sired: [],
    bred: []
  }));
};

/**
 * Creates a new collection with a set of new moji.
 */
const createCollection = (context, publicKey, signature) => {
  const address = getCollectionAddress(publicKey);
  const prng = getPrng(signature);

  return context.getState([ address ])
    .then(state => {
      if (state[address].length > 0) {
        reject('Collection already exists with key:', publicKey);
      }

      const updates = {};
      const mojiAddresses = [];
      const moji = makeMoji(publicKey, prng);

      moji.forEach(moji => {
        const address = getMojiAddress(publicKey, moji.dna);
        updates[address] = encode(moji);
        mojiAddresses.push(address);
      });

      updates[address] = encode({
        key: publicKey,
        moji: mojiAddresses.sort()
      });

      return context.setState(updates);
    });
};

module.exports = createCollection;
