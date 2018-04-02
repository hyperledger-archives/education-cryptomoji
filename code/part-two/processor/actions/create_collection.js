'use strict';

const getAddress = require('../utils/addressing');
const { hash, encode, reject } = require('../utils/helpers');


const createCollection = (context, publicKey) => {
  const address = getAddress.collection(publicKey);

  return context.getState([ address ])
    .then(state => {
      if (state[address].length > 0) {
        return reject('Collection already exists with key: ' + publicKey);
      }

      const update = {};
      update[address] = encode({
        key: publicKey,
        moji: []
      });

      return context.setState(update);
    });
};

module.exports = createCollection;
