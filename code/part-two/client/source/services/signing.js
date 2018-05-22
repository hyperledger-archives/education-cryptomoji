import * as secp256k1 from 'secp256k1';
import { randomBytes, createHash } from 'crypto';


// START SOLUTION
// Returns a Buffer SHA-256 hash of a string or Buffer
const sha256 = msg => createHash('sha256').update(msg).digest();

// Converts a hex string to a Buffer
const toBytes = hex => Buffer.from(hex, 'hex');

// END SOLUTION
/**
 * This module is essentially identical to part-one's signing module.
 * Feel free to copy in your solution from there.
 *
 * This function generates a random Secp256k1 private key, returning it as
 * a 64 character hex string.
 */
export const createPrivateKey = () => {
  /* START PROBLEM
  // Enter your solution here

  END PROBLEM */
  // START SOLUTION
  let privateKey = null;
  do {
    privateKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privateKey));

  return privateKey.toString('hex');
  // END SOLUTION
};

/**
 * Takes a hexadecimal private key and returns its public pair as a
 * 66 character hexadecimal string.
 */
export const getPublicKey = privateKey => {
  /* START PROBLEM
  // Your code here

  END PROBLEM */
  // START SOLUTION
  return secp256k1.publicKeyCreate(toBytes(privateKey)).toString('hex');
  // END SOLUTION
};

/**
 * This convenience function did not exist in part-one's signing module, but
 * should be simple to implement. It creates both a private and public key,
 * returning them in an object with two properties:
 *   - privateKey: the hex private key
 *   - publicKey: the matching hex public key
 *
 * Example:
 *   const keys = createKeys();
 *   console.log(keys);
 *   // {
 *   //   privateKey: 'e291df3eede7f0c520fddbe5e9e53434ff7ef3c0894ed9d9cbc...',
 *   //   publicKey: '0202694593ddc71061e622222ed400f5373cfa7ea607ce106cca...'
 *   // }
 */
export const createKeys = () => {
  /* START PROBLEM
  // Your code here

  END PROBLEM */
  // START SOLUTION
  const privateKey = createPrivateKey();
  const publicKey = getPublicKey(privateKey);
  return { privateKey, publicKey };
  // END SOLUTION
};

/**
 * Takes a hex private key and a string message, returning a
 * hexadecimal signature.
 */
export const sign = (privateKey, message) => {
  /* START PROBLEM
  // Your code here

  END PROBLEM */
  // START SOLUTION
  const { signature } = secp256k1.sign(sha256(message), toBytes(privateKey));
  return signature.toString('hex');
  // END SOLUTION
};
