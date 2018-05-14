'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const { FAMILY_NAME, FAMILY_VERSION, NAMESPACE } = require('./services/constants');
const { decode } = require('./services/encoding');

const createCollection = require('./actions/create_collection');
const selectSire = require('./actions/select_sire');
const breedMoji = require('./actions/breed_moji');
const createOffer = require('./actions/create_offer');
const cancelOffer = require('./actions/cancel_offer');
const addResponse = require('./actions/add_response');
const acceptResponse = require('./actions/accept_response');


class MojiHandler extends TransactionHandler {
  constructor () {
    console.log('Initializing cryptomoji handler with namespace:', NAMESPACE);
    super(FAMILY_NAME, [ FAMILY_VERSION ], [ NAMESPACE ]);
  }

  apply (txn, context) {
    // The Sawtooth SDK currently breaks if an error is thrown in this method,
    // including an InvalidTransaction. This will be fixed in version 1.0.5,
    // but for now, wrap everything in a try/catch and return rejected promise.
    // Not indenting to avoid a giant git diff later.
    try {

    let payload = null;
    try {
      payload = decode(txn.payload);
    } catch (err) {
      throw new InvalidTransaction('Failed to decode payload: ' + err);
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
    } else if (action === 'CANCEL_OFFER') {
      return cancelOffer(context, publicKey, payload);
    } else if (action === 'ADD_RESPONSE') {
      return addResponse(context, publicKey, payload);
    } else if (action === 'ACCEPT_RESPONSE') {
      return acceptResponse(context, publicKey, payload);
    } else {
      throw new InvalidTransaction('Unknown action: ' + action);
    }

    } catch (err) {
      return new Promise((_, reject) => reject(err))
    }
    // ^^^^^ End of workaround try/catch ^^^^^
  }
}

module.exports = MojiHandler;
