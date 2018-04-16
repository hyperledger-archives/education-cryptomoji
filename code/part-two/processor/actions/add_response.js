'use strict';

const getAddress = require('../utils/addressing');
const { decode, encode, reject } = require('../utils/helpers');


const addResponse = (context, publicKey, { moji, offer }) => {
  if (!moji || moji.length === 0) {
    return reject('No moji specified');
  }

  if (!offer) {
    return reject('No offer specified');
  }

  const signer = getAddress.collection(publicKey);

  return context.getState(moji.concat(signer, offer))
    .then(state => {
      if (state[signer].length === 0) {
        return reject('Signer does not have a collection:', publicKey);
      }

      if (state[offer].length === 0) {
        return reject('Specified offer does not exist:', offer);
      }

      for (let mojiAddress of moji) {
        if (state[mojiAddress].length === 0) {
          return reject('Specified moji does not exist:', mojiAddress);
        }
      }

      moji = moji.sort();
      const decodedOffer = decode(state[offer]);

      for (let response of decodedOffer.responses) {
        const responseExists = response.moji.length === moji.length
          && response.moji.every((m, i) => m === moji[i]);

        if (responseExists) {
          return reject('A response already exists for moji:', moji.join(', '));
        }
      }

      const signerIsOwner = publicKey === decodedOffer.owner;
      const decodedMoji = moji.map(address => {
        return Object.assign({ address }, decode(state[address]));
      });

      if (decodedOffer.owner === decodedMoji[0].owner) {
        const message = 'Response moji and offer have same owner:';
        return reject(message, decodedOffer.owner);
      }

      const approver = signerIsOwner
        ? decodedMoji[0].owner
        : decodedOffer.owner;

      for (let moji of decodedMoji) {
        if (signerIsOwner && moji.owner !== approver) {
          return reject('Moji must share owner with others:', moji.address);
        }

        if (!signerIsOwner && moji.owner !== publicKey) {
          return reject('Signer must own specified moji:', moji.address);
        }
      }

      const listing = getAddress.sireListing(decodedMoji[0].owner);

      return context.getState([ listing ])
        .then(state => {

          if (state[listing].length !== 0) {
            const sire = decode(state[listing]).sire;

            for (let offered of moji) {
              if (offered === sire) {
                return reject('Specified moji listed as a sire:', offered);
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
