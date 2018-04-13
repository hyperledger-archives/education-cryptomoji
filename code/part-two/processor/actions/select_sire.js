'use strict';

const getAddress = require('../utils/addressing');
const { decode, encode, reject } = require('../utils/helpers');

const selectSire = (context, publicKey, { sire }) => {
  if (!sire) {
    return reject('No sire specified');
  }

  const owner = getAddress.collection(publicKey);
  return context.getState([ owner, sire ])
    .then(state => {
      if (state[owner].length === 0) {
        return reject('Signer must have a collection:', publicKey);
      }

      if (state[sire].length === 0) {
        return reject('Selected sire does not exist:', sire);
      }

      if (decode(state[sire]).owner !== publicKey) {
        return reject('Selected sire is not owned by signer:', publicKey);
      }

      const update = {};
      update[getAddress.sireListing(publicKey)] = encode({
        sire,
        owner: publicKey
      });

      return context.setState(update);
    });
};

module.exports = selectSire;
