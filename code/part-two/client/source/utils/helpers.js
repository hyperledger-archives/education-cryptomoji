import { createHash } from 'crypto';

// SHA-512 hash, optionally sliced to a particular length
export const hash = (str, length = 128) => {
  return createHash('sha512').update(str).digest('hex').slice(0, length);
};
