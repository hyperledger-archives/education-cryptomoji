'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const {
  getCollectionAddress,
  getSireAddress,
  isValidAddress
} = require('../services/addressing');
const { decode, encode } = require('../services/encoding');


// A quick convenience function to throw an error with a joined message
const reject = (...msgs) => { throw new InvalidTransaction(msgs.join(' ')); };

/**
 * Selects a moji as a sire for a particular collection.
 */
const selectSire = (context, publicKey, { sire }) => {
  if (!sire) {
    reject('No sire specified');
  }
  if (!isValidAddress(sire)) {
    reject('Invalid sire listing address:', sire);
  }

  const owner = getCollectionAddress(publicKey);
  return context.getState([ owner, sire ])
    .then(state => {
      if (state[owner].length === 0) {
        reject('Signer must have a collection:', publicKey);
      }

      if (state[sire].length === 0) {
        reject('Selected sire does not exist:', sire);
      }

      if (decode(state[sire]).owner !== publicKey) {
        reject('Selected sire is not owned by signer:', publicKey);
      }

      const update = {};
      update[getSireAddress(publicKey)] = encode({
        sire,
        owner: publicKey
      });

      return context.setState(update);
    });
};

module.exports = selectSire;
