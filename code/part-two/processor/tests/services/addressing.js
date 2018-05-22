'use strict';

const { createHash } = require('crypto');


const NAMESPACE = '5f4d76';
const PREFIXES = {
  COLLECTION: '00',
  MOJI: '01',
  SIRE_LISTING: '02',
  OFFER: '03'
};
Object.keys(PREFIXES).forEach(p => { PREFIXES[p] = NAMESPACE + PREFIXES[p]; });

// Returns a hex-string SHA-512 hash sliced to a particular length
const hash = (str, length) => {
  return createHash('sha512').update(str).digest('hex').slice(0, length);
};

// Takes a public key and returns a collection address
const getCollectionAddress = publicKey => {
  return PREFIXES.COLLECTION + hash(publicKey, 62);
};

// Takes an owner's public key and dna string and returns a moji address
const getMojiAddress = (ownerKey, dna) => {
  return PREFIXES.MOJI + hash(ownerKey, 8) + hash(dna, 54);
};

// Takes an owner's public key and returns the address for their sire listing
const getSireAddress = ownerKey => {
  return PREFIXES.SIRE_LISTING + hash(ownerKey, 62);
};

// Takes a public key and array of moji addresses, returns an offer address
const getOfferAddress = (ownerKey, addresses) => {
  if (!Array.isArray(addresses)) {
    addresses = [ addresses ];
  }

  return PREFIXES.OFFER
    + hash(ownerKey, 8)
    + hash(addresses.sort().join(''), 54);
};

module.exports = {
  getCollectionAddress,
  getMojiAddress,
  getSireAddress,
  getOfferAddress
};
