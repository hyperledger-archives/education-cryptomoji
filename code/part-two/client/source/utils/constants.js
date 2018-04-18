'use strict';

import { hash } from './helpers';

export const FAMILY_NAME = 'cryptomoji';
export const FAMILY_VERSION = '1.0';
export const NAMESPACE = hash(FAMILY_NAME, 6);

export const TYPE_PREFIXES = {
  COLLECTION: '00',
  MOJI: '01',
  OFFER: '02',
  SIRE_LISTING: '03'
};

export const NEW_MOJI_COUNT = 3;
export const DNA_LENGTH = 9;
export const DNA_BITS = 2 * 8;
export const GENE_SIZE = 2 ** DNA_BITS;
export const AVERAGE_CHANCE = 200;
export const SIRE_CHANCE = 600;

export const ADDRESS_LENGTH = 70;
export const MAX_HTTP_REQUESTS = 10;

export const MAX_WHITESPACE = 4;
export const HEX_COUNT = DNA_BITS / 4;
