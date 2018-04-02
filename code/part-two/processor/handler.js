'use strict';

const { createHash } = require('crypto');
const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { FAMILY_NAME, FAMILY_VERSION, NAMESPACE } = require('./utils/constants');
const { decode, reject } = require('./utils/helpers');

const createCollection = require('./actions/create_collection');


class MojiHandler extends TransactionHandler {
  constructor () {
    console.log('Initializing cryptomoji handler with namespace:', NAMESPACE);
    super(FAMILY_NAME, [ FAMILY_VERSION ], [ NAMESPACE ]);
  }

  apply (txn, context) {
    let payload = null;
    try {
      payload = decode(txn.payload);
    } catch (err) {
      return reject('Failed to decode payload: ' + err);
    }

    const action = payload.action;
    const publicKey = txn.header.signerPublicKey;

    if (action === 'CREATE_COLLECTION') {
      return createCollection(context, publicKey, txn.signature);
    } else {
      return reject('Unknown action: ' + action);
    }
  }
}

module.exports = MojiHandler;
