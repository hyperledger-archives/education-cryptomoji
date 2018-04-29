import secp256k1 from 'sawtooth-sdk/signing/secp256k1';


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
 * Takes a private key and returns a signing function. This function will
 * take a Buffer message, and return a hexadecimal signature.
 */
export const sign = (privateKey, message) => {
  const privateWrapper = secp256k1.Secp256k1PrivateKey.fromHex(privateKey);
  return CONTEXT.sign(message, privateWrapper);
};
