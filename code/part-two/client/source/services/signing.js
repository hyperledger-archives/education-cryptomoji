import * as secp256k1 from 'secp256k1';
import { randomBytes, createHash } from 'crypto';


// Returns a Buffer SHA-256 hash of a string or Buffer
const sha256 = msg => createHash('sha256').update(msg).digest();

// Converts a hex string to a Buffer
const toBytes = hex => Buffer.from(hex, 'hex');

/**
 * Creates a new private key encoded as a hex string.
 */
export const createPrivateKey = () => {
  let privateKey = null;
  do {
    privateKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privateKey));

  return privateKey.toString('hex');
};

/**
 * Takes a private key and returns its public pair.
 */
export const getPublicKey = privateKey => {
  return secp256k1.publicKeyCreate(toBytes(privateKey)).toString('hex');
};

/**
 * Creates a new public/private key pair, and returns them as an object
 * with the keys "publicKey", and "privateKey".
 */
export const createKeys = () => {
  const privateKey = createPrivateKey();
  const publicKey = getPublicKey(privateKey);
  return { privateKey, publicKey };
};

/**
 * Takes a private key and returns a signing function. This function will
 * take a Buffer message, and return a hexadecimal signature.
 */
export const sign = (privateKey, message) => {
  const { signature } = secp256k1.sign(sha256(message), toBytes(privateKey));
  return signature.toString('hex');
};
