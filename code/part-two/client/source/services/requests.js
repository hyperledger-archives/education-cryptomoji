// Functions to fetch state data from the blockchain
'use strict';

import axios from 'axios';
import { createHash } from 'crypto';


// SHA-512 hash, optionally sliced to a particular length
const hash = (str, length = 128) => {
  return createHash('sha512').update(str).digest('hex').slice(0, length);
};

// Address constants
const FAMILY_NAME = 'cryptomoji';
const NAMESPACE = hash(FAMILY_NAME, 6);
const PREFIXES = {
  COLLECTION: '00',
  MOJI: '01',
  OFFER: '02',
  SIRE_LISTING: '03'
};

/**
 * Fetches one or more Collections.
 *
 * Accepts a single optional public key parameter:
 *   null - if not set, all Collections are returned in an array
 *   string - if a key, that particular Collection is returned
 */
export const getCollections = (key = null) => {
  throw Error('Method not implemented: getCollections');
};

/**
 * Fetches one or more Cryptomoji.
 *
 * Accepts a single optional parameter which can be a string address or
 * a filter object:
 *   null - if not set, all moji are returned in an array
 *   string - if a string address is set, returns the moji a that address
 *   { owner: string } - an object with an owner returns moji owned by that key
 *   { owner: string, dna: string } -
 */
export const getMoji = (filterOrAddress = null) => {
  throw Error('Method not implemented: getMoji');
};

/**
 * Fetches one or more Offers.
 *
 * Accepts a single optional parameter which can be a string address or
 * a filter object:
 *   null - if not set, all Offers are returned in an array
 *   string - if a string address is set, returns the Offer a that address
 *   { owner: string } - returns the Offers owned by the specified key
 *   { owner: string, moji: string[] } - returns the single matching Offer
 */
export const getOffers = (filterOrAddress = null) => {
  throw Error('Method not implemented: getOffers');
};

/**
 * Fetches one or more Sires.
 *
 * Accepts a single optional public key parameter:
 *   null - if not set, all Sires are returned in an array
 *   string - if a key, the Sire owned by that public key is returned
 */
export const getSires = (ownerKey = null) => {
  throw Error('Method not implemented: getSires');
};
