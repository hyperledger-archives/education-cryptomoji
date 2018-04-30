import { hash } from './helpers';

export const FAMILY_NAME = 'cryptomoji';
export const FAMILY_VERSION = '1.0';
export const NAMESPACE = hash(FAMILY_NAME, 6);

export const TYPE_PREFIXES = {
  COLLECTION: '00',
  MOJI: '01',
  SIRE_LISTING: '02',
  OFFER: '03'
};

export const ADDRESS_LENGTH = 70;
export const MAX_HTTP_REQUESTS = 10;
