import axios from 'axios';
import {
  Transaction,
  TransactionHeader,
  Batch,
  BatchHeader,
  BatchList
} from 'sawtooth-sdk/protobuf';

import { hash } from '../utils/helpers';
import { FAMILY_NAME, FAMILY_VERSION, NAMESPACE } from '../utils/constants';
import { getPublicKey, sign } from './signing.js';
import { encode } from './encoding.js';


// Returns a random 1-12 character string
const getNonce = () => (Math.random() * 10 ** 18).toString(36);

// Recursively fetches all of the keys in nested objects
const listKeys = obj => {
  if (!obj || typeof obj !== 'object') {
    return [];
  }

  if (Array.isArray(obj)) {
    return obj.reduce((keys, item) => {
      return keys.concat(listKeys(item));
    }, []);
  }

  const topKeys = Object.keys(obj);
  const nestedKeys = topKeys.reduce((keys, key) => {
    return keys.concat(listKeys(obj[key]));
  }, []);
  return topKeys.concat(nestedKeys);
};

// Encode payload as a sorted JSON buffer
const encodePayload = payload => {
  const sortedKeys = listKeys(payload).sort();
  return Buffer.from(JSON.stringify(payload, sortedKeys));
};

// Returns a function to create new Transactions
const getTxnCreator = (privateKey, publicKey) => encodedPayload => {
  const header = TransactionHeader.encode({
    signerPublicKey: publicKey,
    batcherPublicKey: publicKey,
    familyName: FAMILY_NAME,
    familyVersion: FAMILY_VERSION,
    inputs: [NAMESPACE],
    outputs: [NAMESPACE],
    nonce: getNonce(),
    payloadSha512: hash(encodedPayload)
  }).finish();

  return Transaction.create({
    header,
    payload: encodedPayload,
    headerSignature: sign(privateKey, header)
  });
};

// Returns a function to create batches
const getBatchCreator = (privateKey, publicKey) => txns => {
  const header = BatchHeader.encode({
    signerPublicKey: publicKey,
    transactionIds: txns.map(txn => txn.headerSignature)
  }).finish();

  return Batch.create({
    header,
    headerSignature: sign(privateKey, header),
    transactions: txns
  });
};

// Encode a Batch in a BatchList
const encodeBatch = batch => {
  return BatchList.encode({ batches: [batch] }).finish();
};

// Submits an encoded BatchList to the API
const submitBatchList = (batchList, shouldWait) => {
  return axios({
    method: 'POST',
    url: 'api/batches',
    data: batchList,
    headers: { 'Content-Type': 'application/octet-stream' }
  }).then(({ data }) => {
    if (!shouldWait) {
      // There is nothing particularly interesting to return from the REST API
      return true;
    }

    return axios.get(data.link + '&wait').then(({ data }) => {
      const failed = data.data.find(({ status }) => status !== 'COMMITTED');
      if (failed) {
        const id = failed.id;
        const status = failed.status;
        const msg = failed.invalid_transactions[0].message;
        throw new Error(`Batch "${id}" is ${status}, with message: ${msg}`);
      }

      return true;
    });
  });
};

/**
 * Takes a private key and returns a submit function which can be used
 * to submit transactions signed by this private key.
 *
 * The submit function takes a payload object or array of payload objects,
 * and an optional wait boolean. If set to false, the promise will resolve
 * as soon as the POST request does. If true (the default), it will wait
 * to resolve until the transaction is committed to the blockchain.
 */
export const getSubmitter = privateKey => {
  const publicKey = getPublicKey(privateKey);
  const createTxn = getTxnCreator(privateKey, publicKey);
  const createBatch = getBatchCreator(privateKey, publicKey);

  return (payloads, shouldWait = true) => {
    if (!Array.isArray(payloads)) {
      payloads = [payloads];
    }

    const txns = payloads
      .map(encodePayload)
      .map(createTxn);
    const batch = createBatch(txns);
    const batchList = encodeBatch(batch);

    return submitBatchList(batchList, shouldWait);
  };
};
