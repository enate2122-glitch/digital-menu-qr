import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';

export interface RestaurantRecord {
  id: string;
  owner_id: string;
  name: string;
  address: string | null;
  logo_url: string | null;
  primary_color: string | null;
  slug: string;
  unique_qr_id: string;
  created_at: Date;
}

export interface CreateRestaurantData {
  name: string;
  address?: string;
  logo_url?: string;
  primary_color?: string;
}

export async function createRestaurant(
  ownerId: string,
  data: CreateRestaurantData
): Promise<RestaurantRecord> {
  const slugBase = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const slug = slugBase + '-' + uuidv4().slice(0, 8);
  const unique_qr_id = uuidv4();

  const result = await query<RestaurantRecord>(
    'INSERT INTO restaurants (owner_id, name, address, logo_url, primary_color, slug, unique_qr_id) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7) ' +
    'RETURNING id, owner_id, name, address, logo_url, primary_color, slug, unique_qr_id, created_at',
    [ownerId, data.name, data.address ?? null, data.logo_url ?? null, data.primary_color ?? null, slug, unique_qr_id]
  );

  return result.rows[0];
}

export async function listRestaurants(ownerId: string): Promise<RestaurantRecord[]> {
  const result = await query<RestaurantRecord>(
    'SELECT id, owner_id, name, address, logo_url, primary_color, slug, unique_qr_id, created_at ' +
    'FROM restaurants WHERE owner_id = $1 ORDER BY created_at ASC',
    [ownerId]
  );
  return result.rows;
}

export async function getRestaurant(
  restaurantId: string,
  ownerId: string
): Promise<RestaurantRecord> {
  const result = await query<RestaurantRecord>(
    'SELECT id, owner_id, name, address, logo_url, primary_color, slug, unique_qr_id, created_at ' +
    'FROM restaurants WHERE id = $1',
    [restaurantId]
  );

  if (result.rows.length === 0) {
    const err: any = new Error('Restaurant not found.');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  const restaurant = result.rows[0];
  if (restaurant.owner_id !== ownerId) {
    const err: any = new Error('Access forbidden.');
    err.status = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  return restaurant;
}

export async function updateRestaurant(
  restaurantId: string,
  ownerId: string,
  data: Partial<CreateRestaurantData>
): Promise<RestaurantRecord> {
  const existing = await query<RestaurantRecord>(
    'SELECT id, owner_id FROM restaurants WHERE id = $1',
    [restaurantId]
  );

  if (existing.rows.length === 0) {
    const err: any = new Error('Restaurant not found.');
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

  const allowedFields: Array<keyof CreateRestaurantData> = ['name', 'address', 'logo_url', 'primary_color'];
  const setClauses: string[] = [];
  const values: unknown[] = [];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      values.push(data[field]);
      setClauses.push(field + ' = $' + String(values.length));
    }
  }

  if (setClauses.length === 0) {
    const current = await query<RestaurantRecord>(
      'SELECT id, owner_id, name, address, logo_url, primary_color, slug, unique_qr_id, created_at ' +
      'FROM restaurants WHERE id = $1',
      [restaurantId]
    );
    return current.rows[0];
  }

  values.push(restaurantId);
  const sql =
    'UPDATE restaurants SET ' + setClauses.join(', ') +
    ' WHERE id = $' + String(values.length) +
    ' RETURNING id, owner_id, name, address, logo_url, primary_color, slug, unique_qr_id, created_at';

  const result = await query<RestaurantRecord>(sql, values);
  return result.rows[0];
}
