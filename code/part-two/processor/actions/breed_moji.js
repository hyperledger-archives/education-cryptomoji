'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const {
  getCollectionAddress,
  getMojiAddress,
  getSireAddress,
  isValidAddress
} = require('../services/addressing');
const { encode, decode } = require('../services/encoding');
const getPrng = require('../services/prng');


const DNA_BITS = 2 * 8;
const AVERAGE_CHANCE = 200;
const SIRE_CHANCE = 600;
const HEX_SIZE = DNA_BITS / 4;

// A quick convenience function to throw an error with a joined message
const reject = (...msgs) => { throw new InvalidTransaction(msgs.join(' ')); };

// Turns a hex dna string into an array of integers, one per gene
const dnaToInts = dna => {
  return dna
    .match(RegExp(`[0-9a-f]{${HEX_SIZE},${HEX_SIZE}}`, 'g'))
    .map(hex => parseInt(hex, 16));
};

// Takes sire and breeder dna, and a prng, and combines them into new dna
const combineDna = (sire, breeder, prng) => {
  const sireGenes = dnaToInts(sire);
  const breederGenes = dnaToInts(breeder);

  return sireGenes
    .map((sireGene, i) => [ sireGene, breederGenes[i] ])
    .map(([ sireGene, breederGene ]) => {
      if (prng(1000) < AVERAGE_CHANCE) {
        return Math.floor((sireGene + breederGene) / 2);
      }

      if (prng(1000) < SIRE_CHANCE) {
        return sireGene;
      }

      return breederGene;
    })
    .map(gene => ('0'.repeat(HEX_SIZE) + gene.toString(16)).slice(-HEX_SIZE))
    .join('');
};

/**
 * Combines the dna of a sire and breeder, creating a new moji for the
 * breeder's owner.
 */
const breedMoji = (context, publicKey, { sire, breeder }, signature) => {
  if (!sire) {
    reject('No sire specified');
  }
  if (!isValidAddress(sire)) {
    reject('Sire address must be a 70-char hex string:', sire);
  }

  if (!breeder) {
    reject('No breeder specified');
  }
  if (!isValidAddress(breeder)) {
    reject('Breeder address must be a 70-char hex string:', breeder);
  }

  const owner = getCollectionAddress(publicKey);
  const prng = getPrng(signature);

  return context.getState([ owner, sire, breeder ])
    .then(state => {
      if (state[owner].length === 0) {
        reject('Signer must have a collection:', publicKey);
      }

      if (state[sire].length === 0) {
        reject('Specified sire does not exist:', sire);
      }

      if (state[breeder].length === 0) {
        reject('Specified breeder does not exist:', breeder);
      }

      const ownerState = decode(state[owner]);
      const sireState = decode(state[sire]);
      const breederState = decode(state[breeder]);
      const listing = getSireAddress(sireState.owner);

      if (breederState.owner !== publicKey) {
        reject('Breeder must be owned by signer:', breeder);
      }

      return context.getState([ listing ])
        .then(state => {
          const isNotListed = state[listing].length === 0
            || decode(state[listing]).sire !== sire;

          if (isNotListed) {
            reject('Specified sire is not listed:', sire);
          }

          const dna = combineDna(sireState.dna, breederState.dna, prng);
          const address = getMojiAddress(publicKey, dna);
          const child = {
            dna,
            sire,
            breeder,
            owner: publicKey,
            sired: [],
            bred: []
          };

          sireState.sired.push(address);
          breederState.bred.push(address);
          ownerState.moji.push(address);

          const updates = {};
          updates[address] = encode(child);
          updates[sire] = encode(sireState);
          updates[breeder] = encode(breederState);
          updates[owner] = encode(ownerState);

          return context.setState(updates);
        });
    });
};

module.exports = breedMoji;
