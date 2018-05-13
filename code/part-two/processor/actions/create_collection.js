'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const getAddress = require('../services/addressing');
const { NEW_MOJI_COUNT, DNA_LENGTH, GENE_SIZE } = require('../services/constants');
const { hash, encode, getPrng } = require('../services/helpers');


// A quick convenience function to throw an error with a joined message
const reject = (...msgs) => { throw new InvalidTransaction(msgs.join(' ')); };

const emptyArray = size => Array.apply(null, Array(size));

const makeDna = prng => {
  return emptyArray(DNA_LENGTH).map(() => {
    const randomHex = prng(GENE_SIZE).toString(16);
    return ('0000' + randomHex).slice(-4);
  }).join('');
};

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

const createCollection = (context, publicKey, signature) => {
  const address = getAddress.collection(publicKey);
  const prng = getPrng(signature);

  return context.getState([ address ])
    .then(state => {
      if (state[address].length > 0) {
        reject('Collection already exists with key:', publicKey);
      }

      const updates = {};
      const mojiAddresses = [];
      const moji = makeMoji(publicKey, prng);
      const getMojiAddress = getAddress.moji(publicKey);

      moji.forEach(moji => {
        const address = getMojiAddress(moji.dna);
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
