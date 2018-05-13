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
 * Takes a private key and payload and returns a Transaction instance.
 */
export const createTransaction = (privateKey, payload) => {
  const publicKey = getPublicKey(privateKey);
  const encodedPayload = encode(payload);

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
    headerSignature: sign(privateKey, header),
    payload: encodedPayload
  });
};

/**
 * Takes a private key and one or more Transactions and
 * returns a Batch instance.
 */
export const createBatch = (privateKey, transactions) => {
  const publicKey = getPublicKey(privateKey);
  if (!Array.isArray(transactions)) {
    transactions = [transactions];
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
 * Takes a Batch and returns an encoded BatchList for submission.
 */
export const encodeBatch = batch => {
  return BatchList.encode({ batches: [batch] }).finish();
};

/**
 * Takes a private key and one or more payloads and
 * returns an encoded BatchList for submission.
 */
export const encodeAll = (privateKey, payloads) => {
  if (!Array.isArray(payloads)) {
    payloads = [payloads];
  }

  const transactions = payloads.map(p => createTransaction(privateKey, p));
  const batch = createBatch(privateKey, transactions);

  return encodeBatch(batch);
};
