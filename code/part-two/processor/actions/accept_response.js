'use strict';

const getAddress = require('../services/addressing');
const { decode, encode, reject } = require('../services/helpers');


const swapMoji = (ownerBytes, toRemove, toAdd) => {
  const owner = decode(ownerBytes);
  owner.moji = owner.moji
    .filter(moji => !toRemove.includes(moji))
    .concat(toAdd)
    .sort();
  return encode(owner);
};

const getMojiUpdate = (state, moji, newOwner) => {
  return moji.reduce((updates, address) => {
    const dna = decode(state[address]).dna;
    const newAddress = getAddress.moji(newOwner)(dna);
    updates[newAddress] = state[address];
    return updates;
  }, {});
};

const acceptResponse = (context, publicKey, { offer, response }) => {
  if (!offer) {
    return reject('No offer address specified');
  }

  if (!response && response !== 0) {
    return reject('No response index specified');
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
        return reject('Specified offer does not exist:', offer);
      }

      const decodedOffer = decode(state[offer]);
      const decodedResponse = decodedOffer.responses[response];

      if (!decodedResponse) {
        return reject('There is no response at the index specified:', response);
      }

      if (publicKey !== decodedResponse.approver) {
        return reject('Signer is not approver for this response:', publicKey);
      }

      owner = getAddress.collection(decodedOffer.owner);
      ownerMoji = decodedOffer.moji;
      responderMoji = decodedResponse.moji;

      return context.getState(ownerMoji.concat(responderMoji));
    })
    .then(newState => {
      state = Object.assign(state, newState);

      for (let moji of responderMoji) {
        if (state[moji].length === 0) {
          return reject('Response is no longer valid, moji has moved:', moji);
        }
      }

      const decodedMoji = decode(state[responderMoji[0]]);
      responder = getAddress.collection(decodedMoji.owner);

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
