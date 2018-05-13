'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const getAddress = require('../services/addressing');
const { DNA_BITS, AVERAGE_CHANCE, SIRE_CHANCE } = require('../services/constants');
const { encode, decode, getPrng } = require('../services/helpers');


// A quick convenience function to throw an error with a joined message
const reject = (...msgs) => { throw new InvalidTransaction(msgs.join(' ')); };

const HEX_SIZE = DNA_BITS / 4;

const geneToInts = gene => {
  return gene
    .match(RegExp(`[0-9a-f]{${HEX_SIZE},${HEX_SIZE}}`, 'g'))
    .map(hex => parseInt(hex, 16));
};

const combineDna = (sire, breeder, prng) => {
  const sireGenes = geneToInts(sire);
  const breederGenes = geneToInts(breeder);

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

const breedMoji = (context, publicKey, { sire, breeder }, signature) => {
  if (!sire) {
    reject('No sire specified');
  }
  if (!getAddress.isValid(sire)) {
    reject('Sire address must be a 70-char hex string:', sire);
  }

  if (!breeder) {
    reject('No breeder specified');
  }
  if (!getAddress.isValid(breeder)) {
    reject('Breeder address must be a 70-char hex string:', breeder);
  }

  const owner = getAddress.collection(publicKey);
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
      const listing = getAddress.sireListing(sireState.owner);

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
          const address = getAddress.moji(publicKey)(dna);
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
