import {
  Transaction,
  TransactionHeader,
  Batch,
  BatchHeader,
  BatchList
} from 'sawtooth-sdk/protobuf';
import { createHash } from 'crypto';
import { getPublicKey, sign } from './signing.js';
import { encode } from './encoding.js';


const FAMILY_NAME = 'cryptomoji';
const FAMILY_VERSION = '0.1';
const NAMESPACE = '5f4d76';

// Takes a string and returns a hex-string SHA-512 hash
const hash = str => createHash('sha512').update(str).digest('hex');

// Returns a random 1-12 character string
const getNonce = () => (Math.random() * 10 ** 18).toString(36);

/**
 * A function that takes a private key and a payload and returns a new
 * signed Transaction instance.
 *
 * Hint:
 *   Remember ProtobufJS has two different APIs for encoding protobufs
 *   (which you'll use for the TransactionHeader) and for creating
 *   protobuf instances (which you'll use for the Transaction itself):
 *     - TransactionHeader.encode({ ... }).finish()
 *     - Transaction.create({ ... })
 *
 *   Also, don't forget to encode your payload!
 */
export const createTransaction = (privateKey, payload) => {
  const publicKey = getPublicKey(privateKey);
  const encodedPayload = encode(payload);

  const header = TransactionHeader.encode({
    signerPublicKey: publicKey,
    batcherPublicKey: publicKey,
    familyName: FAMILY_NAME,
    familyVersion: FAMILY_VERSION,
    inputs: [ NAMESPACE ],
    outputs: [ NAMESPACE ],
    nonce: getNonce(),
    payloadSha512: hash(encodedPayload)
  }).finish();

  return Transaction.create({
    header,
    headerSignature: sign(privateKey, header),
    payload: encodedPayload
  });
};

/**
 * A function that takes a private key and one or more Transaction instances
 * and returns a signed Batch instance.
 *
 * Should accept both multiple transactions in an array, or just one
 * with no array.
 */
export const createBatch = (privateKey, transactions) => {
  const publicKey = getPublicKey(privateKey);
  if (!Array.isArray(transactions)) {
    transactions = [ transactions ];
  }

  const header = BatchHeader.encode({
    signerPublicKey: publicKey,
    transactionIds: transactions.map(t => t.headerSignature)
  }).finish();

  return Batch.create({
    header,
    headerSignature: sign(privateKey, header),
    transactions
  });
};

/**
 * A fairly simple function that takes a one or more Batch instances and
 * returns an encoded BatchList.
 *
 * Although it's simple, axios has a bug when POSTing the generated Buffer,
 * so we've implemented it for you.
 */
export const encodeBatch = batch => {
  return BatchList.encode({ batches: [batch] }).finish();
};

/**
 * A function that takes a private key and one or more payloads and returns
 * an encoded BatchList for submission. The Transactions for each payload
 * will be wrapped in a single Batch in a BatchList.
 *
 * As with the other methods, it should handle both a single payload, or
 * multiple payloads in an array.
 */
export const encodeAll = (privateKey, payloads) => {
  if (!Array.isArray(payloads)) {
    payloads = [ payloads ];
  }

  const transactions = payloads.map(p => createTransaction(privateKey, p));
  const batch = createBatch(privateKey, transactions);

  return encodeBatch(batch);
};
