import { createHash } from 'crypto';


const NAMESPACE = '5f4d76';
const PREFIXES = {
  COLLECTION: '00',
  MOJI: '01',
  SIRE_LISTING: '02',
  OFFER: '03'
};
const ADDRESS_LENGTH = 70;
const FULL_PREFIXES = Object.keys(PREFIXES).reduce((prefixes, key) => {
  prefixes[key] = NAMESPACE + PREFIXES[key];
  return prefixes;
}, {});

// Returns a hex-string SHA-512 hash sliced to a particular length
const hash = (str, length) => {
  return createHash('sha512').update(str).digest('hex').slice(0, length);
};

/**
 * Takes an address returns a string corresponding to its type.
 */
export const addressToType = (address = '') => {
  const type = Object.keys(FULL_PREFIXES)
    .find(type => FULL_PREFIXES[type] === address.slice(0, 8));

  return type || null;
};

/**
 * A function which optionally takes a public key, and returns a full or
 * partial collection address.
 *
 * Works similarly to the processor version, but if the public key is omitted,
 * returns the 8 character prefix which can be used to fetch all collections
 * from the REST API. If the public key is provided, returns the full
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
  if (publicKey === null) {
    return FULL_PREFIXES.COLLECTION;
  }

  return FULL_PREFIXES.COLLECTION + hash(publicKey, 62);
};

/**
 * A function which optionally takes a public key and moji dna, returning
 * a full or partial moji address.
 *
 * If called with no arguments, returns the 8-char moji prefix. If called with
 * just a public key, returns the 16-char owner prefix which can fetch all
 * moji owned by this key. Passing in the dna as well returns a full address.
 *
 * Example:
 *   const ownerPrefix = getMojiAddress(publicKey);
 *   console.log(ownerPrefix);  // '5f4d7601ecd7ef45'
 */
export const getMojiAddress = (ownerKey = null, dna = null) => {
  if (ownerKey === null) {
    return FULL_PREFIXES.MOJI;
  }

  const ownerPrefix = FULL_PREFIXES.MOJI + hash(ownerKey, 8);
  if (dna === null) {
    return ownerPrefix;
  }

  return ownerPrefix + hash(dna, 54);
};

/**
 * A function which optionally takes a public key, and returns a full or
 * partial sire listing address.
 *
 * If the public key is omitted, returns just the sire listing prefix,
 * otherwise returns the full address.
 */
export const getSireAddress = (ownerKey = null) => {
  if (ownerKey === null) {
    return FULL_PREFIXES.SIRE_LISTING;
  }

  return FULL_PREFIXES.SIRE_LISTING + hash(ownerKey, 62);
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
  if (ownerKey === null) {
    return FULL_PREFIXES.OFFER;
  }

  const ownerPrefix = FULL_PREFIXES.OFFER + hash(ownerKey, 8);
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
};
