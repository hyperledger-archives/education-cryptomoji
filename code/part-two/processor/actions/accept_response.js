'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const {
  getCollectionAddress,
  getMojiAddress
} = require('../services/addressing');
const { decode, encode } = require('../services/encoding');


// A quick convenience function to throw an error with a joined message
const reject = (...msgs) => { throw new InvalidTransaction(msgs.join(' ')); };

// Removes some moji from an encoded collection and adds others
const swapMoji = (ownerBytes, toRemove, toAdd) => {
  const owner = decode(ownerBytes);
  owner.moji = owner.moji
    .filter(moji => !toRemove.includes(moji))
    .concat(toAdd)
    .sort();
  return encode(owner);
};

// Creates an update object assigning existing moji to a new owner
const getMojiUpdate = (state, moji, newOwner) => {
  return moji.reduce((updates, address) => {
    const dna = decode(state[address]).dna;
    const newAddress = getMojiAddress(newOwner, dna);
    updates[newAddress] = state[address];
    return updates;
  }, {});
};

/**
 * Accepts a particular response on an offer, swapping the moji to new owners.
 */
const acceptResponse = (context, publicKey, { offer, response }) => {
  if (!offer) {
    reject('No offer address specified');
  }

  if (!response && response !== 0) {
    reject('No response index specified');
  }

  let state = null;
  let owner = null;
  let responder = null;
  let ownerMoji = null;
  let responderMoji = null;

  return context.getState([ offer ])
    .then(newState => {
      state = newState;

      if (state[offer].length === 0) {
        reject('Specified offer does not exist:', offer);
      }

      const decodedOffer = decode(state[offer]);
      const decodedResponse = decodedOffer.responses[response];

      if (!decodedResponse) {
        reject('There is no response at the index specified:', response);
      }

      if (publicKey !== decodedResponse.approver) {
        reject('Signer is not approver for this response:', publicKey);
      }

      owner = getCollectionAddress(decodedOffer.owner);
      ownerMoji = decodedOffer.moji;
      responderMoji = decodedResponse.moji;

      return context.getState(ownerMoji.concat(responderMoji));
    })
    .then(newState => {
      state = Object.assign(state, newState);

      for (let moji of responderMoji) {
        if (state[moji].length === 0) {
          reject('Response is no longer valid, moji has moved:', moji);
        }
      }

      const decodedMoji = decode(state[responderMoji[0]]);
      responder = getCollectionAddress(decodedMoji.owner);

      return context.getState([ owner, responder ]);
    })
    .then(newState => {
      state = Object.assign(state, newState);

      const ownerUpdate = getMojiUpdate(state, responderMoji, owner);
      const responderUpdate = getMojiUpdate(state, ownerMoji, responder);
      const newOwnerMoji = Object.keys(ownerUpdate);
      const newResponderMoji = Object.keys(responderUpdate);

      const updates = Object.assign(ownerUpdate, responderUpdate);
      updates[owner] = swapMoji(state[owner], ownerMoji, newOwnerMoji);
      updates[responder] = swapMoji(
        state[responder],
        responderMoji,
        newResponderMoji
      );

      return context.setState(updates);
    })
    .then(() => {
      const deleteKeys = ownerMoji.concat(responderMoji).concat(offer);
      return context.deleteState(deleteKeys);
    });
};

module.exports = acceptResponse;
