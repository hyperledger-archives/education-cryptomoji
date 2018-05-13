'use strict';

const getAddress = require('../services/addressing');
const { decode, encode, reject } = require('../services/helpers');


const createOffer = (context, publicKey, { moji }) => {
  if (!moji || moji.length === 0) {
    return reject('No moji specified');
  }

  for (let mojiAddress of moji) {
    if (!getAddress.isValid(mojiAddress)) {
      return reject('Moji address must be a 70-char hex string:', mojiAddress);
    }
  }

  moji = moji.sort();
  const owner = getAddress.collection(publicKey);
  const offer = getAddress.offer(publicKey)(moji);
  const listing = getAddress.sireListing(publicKey);

  return context.getState(moji.concat(owner, offer, listing))
    .then(state => {
      if (state[offer].length !== 0) {
        return reject('An offer for these moji already exists:', offer);
      }

      if (state[owner].length === 0) {
        return reject('Signer must have a collection:', publicKey);
      }

      const sire = state[listing].length !== 0
        ? decode(state[listing]).sire
        : null;

      for (let mojiAddress of moji) {
        if (state[mojiAddress].length === 0) {
          return reject('Specified moji does not exist:', mojiAddress);
        }

        if (decode(state[mojiAddress]).owner !== publicKey) {
          return reject('Specified moji not owned by signer:', mojiAddress);
        }

        if (sire && mojiAddress === sire) {
          return reject('Specified moji listed as a sire:', mojiAddress);
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
