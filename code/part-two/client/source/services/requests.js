// Functions to fetch state data from the blockchain
'use strict';

import axios from 'axios';

import { MAX_HTTP_REQUESTS } from '../utils/constants';
import { decode } from './encoding.js';
import * from './addressing.js';


// Fetches one state entity by address
const fetchOne = address => {
  const type = addressToType(address);
  return axios.get(`api/state/${address}`)
    .then(({ data }) => Object.assign({ address, type } , decode(data.data)));
};

// Fetches many state entities by address prefix,
// concatenating all available pages as needed
const fetchMany = prefix => {
  const doFetch = url => {
    return axios.get(url).then(({ data }) => {
      const resources = data.data.map(({ address, data }) => {
        const type = addressToType(address);
        return Object.assign({ address, type }, decode(data));
      });

      if (!data.paging.next) {
        return resources;
      }

      return doFetch(data.paging.next)
        .then(nextPage => resources.concat(nextPage));
    });
  };

  return doFetch(`/api/state?address=${prefix}`);
};

/**
 * Takes an encoded Batch and submits it to the REST API, optionally waiting
 * until the batch is committed to resolve (waits by default).
 *
 * Resolves to `true` if submission was successful, otherwise throws an error.
 */
export const submitBatch = (encodedBatch, shouldWait = true) => {
  return axios({
    method: 'POST',
    url: 'api/batches',
    data: encodedBatch,
    headers: { 'Content-Type': 'application/octet-stream' }
  }).then(({ data }) => {
    if (!shouldWait) {
      // There is nothing particularly interesting to return from the REST API
      return true;
    }

    return axios.get(data.link + '&wait').then(({ data }) => {
      const failed = data.data.find(({ status }) => status !== 'COMMITTED');
      if (failed) {
        const id = failed.id;
        const status = failed.status;
        const msg = failed.invalid_transactions[0].message;
        throw new Error(`Batch "${id}" is ${status}, with message: ${msg}`);
      }

      return true;
    });
  });
};

/**
 * Fetches one or more Collections.
 *
 * Accepts a single optional public key parameter:
 *   null - if not set, all Collections are returned in an array
 *   string - if a key, that particular Collection is returned
 */
export const getCollections = (publicKey = null) => {
  const address = getCollectionAddress(publicKey);

  if (publicKey === null) {
    return fetchMany(address);
  }

  return fetchOne(address);
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
  if (filterOrAddress === null) {
    return fetchMany(getMojiAddress());
  }

  if (typeof filterOrAddress === 'string') {
    return fetchOne(filterOrAddress);
  }

  const { owner, dna } = filterOrAddress;
  const address = getMojiAddress(owner, dna);

  if (!dna) {
    return fetchMany(address);
  }

  return fetchOne(address);
};

/**
 * Fetches one or more sires.
 *
 * Accepts a single optional public key parameter:
 *   null - if not set, all sires are returned in an array
 *   string - if a key, the sire owned by that public key is returned
 */
export const getSires = (ownerKey = null) => {
  const address = getSireAddress(ownerKey);

  if (ownerKey !== null) {
    return fetchOne(address)
      .then(({ sire }) => getMoji(sire));
  }

  return fetchMany(address).then(listings => {
    const addresses = listings.map(listing => listing.sire);

    // If only a few sires, fetch each individually
    if (listings.length < MAX_HTTP_REQUESTS - 1) {
      const sireRequests = addresses.map(address => getMoji(address));
      return Promise.all(sireRequests);
    }

    // If many sires, fetch all moji in one request and filter
    return getMoji()
      .then(moji => moji.filter(addresses.includes(moji.address)));
  });
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
  if (filterOrAddress === null) {
    return fetchMany(getOfferAddress());
  }

  if (typeof filterOrAddress === 'string') {
    return fetchOne(filterOrAddress);
  }

  const { owner, moji } = filterOrAddress;
  const address = getOfferAddress(owner, moji);

  if (!moji) {
    return fetchMany(address);
  }

  return fetchOne(address);
};
