'use strict';

const { createHash } = require('crypto');
const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { FAMILY_NAME, FAMILY_VERSION, NAMESPACE } = require('./utils/constants');


class MojiHandler extends TransactionHandler {
  constructor () {
    console.log('Initializing cryptomoji handler with namespace:', NAMESPACE);
    super(FAMILY_NAME, [ FAMILY_VERSION ], [ NAMESPACE ]);
  }

  apply (txn, context) {
    console.log('Received transaction with signature:', txn.headerSignature);
    return Promise.resolve();
  }
}

module.exports = MojiHandler;
