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
 * Adds a new response to an existing offer.
 */
const addResponse = (context, publicKey, { moji, offer }) => {
  if (!moji || moji.length === 0) {
    reject('No moji specified');
  }

  for (let mojiAddress of moji) {
    if (!isValidAddress(mojiAddress)) {
      reject('Invalid moji address:', mojiAddress);
    }
  }

  if (!offer) {
    reject('No offer specified');
  }
  if (!isValidAddress(offer)) {
    reject('Invalid offer address:', offer);
  }

  const signer = getCollectionAddress(publicKey);

  return context.getState(moji.concat(signer, offer))
    .then(state => {
      if (state[signer].length === 0) {
        reject('Signer does not have a collection:', publicKey);
      }

      if (state[offer].length === 0) {
        reject('Specified offer does not exist:', offer);
      }

      for (let mojiAddress of moji) {
        if (state[mojiAddress].length === 0) {
          reject('Specified moji does not exist:', mojiAddress);
        }
      }

      moji = moji.sort();
      const decodedOffer = decode(state[offer]);

      for (let response of decodedOffer.responses) {
        const responseExists = response.moji.length === moji.length
          && response.moji.every((m, i) => m === moji[i]);

        if (responseExists) {
          reject('A response already exists for moji:', moji.join(', '));
        }
      }

      const signerIsOwner = publicKey === decodedOffer.owner;
      const decodedMoji = moji.map(address => {
        return Object.assign({ address }, decode(state[address]));
      });

      if (decodedOffer.owner === decodedMoji[0].owner) {
        reject('Response moji and offer have same owner:', decodedOffer.owner);
      }

      const approver = signerIsOwner
        ? decodedMoji[0].owner
        : decodedOffer.owner;

      for (let moji of decodedMoji) {
        if (signerIsOwner && moji.owner !== approver) {
          reject('Moji must share owner with others:', moji.address);
        }

        if (!signerIsOwner && moji.owner !== publicKey) {
          reject('Signer must own specified moji:', moji.address);
        }
      }

      const listing = getSireAddress(decodedMoji[0].owner);

      return context.getState([ listing ])
        .then(state => {

          if (state[listing].length !== 0) {
            const sire = decode(state[listing]).sire;

            for (let offered of moji) {
              if (offered === sire) {
                reject('Specified moji listed as a sire:', offered);
              }
            }
          }

          const update = {};
          decodedOffer.responses.push({ approver, moji });
          update[offer] = encode(decodedOffer);

          return context.setState(update);
        });
    });
};

module.exports = addResponse;
