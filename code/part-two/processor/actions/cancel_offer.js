'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const getAddress = require('../services/addressing');
const { decode, encode } = require('../services/encoding');


// A quick convenience function to throw an error with a joined message
const reject = (...msgs) => { throw new InvalidTransaction(msgs.join(' ')); };

const cancelOffer = (context, publicKey, { offer }) => {
  if (!offer) {
    reject('No offer specified');
  }
  if (!getAddress.isValid(offer)) {
    reject('Offer address must be a 70-char hex string:', offer);
  }

  const owner = getAddress.collection(publicKey);

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
