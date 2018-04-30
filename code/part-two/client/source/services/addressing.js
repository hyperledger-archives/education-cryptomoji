import { hash } from '../utils/helpers';
import {
  NAMESPACE,
  TYPE_PREFIXES,
  ADDRESS_LENGTH
} from '../utils/constants';

/**
 * Optionally takes a public key, and returns a collection address.
 *
 * If key is omitted, a partial type prefix is returned.
 */
export const getCollectionAddress = (publicKey = null) => {
  const prefix = NAMESPACE + TYPE_PREFIXES.COLLECTION;
  if (publicKey === null) {
    return prefix;
  }

  return prefix + hash(publicKey, 62);
};

/**
 * Optionally takes a public key and moji dna, and returns a moji address.
 *
 * If key or dna is omitted, a partial prefix is returned.
 */
export const getMojiAddress = (ownerKey = null, dna = null) => {
  const typePrefix = NAMESPACE + TYPE_PREFIXES.MOJI;
  if (ownerKey === null) {
    return typePrefix;
  }

  const collectionPrefix = typePrefix + hash(ownerKey, 8);
  if (dna === null) {
    return collectionPrefix;
  }

  return collectionPrefix + hash(dna, 54);
};

/**
 * Optionally takes a public key, and returns a sire listing address.
 *
 * If key is omitted, a partial type prefix is returned.
 */
export const getSireAddress = (ownerKey = null) => {
  const prefix = NAMESPACE + TYPE_PREFIXES.SIRE_LISTING;
  if (ownerKey === null) {
    return prefix;
  }

  return prefix + hash(ownerKey, 62);
};

/**
 * Optionally takes a public key and one or more moji identifiers,
 * and returns a collection address.
 *
 * If key or identifiers are omitted, a partial type prefix is returned.
 * Identifiers may be either moji dna, or moji addresses.
 */
export const getOfferAddress = (ownerKey = null, moji = null) => {
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

    return getMojiAddress(publicKey, addressOrDna);
  });

  return collectionPrefix + hash(addresses.join(''), 54);
};
