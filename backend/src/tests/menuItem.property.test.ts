// Feature: digital-menu-qr-system, Property 9: item list always sorted ascending by display_order

/**
 * Validates: Requirements 5.5
 *
 * Property P9: For any category with any number of menu items, the list returned
 * by the Menu_Service should always be sorted in ascending order by display_order.
 */

import * as fc from 'fast-check';
import { listMenuItems, createMenuItem } from '../services/menuItem.service';

// Mock the db module so no real database is needed
jest.mock('../db', () => ({
  query: jest.fn(),
}));

import { query } from '../db';

const mockQuery = query as jest.MockedFunction<typeof query>;

afterEach(() => {
  jest.clearAllMocks();
});

describe('P9: item list always sorted ascending by display_order', () => {
  it('should return menu items sorted ascending by display_order regardless of DB row order', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // categoryId
        fc.uuid(), // ownerId
        // Generate an array of 1–10 items with random display_order values
        fc.array(
          fc.record({
            id: fc.uuid(),
            category_id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            description: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
            price: fc.float({ min: 0, max: 1000 }),
            image_url: fc.option(fc.webUrl(), { nil: null }),
            is_available: fc.boolean(),
            display_order: fc.integer({ min: -100, max: 100 }),
            created_at: fc.date(),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        async (categoryId, ownerId, items) => {
          // First query: ownership check — returns a category with matching owner
          mockQuery.mockResolvedValueOnce({
            rows: [{ id: categoryId, owner_id: ownerId }],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
          } as any);

          // Second query: list items — return them in arbitrary (reversed) order
          const shuffled = [...items].reverse();
          mockQuery.mockResolvedValueOnce({
            rows: shuffled,
            rowCount: shuffled.length,
            command: 'SELECT',
            oid: 0,
            fields: [],
          } as any);

          const result = await listMenuItems(categoryId, ownerId);

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

// Feature: digital-menu-qr-system, Property 10: price < 0 always returns 422

/**
 * Validates: Requirements 5.7
 *
 * Property P10: For any menu item creation or update request where the submitted
 * price is less than 0, the Menu_Service should return HTTP 422.
 */

describe('P10: price < 0 always returns 422', () => {
  it('createMenuItem should throw an error with status 422 for any negative price', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // ownerId
        fc.uuid(), // category_id
        fc.string({ minLength: 1, maxLength: 100 }), // name
        fc.oneof(
          fc.float({ max: Math.fround(-0.01) }),
          fc.integer({ max: -1 }).map((n) => n as unknown as number)
        ),
        async (ownerId: string, category_id: string, name: string, price: number) => {
          // Precondition: price must be strictly negative
          fc.pre(price < 0);

          let threw = false;
          try {
            await createMenuItem(ownerId, { category_id, name, price });
          } catch (err) {
            threw = true;
            expect((err as any).status).toBe(422);
          }
          expect(threw).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
