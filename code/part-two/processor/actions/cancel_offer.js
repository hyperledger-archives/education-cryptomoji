'use strict';

const getAddress = require('../utils/addressing');
const { decode, encode, reject } = require('../utils/helpers');


const cancelOffer = (context, publicKey, { offer }) => {
  if (!offer) {
    return reject('No offer specified');
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
