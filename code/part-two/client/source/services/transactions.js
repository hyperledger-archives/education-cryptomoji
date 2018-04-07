// Functions for creating private keys and submitting transactions
'use strict';

import { createHash } from 'crypto';
import secp256k1 from 'sawtooth-sdk/signing/secp256k1';


const hash = str => createHash('sha512').update(str).digest('hex');

const FAMILY_NAME = 'cryptomoji';
const FAMILY_VERSION = '1.0';
const NAMESPACE = hash(FAMILY_NAME).slice(0, 6);
const CONTEXT = new secp256k1.Secp256k1Context();

/**
 * Creates a new public/private key pair, and returns them as an object
 * with the keys "public", and "private".
 */
export const createKeys = () => {
  const privateWrapper = CONTEXT.newRandomPrivateKey();
  const privateKey = privateWrapper.asHex();
  const publicKey = CONTEXT.getPublicKey(privateWrapper).asHex();

  return { privateKey, publicKey };
};

/**
 * Takes a private key and returns its public pair.
 */
export const getPublicKey = privateKey => {
  const privateWrapper = secp256k1.Secp256k1PrivateKey.fromHex(privateKey);
  return CONTEXT.getPublicKey(privateWrapper).asHex();
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
  throw new Error('Method not implemented: getSubmitter');
};
