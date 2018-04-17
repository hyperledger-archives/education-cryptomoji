// Constants
const FAMILY_NAME = 'cryptomoji';
const NAMESPACE = hash(FAMILY_NAME, 6);
const PREFIXES = {
  COLLECTION: '00',
  MOJI: '01',
  OFFER: '02',
  SIRE_LISTING: '03'
};

export const addressToType = (address = '') => {
  if (address.slice(0, 6) === NAMESPACE) {
    const resource = address.slice(6, 8);
    if (resource === PREFIXES.COLLECTION) {
      return 'collection';
    } else if (resource === PREFIXES.MOJI) {
      return 'moji';
    } else if (resource === PREFIXES.OFFER) {
      return 'offer';
    } else if (resource === PREFIXES.SIRE_LISTING) {
      return 'sire';
    }
  }
  return null;
};
