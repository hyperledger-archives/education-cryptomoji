// Functions to fetch state data from the blockchain
'use strict';

import axios from 'axios';

import { MAX_HTTP_REQUESTS } from '../utils/constants';
import { decode } from './encoding.js';
import * from './addressing.js';


/**
 * Takes a seventy character address, and fetches an entity from state.
 * Adds the address and resource type to the entity.
 */
export const fetchOne = address => {
  const type = addressToType(address);
  return axios.get(`api/state/${address}`)
    .then(({ data }) => Object.assign({ address, type } , decode(data.data)));
};

/**
 * Takes a partial address (i.e. prefix), and fetches all matching entities
 * from state. Adds the address and resource type to each.
 */
export const fetchMany = (prefix = null) => {
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

  if (prefix === null) {
    return doFetch('api/state');
  }

  return doFetch(`api/state?address=${prefix}`);
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
 * Accepts a pair of optional parameters, the owner's public key, and one or
 * more moji dna strings.
 *   - if nothing is set, all Cryptomoji are returned in an array
 *   - if the owner's key is set, returns the moji belonging to that key
 *   - if all parameters are set, returns the one matching Cryptomoji
 */
export const getMoji = (ownerKey = null, dna = null) => {
  const address = getMojiAddress(ownerKey, dna);

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
      .then(({ sire }) => fetchOne(sire));
  }

  return fetchMany(address).then(listings => {
    const addresses = listings.map(listing => listing.sire);

    // If only a few sires, fetch each individually
    if (listings.length < MAX_HTTP_REQUESTS - 1) {
      const sireRequests = addresses.map(address => fetchOne(address));
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
 * Accepts a pair of optional parameters, the owner's public key, and one or
 * more moji identifiers, which might be dna or addresses.
 *   - if nothing is set, all Offers are returned in an array
 *   - if the owner's key is set, returns the Offers belonging to that key
 *   - if all parameters are set, returns the one matching Offer
 */
export const getOffers = (ownerKey = null, moji = null) => {
  const address = getOfferAddress(ownerKey, moji);

  if (!moji) {
    return fetchMany(address);
  }

  return fetchOne(address);
};
