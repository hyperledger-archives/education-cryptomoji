'use strict';

const { createHash } = require('crypto');
const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { FAMILY_NAME, FAMILY_VERSION, NAMESPACE } = require('./utils/constants');
const { decode, reject } = require('./utils/helpers');

const createCollection = require('./actions/create_collection');
const selectSire = require('./actions/select_sire');
const breedMoji = require('./actions/breed_moji');
const createOffer = require('./actions/create_offer');


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
      return reject('Failed to decode payload:', err);
    }

    const action = payload.action;
    const publicKey = txn.header.signerPublicKey;

    if (action === 'CREATE_COLLECTION') {
      return createCollection(context, publicKey, txn.signature);
    } else if (action === 'SELECT_SIRE') {
      return selectSire(context, publicKey, payload);
    } else if (action === 'BREED_MOJI') {
      return breedMoji(context, publicKey, payload, txn.signature);
    } else if (action === 'CREATE_OFFER') {
      return createOffer(context, publicKey, payload);
    } else {
      return reject('Unknown action:', action);
    }
  }
}

module.exports = MojiHandler;
