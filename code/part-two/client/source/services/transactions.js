// Functions for creating private keys and submitting transactions
'use strict';

import { createHash } from 'crypto';


const hash = str => createHash('sha512').update(str).digest('hex');

const FAMILY_NAME = 'cryptomoji';
const FAMILY_VERSION = '1.0';
const NAMESPACE = hash(FAMILY_NAME).slice(0, 6);

/**
 * Creates a new public/private key pair, and returns them as an object
 * with the keys "public", and "private".
 */
export const createKeys = () => {
  throw new Error('Method not implemented: createKeys');
};

/**
 * Takes a private key and returns its public pair.
 */
export const getPublicKey = privateKey => {
  throw new Error('Method not implemented: getPublicKey');
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
