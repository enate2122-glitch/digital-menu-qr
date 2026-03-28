import { query } from '../db';

export interface MenuItemRecord {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
  created_at: Date;
}

async function verifyItemOwnership(itemId: string, ownerId: string): Promise<MenuItemRecord> {
  const result = await query<MenuItemRecord & { owner_id: string }>(
    `SELECT mi.*, r.owner_id
     FROM menu_items mi
     JOIN categories c ON c.id = mi.category_id
     JOIN restaurants r ON r.id = c.restaurant_id
     WHERE mi.id = $1`,
    [itemId]
  );

  if (result.rows.length === 0) {
    const err: any = new Error('Menu item not found.');
    err.status = 404;
    throw err;
  }

  if (result.rows[0].owner_id !== ownerId) {
    const err: any = new Error('Access forbidden.');
    err.status = 403;
    throw err;
  }

  return result.rows[0];
}

async function verifyCategoryOwnership(categoryId: string, ownerId: string): Promise<void> {
  const result = await query<{ id: string; owner_id: string }>(
    `SELECT c.id, r.owner_id
     FROM categories c
     JOIN restaurants r ON r.id = c.restaurant_id
     WHERE c.id = $1`,
    [categoryId]
  );

  if (result.rows.length === 0) {
    const err: any = new Error('Category not found.');
    err.status = 404;
    throw err;
  }

  if (result.rows[0].owner_id !== ownerId) {
    const err: any = new Error('Access forbidden.');
    err.status = 403;
    throw err;
  }
}

export async function createMenuItem(
  ownerId: string,
  data: {
    category_id: string;
    name: string;
    price: number;
    description?: string;
    image_url?: string;
    is_available?: boolean;
    display_order?: number;
  }
): Promise<MenuItemRecord> {
  if (data.price < 0) {
    const err: any = new Error('Price must be greater than or equal to 0.');
    err.status = 422;
    throw err;
  }

  await verifyCategoryOwnership(data.category_id, ownerId);

  const result = await query<MenuItemRecord>(
    `INSERT INTO menu_items (category_id, name, description, price, image_url, is_available, display_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, category_id, name, description, price, image_url, is_available, display_order, created_at`,
    [
      data.category_id,
      data.name,
      data.description ?? null,
      data.price,
      data.image_url ?? null,
      data.is_available ?? true,
      data.display_order ?? 0,
    ]
  );

  return result.rows[0];
}

export async function updateMenuItem(
  itemId: string,
  ownerId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    image_url?: string;
    is_available?: boolean;
    display_order?: number;
  }
): Promise<MenuItemRecord> {
  if (data.price !== undefined && data.price < 0) {
    const err: any = new Error('Price must be greater than or equal to 0.');
    err.status = 422;
    throw err;
  }

  const current = await verifyItemOwnership(itemId, ownerId);

  const result = await query<MenuItemRecord>(
    `UPDATE menu_items
     SET name = $1, description = $2, price = $3, image_url = $4,
         is_available = $5, display_order = $6
     WHERE id = $7
     RETURNING id, category_id, name, description, price, image_url, is_available, display_order, created_at`,
    [
      data.name ?? current.name,
      data.description !== undefined ? data.description : current.description,
      data.price !== undefined ? data.price : current.price,
      data.image_url !== undefined ? data.image_url : current.image_url,
      data.is_available !== undefined ? data.is_available : current.is_available,
      data.display_order !== undefined ? data.display_order : current.display_order,
      itemId,
    ]
  );

  return result.rows[0];
}

export async function deleteMenuItem(itemId: string, ownerId: string): Promise<void> {
  await verifyItemOwnership(itemId, ownerId);
  await query('DELETE FROM menu_items WHERE id = $1', [itemId]);
}

export async function listMenuItems(categoryId: string, ownerId: string): Promise<MenuItemRecord[]> {
  await verifyCategoryOwnership(categoryId, ownerId);

  const result = await query<MenuItemRecord>(
    `SELECT id, category_id, name, description, price, image_url, is_available, display_order, created_at
     FROM menu_items
     WHERE category_id = $1
     ORDER BY display_order ASC`,
    [categoryId]
  );

  return result.rows.slice().sort((a, b) => a.display_order - b.display_order);
}
