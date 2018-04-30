'use strict';

const { hash } = require('./helpers');
const { NAMESPACE, TYPE_PREFIXES } = require('./constants');


const getAddress = {};

// Returns the address of a collection by its public key
getAddress.collection = publicKey => {
  return NAMESPACE +
    TYPE_PREFIXES.COLLECTION +
    hash(publicKey, 62);
};

// A curried function, fetching a moji address from owner key and dna
getAddress.moji = ownerKey => {
  const ownerHash = hash(ownerKey, 8);

  return mojiDna => {
    return NAMESPACE +
      TYPE_PREFIXES.MOJI +
      ownerHash +
      hash(mojiDna, 54);
  };
};

// Returns the address of a sire listing by owner key
getAddress.sireListing = ownerKey => {
  return NAMESPACE +
    TYPE_PREFIXES.SIRE_LISTING +
    hash(ownerKey, 62);
};

// A curried function, fetching an offer address from owner key and
// the addresses of cryptomoji being offered
getAddress.offer = ownerKey => {
  const ownerHash = hash(ownerKey, 8);

  return offeredAddresses => {
    if (!Array.isArray(offeredAddresses)) {
      offeredAddresses = [offeredAddresses];
    }
    return NAMESPACE +
      TYPE_PREFIXES.OFFER +
      ownerHash +
      hash(offeredAddresses.sort().join(''), 54);
  };
};


module.exports = getAddress;
