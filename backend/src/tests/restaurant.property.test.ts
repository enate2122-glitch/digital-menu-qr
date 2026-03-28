// Feature: digital-menu-qr-system, Property 5: cross-tenant resource access always returns 403

/**
 * Validates: Requirements 3.4, 4.5, 5.6, 10.1, 10.2
 *
 * Property P5: For any authenticated Owner and any resource not belonging to that
 * Owner's account, every read and write request targeting that resource should
 * return HTTP 403 without leaking data.
 */

import * as fc from 'fast-check';
import { getRestaurant, updateRestaurant } from '../services/restaurant.service';

// Mock the db module so no real database is needed
jest.mock('../db', () => ({
  query: jest.fn(),
}));

import { query } from '../db';

const mockQuery = query as jest.MockedFunction<typeof query>;

afterEach(() => {
  jest.clearAllMocks();
});

describe('P5: cross-tenant resource access always returns 403', () => {
  it('getRestaurant should throw 403 when owner2 tries to read a restaurant owned by owner1', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate two distinct UUIDs for owner1 and owner2
        fc.uuid(),
        fc.uuid(),
        fc.uuid(), // restaurantId
        async (owner1Id, owner2Id, restaurantId) => {
          // Precondition: the two owner IDs must be different
          fc.pre(owner1Id !== owner2Id);

          // Mock DB returns a restaurant owned by owner1
          mockQuery.mockResolvedValueOnce({
            rows: [
              {
                id: restaurantId,
                owner_id: owner1Id,
                name: 'Test Restaurant',
                address: null,
                logo_url: null,
                primary_color: null,
                slug: 'test-restaurant',
                unique_qr_id: 'some-qr-id',
                created_at: new Date(),
              },
            ],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
          } as any);

          let threw = false;
          try {
            // owner2 attempts to read owner1's restaurant
            await getRestaurant(restaurantId, owner2Id);
          } catch (err) {
            threw = true;
            expect((err as any).status).toBe(403);
          }
          expect(threw).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('updateRestaurant should throw 403 when owner2 tries to update a restaurant owned by owner1', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate two distinct UUIDs for owner1 and owner2
        fc.uuid(),
        fc.uuid(),
        fc.uuid(), // restaurantId
        async (owner1Id, owner2Id, restaurantId) => {
          // Precondition: the two owner IDs must be different
          fc.pre(owner1Id !== owner2Id);

          // Mock DB returns a restaurant owned by owner1 (ownership check query)
          mockQuery.mockResolvedValueOnce({
            rows: [
              {
                id: restaurantId,
                owner_id: owner1Id,
              },
            ],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
          } as any);

          let threw = false;
          try {
            // owner2 attempts to update owner1's restaurant
            await updateRestaurant(restaurantId, owner2Id, { name: 'new name' });
          } catch (err) {
            threw = true;
            expect((err as any).status).toBe(403);
          }
          expect(threw).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: digital-menu-qr-system, Property 17: partial update preserves unchanged fields

/**
 * Validates: Requirements 3.3, 5.2
 *
 * Property P17: For any restaurant or menu item, submitting a PATCH request with a
 * subset of fields should leave all non-submitted fields unchanged in the database.
 */

describe('P17: partial update preserves unchanged fields', () => {
  it('updateRestaurant with only name should leave address, logo_url, primary_color unchanged', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // restaurantId
        fc.uuid(), // ownerId
        fc.string({ minLength: 1, maxLength: 100 }), // original name
        fc.string({ minLength: 1, maxLength: 200 }), // address
        fc.webUrl(), // logo_url
        fc.hexaString({ minLength: 6, maxLength: 6 }).map((h: string) => `#${h}`), // primary_color
        fc.string({ minLength: 1, maxLength: 100 }), // new name
        async (
          restaurantId: string,
          ownerId: string,
          originalName: string,
          address: string,
          logoUrl: string,
          primaryColor: string,
          newName: string
        ) => {
          // Precondition: new name must differ from original to make the update meaningful
          fc.pre(newName !== originalName);

          const originalRecord = {
            id: restaurantId,
            owner_id: ownerId,
            name: originalName,
            address,
            logo_url: logoUrl,
            primary_color: primaryColor,
            slug: 'some-slug',
            unique_qr_id: 'some-qr-id',
            created_at: new Date(),
          };

          // First query: ownership check — returns the restaurant with matching owner_id
          mockQuery.mockResolvedValueOnce({
            rows: [{ id: restaurantId, owner_id: ownerId }],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
          } as any);

          // Second query: UPDATE — returns the record with only name changed, all other fields intact
          mockQuery.mockResolvedValueOnce({
            rows: [{ ...originalRecord, name: newName }],
            rowCount: 1,
            command: 'UPDATE',
            oid: 0,
            fields: [],
          } as any);

          const result = await updateRestaurant(restaurantId, ownerId, { name: newName });

          // The updated field should reflect the new value
          expect(result.name).toBe(newName);

          // All non-submitted fields must remain unchanged
          expect(result.address).toBe(address);
          expect(result.logo_url).toBe(logoUrl);
          expect(result.primary_color).toBe(primaryColor);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: digital-menu-qr-system, Property 3.2: generated slug and unique_qr_id are unique across restaurants

/**
 * Validates: Requirements 3.2
 *
 * Property P3.2: The system generates a unique slug and unique_qr_id for each
 * Restaurant at creation time. Even when the same name is used, the UUID suffix
 * ensures no two restaurants share a slug or unique_qr_id.
 */

describe('P3.2: generated slug and unique_qr_id are unique across restaurants', () => {
  it('calling createRestaurant N times with the same name produces all-distinct slugs and unique_qr_ids', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // ownerId
        fc.string({ minLength: 1, maxLength: 80 }).filter((s: string) => s.trim().length > 0), // restaurant name
        fc.integer({ min: 2, max: 10 }), // N — number of restaurants to create
        async (ownerId: string, name: string, n: number) => {
          // Mock the DB to echo back whatever slug and unique_qr_id were passed in
          mockQuery.mockImplementation((_sql: string, params?: unknown[]) => {
            // params order: owner_id, name, address, logo_url, primary_color, slug, unique_qr_id
            const slug = (params ?? [])[5] as string;
            const unique_qr_id = (params ?? [])[6] as string;
            return Promise.resolve({
              rows: [
                {
                  id: 'mock-id',
                  owner_id: ownerId,
                  name,
                  address: null,
                  logo_url: null,
                  primary_color: null,
                  slug,
                  unique_qr_id,
                  created_at: new Date(),
                },
              ],
              rowCount: 1,
              command: 'INSERT',
              oid: 0,
              fields: [],
            } as any);
          });

          const { createRestaurant } = await import('../services/restaurant.service');

          const results = await Promise.all(
            Array.from({ length: n }, () => createRestaurant(ownerId, { name }))
          );

          const slugs = results.map((r) => r.slug);
          const qrIds = results.map((r) => r.unique_qr_id);

          // All slugs must be unique
          expect(new Set(slugs).size).toBe(n);
          // All unique_qr_ids must be unique
          expect(new Set(qrIds).size).toBe(n);
        }
      ),
      { numRuns: 100 }
    );
  });
});
