'use strict';

const { hash } = require('./helpers');


const FAMILY_NAME = 'cryptomoji';
const FAMILY_VERSION = '1.0';
const NAMESPACE = hash(FAMILY_NAME, 6);

const TYPE_PREFIXES = {
  COLLECTION: '00',
  MOJI: '01',
  OFFER: '02',
  SIRE_LISTING: '03'
};

const NEW_MOJI_COUNT = 3;
const DNA_LENGTH = 9;
const GENE_SIZE = 2 ** (8 * 2);

module.exports = {
  FAMILY_NAME,
  FAMILY_VERSION,
  NAMESPACE,
  TYPE_PREFIXES,
  NEW_MOJI_COUNT,
  DNA_LENGTH,
  GENE_SIZE
};
