'use strict';

const getAddress = require('../services/addressing');
const { decode, encode, reject } = require('../services/helpers');


const cancelOffer = (context, publicKey, { offer }) => {
  if (!offer) {
    return reject('No offer specified');
  }
  if (!getAddress.isValid(offer)) {
    return reject('Offer address must be a 70-char hex string:', offer);
  }

  const owner = getAddress.collection(publicKey);

  return context.getState([ owner, offer ])
    .then(state => {
      if (state[owner].length === 0) {
        return reject('Signer must have a collection:', publicKey);
      }

      if (state[offer].length === 0) {
        return reject('Specified offer does not exist:', offer);
      }

      if (decode(state[offer]).owner !== publicKey) {
        return reject('Specified offer not owned by signer:', offer);
      }

      return context.deleteState([offer]);
    });
};

module.exports = cancelOffer;
