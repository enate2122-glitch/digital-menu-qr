import bcrypt from 'bcrypt';

const COST_FACTOR = 12;

export async function hashPassword(plaintext: string, rounds: number = COST_FACTOR): Promise<string> {
  return bcrypt.hash(plaintext, rounds);
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}
