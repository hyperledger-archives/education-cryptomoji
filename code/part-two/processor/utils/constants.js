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

module.exports = {
  FAMILY_NAME,
  FAMILY_VERSION,
  NAMESPACE,
  TYPE_PREFIXES
};
