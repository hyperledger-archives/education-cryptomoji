'use strict';

const { createHash } = require('crypto');
const { TransactionHandler } = require('sawtooth-sdk/processor/handler');

const getAddress = (key, length) => {
  return createHash('sha512').update(key).digest('hex').slice(0, length);
};

const FAMILY = 'cryptomoji';
const NAMESPACE = getAddress(FAMILY, 6);

class MojiHandler extends TransactionHandler {
  constructor () {
    console.log('Initializing cryptomoji handler with namespace:', NAMESPACE);
    super(FAMILY, ['1.0'], [NAMESPACE]);
  }

  apply (txn, context) {
    console.log('Received transaction with signature:', txn.headerSignature);
    return Promise.resolve();
  }
}

module.exports = MojiHandler;
