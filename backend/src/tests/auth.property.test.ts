// Feature: digital-menu-qr-system, Property 1: valid credentials always return JWT with correct role

/**
 * Validates: Requirements 1.1
 *
 * Property P1: For any user record with a known email and correct password,
 * submitting those credentials to loginUser() should return a JWT whose decoded
 * payload contains the same role as stored in the database.
 */

import * as fc from 'fast-check';
import jwt from 'jsonwebtoken';
import { loginUser } from '../services/auth.service';
import { hashPassword } from '../utils/password';

// Mock the db module so no real database is needed
jest.mock('../db', () => ({
  query: jest.fn(),
}));

import { query } from '../db';

const mockQuery = query as jest.MockedFunction<typeof query>;

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '1h';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('P1: valid credentials always return JWT with correct role', () => {
  it('should return a JWT whose decoded role matches the stored user role for any valid user', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate arbitrary email, password, and role
        fc.emailAddress(),
        fc.string({ minLength: 8, maxLength: 64 }).filter(s => s.trim().length >= 8),
        fc.constantFrom('owner' as const, 'super_admin' as const),
        async (email, password, role) => {
          // Pre-hash the password as the DB would store it (use cost 4 in tests for speed)
          const password_hash = await hashPassword(password, 4);

          // Set up the mock to return a fake user row
          mockQuery.mockResolvedValueOnce({
            rows: [
              {
                id: 'test-user-id',
                email,
                password_hash,
                role,
                status: 'active',
              },
            ],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
          } as any);

          // Call loginUser with the generated credentials
          const result = await loginUser(email, password);

          // Decode the JWT (without verifying signature to keep test self-contained)
          const decoded = jwt.decode(result.token) as { role: string; sub: string } | null;

          // Assert the decoded role matches the stored role
          expect(decoded).not.toBeNull();
          expect(decoded!.role).toBe(role);

          // Also assert the returned role field matches
          expect(result.role).toBe(role);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: digital-menu-qr-system, Property 2: invalid credentials always return 401

/**
 * Validates: Requirements 1.2
 *
 * Property P2: For any combination of email and password where at least one does
 * not match a stored user record, loginUser() should throw an error with statusCode 401.
 */

describe('P2: invalid credentials always return 401', () => {
  it('should throw 401 when email is not found in DB (empty rows)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 1, maxLength: 128 }),
        async (email, password) => {
          // Mock DB returns no rows — email not found
          mockQuery.mockResolvedValueOnce({
            rows: [],
            rowCount: 0,
            command: 'SELECT',
            oid: 0,
            fields: [],
          } as any);

          let threw = false;
          try {
            await loginUser(email, password);
          } catch (err) {
            threw = true;
            expect((err as any).statusCode).toBe(401);
          }
          expect(threw).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should throw 401 when password does not match the stored hash', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        // correctPassword and wrongPassword must differ
        fc.string({ minLength: 8, maxLength: 64 }).filter((s: string) => s.trim().length >= 8),
        fc.string({ minLength: 8, maxLength: 64 }).filter((s: string) => s.trim().length >= 8),
        async (email, correctPassword, wrongPassword) => {
          // Ensure the two passwords are actually different
          fc.pre(correctPassword !== wrongPassword);

          const password_hash = await hashPassword(correctPassword, 4);

          // Mock DB returns a user whose hash was built from correctPassword
          mockQuery.mockResolvedValueOnce({
            rows: [
              {
                id: 'test-user-id',
                email,
                password_hash,
                role: 'owner',
                status: 'active',
              },
            ],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
          } as any);

          let threw = false;
          try {
            // Submit wrongPassword — should not match
            await loginUser(email, wrongPassword);
          } catch (err) {
            threw = true;
            expect((err as any).statusCode).toBe(401);
          }
          expect(threw).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: digital-menu-qr-system, Property 3: inactive owner login always returns 403

/**
 * Validates: Requirements 2.5
 *
 * Property P3: For any Owner account whose status is 'inactive', a login attempt
 * should always return HTTP 403 regardless of whether the password is correct.
 */

describe('P3: inactive owner login always returns 403', () => {
  it('should throw 403 for any inactive owner even when the correct password is supplied', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 8, maxLength: 64 }).filter((s: string) => s.trim().length >= 8),
        fc.constantFrom('owner' as const, 'super_admin' as const),
        async (email: string, password: string, role: 'owner' | 'super_admin') => {
          // Pre-hash the password exactly as the DB would store it (cost 4 for test speed)
          const password_hash = await hashPassword(password, 4);

          // Mock DB returns a user whose status is 'inactive' but password hash is correct
          mockQuery.mockResolvedValueOnce({
            rows: [
              {
                id: 'test-user-id',
                email,
                password_hash,
                role,
                status: 'inactive',
              },
            ],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
          } as any);

          let threw = false;
          try {
            // Supply the correct password — should still be rejected with 403
            await loginUser(email, password);
          } catch (err) {
            threw = true;
            expect((err as any).statusCode).toBe(403);
          }
          expect(threw).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: digital-menu-qr-system, Property 4: duplicate email registration always returns 409

/**
 * Validates: Requirements 3.1
 *
 * Property P4: For any email address that already exists in the users table,
 * a Super_Admin registration request using that email should return HTTP 409.
 */

import { registerOwner } from '../services/auth.service';

describe('P4: duplicate email registration always returns 409', () => {
  it('should throw 409 for any email that triggers a unique constraint violation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 8, maxLength: 64 }),
        async (email: string, password: string) => {
          // Simulate pg unique constraint violation (code 23505)
          const pgUniqueError = Object.assign(new Error('duplicate key value violates unique constraint'), {
            code: '23505',
          });

          // First call: hashPassword inside registerOwner hits the real bcrypt,
          // but the INSERT mock rejects with the pg error.
          mockQuery.mockRejectedValueOnce(pgUniqueError);

          let threw = false;
          try {
            await registerOwner(email, password);
          } catch (err) {
            threw = true;
            expect((err as any).statusCode).toBe(409);
          }
          expect(threw).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  }, 120000); // allow up to 2 min — registerOwner calls real bcrypt(cost=12) x100
});
