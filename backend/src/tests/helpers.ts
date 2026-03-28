import { randomUUID } from 'crypto';

export interface TestUser {
  id: string;
  email: string;
  password_hash: string;
  role: 'super_admin' | 'owner';
  status: 'active' | 'inactive';
  created_at: Date;
}

export interface TestRestaurant {
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

export interface TestCategory {
  id: string;
  restaurant_id: string;
  name: string;
  display_order: number;
  created_at: Date;
}

export interface TestMenuItem {
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

export function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
  return {
    id: randomUUID(),
    email: `user-${randomUUID()}@example.com`,
    password_hash: '$2b$12$defaulthashedpasswordvalue.placeholder',
    role: 'owner',
    status: 'active',
    created_at: new Date(),
    ...overrides,
  };
}

export function createTestRestaurant(overrides: Partial<TestRestaurant> = {}): TestRestaurant {
  const id = randomUUID();
  return {
    id,
    owner_id: randomUUID(),
    name: `Restaurant ${id.slice(0, 8)}`,
    address: '123 Main St',
    logo_url: null,
    primary_color: '#FF5733',
    slug: `restaurant-${id.slice(0, 8)}`,
    unique_qr_id: randomUUID(),
    created_at: new Date(),
    ...overrides,
  };
}

export function createTestCategory(overrides: Partial<TestCategory> = {}): TestCategory {
  const id = randomUUID();
  return {
    id,
    restaurant_id: randomUUID(),
    name: `Category ${id.slice(0, 8)}`,
    display_order: 0,
    created_at: new Date(),
    ...overrides,
  };
}

export function createTestMenuItem(overrides: Partial<TestMenuItem> = {}): TestMenuItem {
  const id = randomUUID();
  return {
    id,
    category_id: randomUUID(),
    name: `Item ${id.slice(0, 8)}`,
    description: null,
    price: 9.99,
    image_url: null,
    is_available: true,
    display_order: 0,
    created_at: new Date(),
    ...overrides,
  };
}
