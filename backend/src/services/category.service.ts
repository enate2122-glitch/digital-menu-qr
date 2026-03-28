import { query } from '../db';

export interface CategoryRecord {
  id: string;
  restaurant_id: string;
  name: string;
  display_order: number;
  created_at: Date;
}

export async function createCategory(
  ownerId: string,
  data: { restaurant_id: string; name: string; display_order?: number }
): Promise<CategoryRecord> {
  // Verify restaurant ownership
  const restaurantResult = await query<{ id: string; owner_id: string }>(
    'SELECT id, owner_id FROM restaurants WHERE id = $1',
    [data.restaurant_id]
  );

  if (restaurantResult.rows.length === 0) {
    const err: any = new Error('Restaurant not found.');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  if (restaurantResult.rows[0].owner_id !== ownerId) {
    const err: any = new Error('Access forbidden.');
    err.status = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  try {
    const result = await query<CategoryRecord>(
      'INSERT INTO categories (restaurant_id, name, display_order) ' +
      'VALUES ($1, $2, $3) ' +
      'RETURNING id, restaurant_id, name, display_order, created_at',
      [data.restaurant_id, data.name, data.display_order ?? 0]
    );
    return result.rows[0];
  } catch (err: any) {
    if (err.code === '23505') {
      const conflict: any = new Error('A category with that name already exists in this restaurant.');
      conflict.status = 409;
      conflict.code = 'CONFLICT';
      throw conflict;
    }
    throw err;
  }
}

export async function updateCategory(
  categoryId: string,
  ownerId: string,
  data: { name?: string; display_order?: number }
): Promise<CategoryRecord> {
  // Fetch category and verify ownership via join
  const existing = await query<CategoryRecord & { owner_id: string }>(
    'SELECT c.*, r.owner_id FROM categories c JOIN restaurants r ON r.id = c.restaurant_id WHERE c.id = $1',
    [categoryId]
  );

  if (existing.rows.length === 0) {
    const err: any = new Error('Category not found.');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  if (existing.rows[0].owner_id !== ownerId) {
    const err: any = new Error('Access forbidden.');
    err.status = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  const current = existing.rows[0];
  const newName = data.name ?? current.name;
  const newOrder = data.display_order ?? current.display_order;

  try {
    const result = await query<CategoryRecord>(
      'UPDATE categories SET name = $1, display_order = $2 WHERE id = $3 ' +
      'RETURNING id, restaurant_id, name, display_order, created_at',
      [newName, newOrder, categoryId]
    );
    return result.rows[0];
  } catch (err: any) {
    if (err.code === '23505') {
      const conflict: any = new Error('A category with that name already exists in this restaurant.');
      conflict.status = 409;
      conflict.code = 'CONFLICT';
      throw conflict;
    }
    throw err;
  }
}

export async function deleteCategory(categoryId: string, ownerId: string): Promise<void> {
  // Fetch category and verify ownership via join
  const existing = await query<{ id: string; owner_id: string }>(
    'SELECT c.id, r.owner_id FROM categories c JOIN restaurants r ON r.id = c.restaurant_id WHERE c.id = $1',
    [categoryId]
  );

  if (existing.rows.length === 0) {
    const err: any = new Error('Category not found.');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  if (existing.rows[0].owner_id !== ownerId) {
    const err: any = new Error('Access forbidden.');
    err.status = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  // Cascade delete of menu_items is handled by DB ON DELETE CASCADE
  await query('DELETE FROM categories WHERE id = $1', [categoryId]);
}

export async function listCategories(restaurantId: string, ownerId: string): Promise<CategoryRecord[]> {
  // Verify restaurant ownership
  const restaurant = await query<{ id: string; owner_id: string }>(
    'SELECT id, owner_id FROM restaurants WHERE id = $1',
    [restaurantId]
  );

  if (restaurant.rows.length === 0) {
    const err: any = new Error('Restaurant not found.');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  if (restaurant.rows[0].owner_id !== ownerId) {
    const err: any = new Error('Access forbidden.');
    err.status = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  const result = await query<CategoryRecord>(
    'SELECT id, restaurant_id, name, display_order, created_at FROM categories WHERE restaurant_id = $1 ORDER BY display_order ASC',
    [restaurantId]
  );

  return result.rows.slice().sort((a, b) => a.display_order - b.display_order);
}
