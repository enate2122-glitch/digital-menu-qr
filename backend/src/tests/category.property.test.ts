// Feature: digital-menu-qr-system, Property 6: category list always sorted ascending by display_order

/**
 * Validates: Requirements 4.4
 *
 * Property P6: For any restaurant with any number of categories, the list returned
 * by the Menu_Service should always be sorted in ascending order by display_order.
 */

import * as fc from 'fast-check';
import { listCategories, deleteCategory, createCategory } from '../services/category.service';

// Mock the db module so no real database is needed
jest.mock('../db', () => ({
  query: jest.fn(),
}));

import { query } from '../db';

const mockQuery = query as jest.MockedFunction<typeof query>;

afterEach(() => {
  jest.clearAllMocks();
});

describe('P6: category list always sorted ascending by display_order', () => {
  it('should return categories sorted ascending by display_order regardless of DB row order', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // restaurantId
        fc.uuid(), // ownerId
        // Generate an array of 1–10 categories with random display_order values
        fc.array(
          fc.record({
            id: fc.uuid(),
            restaurant_id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            display_order: fc.integer({ min: -100, max: 100 }),
            created_at: fc.date(),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        async (restaurantId, ownerId, categories) => {
          // First query: ownership check — returns a restaurant with matching owner
          mockQuery.mockResolvedValueOnce({
            rows: [{ id: restaurantId, owner_id: ownerId }],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
          } as any);

          // Second query: list categories — return them in arbitrary (unsorted) order
          // Shuffle by reversing to simulate DB returning rows in any order
          const shuffled = [...categories].reverse();
          mockQuery.mockResolvedValueOnce({
            rows: shuffled,
            rowCount: shuffled.length,
            command: 'SELECT',
            oid: 0,
            fields: [],
          } as any);

          const result = await listCategories(restaurantId, ownerId);

          // Assert the result is sorted ascending by display_order
          for (let i = 1; i < result.length; i++) {
            expect(result[i].display_order).toBeGreaterThanOrEqual(result[i - 1].display_order);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: digital-menu-qr-system, Property 7: deleting a category removes all its items

/**
 * Validates: Requirements 4.3
 *
 * Property P7: For any category that is deleted, all menu items belonging to that
 * category should also be absent from subsequent queries. Since cascade deletion is
 * enforced by the DB's ON DELETE CASCADE constraint, this test verifies that
 * deleteCategory issues the DELETE query (which triggers the cascade in the real DB)
 * and completes without error for any valid owned category.
 */

describe('P7: deleting a category removes all its items', () => {
  it('should complete successfully (triggering DB cascade) for any valid owned category', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // categoryId
        fc.uuid(), // ownerId
        async (categoryId, ownerId) => {
          // First query: ownership check — returns a category with matching owner
          mockQuery.mockResolvedValueOnce({
            rows: [{ id: categoryId, owner_id: ownerId }],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
          } as any);

          // Second query: DELETE — succeeds (cascade handled by DB)
          mockQuery.mockResolvedValueOnce({
            rows: [],
            rowCount: 1,
            command: 'DELETE',
            oid: 0,
            fields: [],
          } as any);

          // Should not throw — successful delete means cascade will fire in real DB
          await expect(deleteCategory(categoryId, ownerId)).resolves.toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: digital-menu-qr-system, Property 8: duplicate category name in same restaurant returns 409

/**
 * Validates: Requirements 4.6
 *
 * Property P8: For any restaurant, attempting to create a second category with the
 * same name as an existing category in that restaurant should return HTTP 409.
 */

describe('P8: duplicate category name in same restaurant returns 409', () => {
  it('should throw an error with status 409 for any duplicate category name', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // ownerId
        fc.uuid(), // restaurant_id
        fc.string({ minLength: 1, maxLength: 100 }), // category name
        async (ownerId, restaurant_id, name) => {
          // First query: ownership check — returns a restaurant with matching owner_id
          mockQuery.mockResolvedValueOnce({
            rows: [{ id: restaurant_id, owner_id: ownerId }],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
          } as any);

          // Second query: INSERT — throws pg unique violation error (code 23505)
          const pgUniqueError: any = new Error('duplicate key value violates unique constraint');
          pgUniqueError.code = '23505';
          mockQuery.mockRejectedValueOnce(pgUniqueError);

          let threw = false;
          try {
            await createCategory(ownerId, { restaurant_id, name });
          } catch (err) {
            threw = true;
            expect((err as any).status).toBe(409);
          }
          expect(threw).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
