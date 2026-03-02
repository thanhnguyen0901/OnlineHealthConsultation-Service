import { uuidv7 } from 'uuidv7';

/**
 * Generate a new UUID v7 string.
 * UUID v7 is time-ordered (monotonically increasing), making it suitable
 * as a primary key: it indexes efficiently in B-tree engines while remaining
 * globally unique.
 *
 * Format: xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx  (36 characters, fits CHAR(36))
 */
export function newId(): string {
  return uuidv7();
}
