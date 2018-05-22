import { createHash } from 'crypto';


const NAMESPACE = '5f4d76';
const PREFIXES = {
  COLLECTION: '00',
  MOJI: '01',
  SIRE_LISTING: '02',
  OFFER: '03'
};
// START SOLUTION
const ADDRESS_LENGTH = 70;

Object.keys(PREFIXES).forEach(p => { PREFIXES[p] = NAMESPACE + PREFIXES[p]; });

// Returns a hex-string SHA-512 hash sliced to a particular length
const hash = (str, length) => {
  return createHash('sha512').update(str).digest('hex').slice(0, length);
};

/**
 * Takes an address returns a string corresponding to its type.
 */
export const addressToType = (address = '') => {
  const type = Object.keys(PREFIXES)
    .find(type => PREFIXES[type] === address.slice(0, 8));

  return type || null;
};

// END SOLUTION
/**
 * A function which optionally takes a public key, and returns a full or
 * partial collection address.
 *
 * Should work similarly to the processor version, but if the public key is
 * omitted, returns the 8 character prefix which will fetch all collections
 * from the REST API, otherwise returns the full 70 character address.
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
  if (publicKey === null) {
    return PREFIXES.COLLECTION;
  }

  return PREFIXES.COLLECTION + hash(publicKey, 62);
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
  if (ownerKey === null) {
    return PREFIXES.MOJI;
  }

  const ownerPrefix = PREFIXES.MOJI + hash(ownerKey, 8);
  if (dna === null) {
    return ownerPrefix;
  }

  return ownerPrefix + hash(dna, 54);
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
  if (ownerKey === null) {
    return PREFIXES.SIRE_LISTING;
  }

  return PREFIXES.SIRE_LISTING + hash(ownerKey, 62);
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
  if (ownerKey === null) {
    return PREFIXES.OFFER;
  }

  const ownerPrefix = PREFIXES.OFFER + hash(ownerKey, 8);
  if (moji === null) {
    return ownerPrefix;
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

  return ownerPrefix + hash(addresses.sort().join(''), 54);
  // END SOLUTION
};
