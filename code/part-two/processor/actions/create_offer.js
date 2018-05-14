'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const {
  getCollectionAddress,
  getSireAddress,
  getOfferAddress,
  isValidAddress
} = require('../services/addressing');
const { decode, encode } = require('../services/encoding');


// A quick convenience function to throw an error with a joined message
const reject = (...msgs) => { throw new InvalidTransaction(msgs.join(' ')); };

/**
 * Creates a new offer in state for a set of moji.
 */
const createOffer = (context, publicKey, { moji }) => {
  if (!moji || moji.length === 0) {
    reject('No moji specified');
  }

  for (let mojiAddress of moji) {
    if (!isValidAddress(mojiAddress)) {
      reject('Invalid moji address:', mojiAddress);
    }
  }

  moji = moji.sort();
  const owner = getCollectionAddress(publicKey);
  const listing = getSireAddress(publicKey);
  const offer = getOfferAddress(publicKey, moji);

  return context.getState(moji.concat(owner, offer, listing))
    .then(state => {
      if (state[offer].length !== 0) {
        reject('An offer for these moji already exists:', offer);
      }

      if (state[owner].length === 0) {
        reject('Signer must have a collection:', publicKey);
      }

      const sire = state[listing].length !== 0
        ? decode(state[listing]).sire
        : null;

      for (let mojiAddress of moji) {
        if (state[mojiAddress].length === 0) {
          reject('Specified moji does not exist:', mojiAddress);
        }

        if (decode(state[mojiAddress]).owner !== publicKey) {
          reject('Specified moji not owned by signer:', mojiAddress);
        }

        if (sire && mojiAddress === sire) {
          reject('Specified moji listed as a sire:', mojiAddress);
        }
      }

      const update = {};
      update[offer] = encode({
        moji,
        owner: publicKey,
        responses: []
      });

      return context.setState(update);
    });
};

module.exports = createOffer;
