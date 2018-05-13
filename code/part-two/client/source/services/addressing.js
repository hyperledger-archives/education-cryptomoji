import { createHash } from 'crypto';


const NAMESPACE = '5f4d76';
const TYPE_PREFIXES = {
  COLLECTION: '00',
  MOJI: '01',
  SIRE_LISTING: '02',
  OFFER: '03'
};
const ADDRESS_LENGTH = 70;

// START SOLUTION
// Returns a hex-string SHA-512 hash sliced to a particular length
const hash = (str, length) => {
  return createHash('sha512').update(str).digest('hex').slice(0, length);
};

/**
 * Takes an address returns a string corresponding to its type.
 */
export const addressToType = (address = '') => {
  if (address.slice(0, 6) !== NAMESPACE) {
    return null;
  }

  const type = Object.keys(TYPE_PREFIXES)
    .find(type => TYPE_PREFIXES[type] === address.slice(6, 8));

  return type || null;
};

// END SOLUTION
/**
 * A function which optionally takes a public key, and returns a full or
 * partial collection address.
 *
 * If the public key is omitted, returns the 8 character prefix which will
 * fetch all collections from the REST API, otherwise returns the full
 * 70 character address.
 *
 * Example:
 *   const prefix = getCollectionAddress();
 *   console.log(prefix);  // '5f4d7600'
 *   const address = getCollectionAddress(publicKey);
 *   console.log(address);
 *   // '5f4d7600ecd7ef459ec82a01211983551c3ed82169ca5fa0703ec98e17f9b534ffb797'
 */
export const getCollectionAddress = (publicKey = null) => {
  /* START PROBLEM
  // Enter your solution here

  END PROBLEM */
  // START SOLUTION
  const prefix = NAMESPACE + TYPE_PREFIXES.COLLECTION;
  if (publicKey === null) {
    return prefix;
  }

  return prefix + hash(publicKey, 62);
  // END SOLUTION
};

/**
 * A function which optionally takes a public key and moji dna, returning
 * a full or partial moji address.
 *
 * If called with no arguments, returns the 8-char moji prefix. If called with
 * just a public key, returns the 16-char owner prefix which will return all
 * moji owned by this key. Passing in the dna as well returns a full address.
 *
 * Example:
 *   const ownerPrefix = getMojiAddress(publicKey);
 *   console.log(ownerPrefix);  // '5f4d7601ecd7ef45'
 */
export const getMojiAddress = (ownerKey = null, dna = null) => {
  /* START PROBLEM
  // Your code here

  END PROBLEM */
  // START SOLUTION
  const typePrefix = NAMESPACE + TYPE_PREFIXES.MOJI;
  if (ownerKey === null) {
    return typePrefix;
  }

  const collectionPrefix = typePrefix + hash(ownerKey, 8);
  if (dna === null) {
    return collectionPrefix;
  }

  return collectionPrefix + hash(dna, 54);
  // END SOLUTION
};

/**
 * A function which optionally takes a public key, and returns a full or
 * partial sire listing address.
 *
 * If the public key is omitted, returns just the sire listing prefix,
 * otherwise returns the full address.
 */
export const getSireAddress = (ownerKey = null) => {
  /* START PROBLEM
  // Your code here

  END PROBLEM */
  // START SOLUTION
  const prefix = NAMESPACE + TYPE_PREFIXES.SIRE_LISTING;
  if (ownerKey === null) {
    return prefix;
  }

  return prefix + hash(ownerKey, 62);
  // END SOLUTION
};

/**
 * EXTRA CREDIT
 * Only needed if you implement the full transaction processor, adding the
 * functionality to trade cryptomoji. Remove `.skip` from line 96 of
 * tests/04-Addressing.js to test.
 *
 * A function that optionally takes a public key and one or more moji
 * identifiers, and returns a full or partial offer address.
 *
 * If key or identifiers are omitted, returns just the offer prefix.
 * The identifiers may be either moji dna, or moji addresses.
 */
export const getOfferAddress = (ownerKey = null, moji = null) => {
  /* START PROBLEM
  // Your code here

  END PROBLEM */
  // START SOLUTION
  const typePrefix = NAMESPACE + TYPE_PREFIXES.OFFER;
  if (ownerKey === null) {
    return typePrefix;
  }

  const collectionPrefix = typePrefix + hash(ownerKey, 8);
  if (moji === null) {
    return collectionPrefix;
  }

  if (!Array.isArray(moji)) {
    moji = [moji];
  }

  const addresses = moji.map(addressOrDna => {
    if (addressOrDna.length === ADDRESS_LENGTH) {
      return addressOrDna;
    }

    return getMojiAddress(ownerKey, addressOrDna);
  });

  return collectionPrefix + hash(addresses.join(''), 54);
  // END SOLUTION
};
