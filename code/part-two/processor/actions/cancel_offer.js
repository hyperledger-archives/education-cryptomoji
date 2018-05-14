'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const {
  getCollectionAddress,
  isValidAddress
} = require('../services/addressing');
const { decode, encode } = require('../services/encoding');


// A quick convenience function to throw an error with a joined message
const reject = (...msgs) => { throw new InvalidTransaction(msgs.join(' ')); };

/**
 * Cancels an existing offer, deleting it from state.
 */
const cancelOffer = (context, publicKey, { offer }) => {
  if (!offer) {
    reject('No offer specified');
  }
  if (!isValidAddress(offer)) {
    reject('Invalid offer address:', offer);
  }

  const owner = getCollectionAddress(publicKey);

  return context.getState([ owner, offer ])
    .then(state => {
      if (state[owner].length === 0) {
        reject('Signer must have a collection:', publicKey);
      }

      if (state[offer].length === 0) {
        reject('Specified offer does not exist:', offer);
      }

      if (decode(state[offer]).owner !== publicKey) {
        reject('Specified offer not owned by signer:', offer);
      }

      return context.deleteState([offer]);
    });
};

module.exports = cancelOffer;
