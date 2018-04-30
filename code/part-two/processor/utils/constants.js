'use strict';

const { hash } = require('./helpers');


const FAMILY_NAME = 'cryptomoji';
const FAMILY_VERSION = '1.0';
const NAMESPACE = hash(FAMILY_NAME, 6);

const TYPE_PREFIXES = {
  COLLECTION: '00',
  MOJI: '01',
  SIRE_LISTING: '02',
  OFFER: '03'
};

const NEW_MOJI_COUNT = 3;
const DNA_LENGTH = 9;
const DNA_BITS = 2 * 8;
const GENE_SIZE = 2 ** DNA_BITS;
const AVERAGE_CHANCE = 200;
const SIRE_CHANCE = 600;

module.exports = {
  FAMILY_NAME,
  FAMILY_VERSION,
  NAMESPACE,
  TYPE_PREFIXES,
  NEW_MOJI_COUNT,
  DNA_LENGTH,
  DNA_BITS,
  GENE_SIZE,
  AVERAGE_CHANCE,
  SIRE_CHANCE
};
