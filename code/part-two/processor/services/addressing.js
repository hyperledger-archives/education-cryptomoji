'use strict';

const { createHash } = require('crypto');


const NAMESPACE = '5f4d76';
const PREFIXES = {
  COLLECTION: '00',
  MOJI: '01',
  SIRE_LISTING: '02',
  OFFER: '03'
};

// START SOLUTION
Object.keys(PREFIXES).forEach(p => { PREFIXES[p] = NAMESPACE + PREFIXES[p]; });

// Returns a hex-string SHA-512 hash sliced to a particular length
const hash = (str, length) => {
  return createHash('sha512').update(str).digest('hex').slice(0, length);
};

//END SOLUTION
/**
 * A function that takes a public key and returns the correct collection
 * address.
 *
 * Simpler than the client version, the public key is not optional so this
 * function should always always return a full address.
 *
 * Example:
 *   const address = getCollectionAddress(publicKey);
 *   console.log(address);
 *   // '5f4d7600ecd7ef459ec82a01211983551c3ed82169ca5fa0703ec98e17f9b534ffb797'
 */
const getCollectionAddress = publicKey => {
  /* START PROBLEM
  // Enter your solution here

  END PROBLEM */
  // START SOLUTION
  return PREFIXES.COLLECTION + hash(publicKey, 62);
  // END SOLUTION
};

/**
 * A function that takes a public key and a moji dna string, returning the
 * correct moji address.
 */
const getMojiAddress = (ownerKey, dna) => {
  /* START PROBLEM
  // Your code here

  END PROBLEM */
  // START SOLUTION
  return PREFIXES.MOJI + hash(ownerKey, 8) + hash(dna, 54);
  // END SOLUTION
};

/**
 * A function that takes a public key, and returns the correct sire
 * listing address.
 */
const getSireAddress = ownerKey => {
  /* START PROBLEM
  // Your code here

  END PROBLEM */
  // START SOLUTION
  return PREFIXES.SIRE_LISTING + hash(ownerKey, 62);
  // END SOLUTION
};

/**
 * EXTRA CREDIT
 * Only needed if you add trading cryptomoji to your transaction processor.
 * Remove the `.skip` from line 184 of tests/01-Services.js to test.
 *
 * A function that takes a public key and one or more moji addresses,
 * returning the correct offer address.
 *
 * Unlike the client version, moji may only be identified by addresses, not
 * dna strings.
 */
const getOfferAddress = (ownerKey, addresses) => {
  /* START PROBLEM
  // Your code here

  END PROBLEM */
  // START SOLUTION
  if (!Array.isArray(addresses)) {
    addresses = [ addresses ];
  }

  return PREFIXES.OFFER
    + hash(ownerKey, 8)
    + hash(addresses.sort().join(''), 54);
  // END SOLUTION
};

/**
 * A function that takes an address and returns true or false depending on
 * whether or not it is a valid Cryptomoji address.
 *
 * Example:
 *   const isValid = isValidAddress('00000000');
 *   console.log(isValid);  // false
 */
const isValidAddress = address => {
  /* START PROBLEM
  // Your code here

  END PROBLEM */
  // START SOLUTION
  const pattern = `^${NAMESPACE}[0-9a-f]{64}$`;

  return new RegExp(pattern).test(address);
  // END SOLUTION
};

module.exports = {
  getCollectionAddress,
  getMojiAddress,
  getSireAddress,
  getOfferAddress,
  isValidAddress
};
