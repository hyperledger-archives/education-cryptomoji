'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const getAddress = require('../services/addressing');
const { decode, encode } = require('../services/helpers');


// A quick convenience function to throw an error with a joined message
const reject = (...msgs) => { throw new InvalidTransaction(msgs.join(' ')); };


const selectSire = (context, publicKey, { sire }) => {
  if (!sire) {
    reject('No sire specified');
  }
  if (!getAddress.isValid(sire)) {
    reject('Sire address must be a 70-char hex string:', sire);
  }

  const owner = getAddress.collection(publicKey);
  return context.getState([ owner, sire ])
    .then(state => {
      if (state[owner].length === 0) {
        reject('Signer must have a collection:', publicKey);
      }

      if (state[sire].length === 0) {
        reject('Selected sire does not exist:', sire);
      }

      if (decode(state[sire]).owner !== publicKey) {
        reject('Selected sire is not owned by signer:', publicKey);
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
