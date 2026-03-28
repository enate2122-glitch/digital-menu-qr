import { query } from '../db';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: string;
  image_url: string | null;
  is_available: boolean;
}

interface Category {
  id: string;
  name: string;
  display_order: number;
  items: MenuItem[];
}

interface PublicMenuResult {
  restaurant: {
    name: string;
    logo_url: string | null;
    primary_color: string | null;
  };
  categories: Category[];
}

export async function getPublicMenu(uniqueQrId: string): Promise<PublicMenuResult | null> {
  // Fetch restaurant by unique_qr_id
  const restaurantResult = await query<{
    id: string;
    name: string;
    logo_url: string | null;
    primary_color: string | null;
  }>(
    'SELECT id, name, logo_url, primary_color FROM restaurants WHERE unique_qr_id = $1',
    [uniqueQrId]
  );

  if (restaurantResult.rows.length === 0) {
    return null;
  }

  const restaurant = restaurantResult.rows[0];

  // Fetch all categories for this restaurant sorted by display_order
  const categoriesResult = await query<{ id: string; name: string; display_order: number }>(
    'SELECT id, name, display_order FROM categories WHERE restaurant_id = $1 ORDER BY display_order ASC',
    [restaurant.id]
  );

  const categories: Category[] = [];

  if (categoriesResult.rows.length > 0) {
    const categoryIds = categoriesResult.rows.map((c) => c.id);

    // Fetch all menu items for these categories sorted by display_order
    const placeholders = categoryIds.map((_, i) => `$${i + 1}`).join(', ');
    const itemsResult = await query<{
      id: string;
      category_id: string;
      name: string;
      description: string | null;
      price: string;
      image_url: string | null;
      is_available: boolean;
      display_order: number;
    }>(
      `SELECT id, category_id, name, description, price, image_url, is_available, display_order
       FROM menu_items
       WHERE category_id IN (${placeholders})
       ORDER BY display_order ASC`,
      categoryIds
    );

    // Group items by category_id
    const itemsByCategory = new Map<string, MenuItem[]>();
    for (const item of itemsResult.rows) {
      const list = itemsByCategory.get(item.category_id) ?? [];
      list.push({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.image_url,
        is_available: item.is_available,
      });
      itemsByCategory.set(item.category_id, list);
    }

    for (const cat of categoriesResult.rows) {
      categories.push({
        id: cat.id,
        name: cat.name,
        display_order: cat.display_order,
        items: itemsByCategory.get(cat.id) ?? [],
      });
    }
  }

  return {
    restaurant: {
      name: restaurant.name,
      logo_url: restaurant.logo_url,
      primary_color: restaurant.primary_color,
    },
    categories,
  };
}
