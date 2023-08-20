import { createHash } from 'crypto';

export function getPasswordHash(password: string, salt: string): string {
  return createHash('md5').update(`${password}${salt}`).digest('hex');
}
