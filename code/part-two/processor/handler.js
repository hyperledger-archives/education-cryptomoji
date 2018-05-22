'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const { decode } = require('./services/encoding');
// START SOLUTION

const createCollection = require('./actions/create_collection');
const selectSire = require('./actions/select_sire');
const breedMoji = require('./actions/breed_moji');
const createOffer = require('./actions/create_offer');
const cancelOffer = require('./actions/cancel_offer');
const addResponse = require('./actions/add_response');
const acceptResponse = require('./actions/accept_response');
// END SOLUTION


const FAMILY_NAME = 'cryptomoji';
const FAMILY_VERSION = '0.1';
const NAMESPACE = '5f4d76';

/**
 * A Cryptomoji specific version of the Sawtooth SDK's Transaction Handler.
 */
class MojiHandler extends TransactionHandler {
  /**
   * The constructor for a TransactionHandler simply registers it with the
   * validator, declaring which family name, versions, and namespaces it
   * expects to handle. We'll fill this one in for you.
   */
  constructor () {
    console.log('Initializing cryptomoji handler with namespace:', NAMESPACE);
    super(FAMILY_NAME, [ FAMILY_VERSION ], [ NAMESPACE ]);
  }

  /**
   * The apply method is where the vast majority of all the work a transaction
   * processor does happens. It will be called for every transaction with two
   * objects, a transaction request and a state context.
   *
   * Properties of `txn`:
   *   - txn.payload: the encoded payload sent from your client
   *   - txn.header: the decoded TransactionHeader for this transaction
   *   - txn.signature: the hex signature of the header
   *
   * Methods of `context`:
   *   - context.getState(addresses): takes an array of addresses and returns
   *     a Promise which will resolve with the requested state. The state
   *     object will have keys which are addresses, and values that are encoded
   *     state resources.
   *   - context.setState(updates): takes an update object and returns a
   *     Promise which will resolve with an array of the successfully
   *     updated addresses. The updates object should have keys which are
   *     addresses, and values which are encoded state resources.
   *   - context.deleteState(addresses): deletes the state for the passed
   *     array of state addresses. Only needed if attempting the extra credit.
   */
  apply (txn, context) {
    /* START PROBLEM
    // Enter your solution here
    // (start by decoding your payload and checking which action it has)

    END PROBLEM */
    // START SOLUTION
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
    // END SOLUTION
  }
}

module.exports = MojiHandler;
