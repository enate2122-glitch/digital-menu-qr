import 'dotenv/config';
import pool from '../db/pool';
import { v4 as uuidv4 } from 'uuid';

const EMAIL = 'amour@owner.com';

const MENU: Record<string, { item: string; price: number }[]> = {
  'Burger': [
    { item: 'King Size Burger', price: 500 },
    { item: 'Special Burger', price: 450 },
    { item: 'Cheese Burger', price: 400 },
    { item: 'Normal Burger', price: 400 },
    { item: 'Chips', price: 250 },
    { item: 'Fasting Burger', price: 350 },
  ],
  'Pizza & More': [
    { item: 'Volcano Pizza', price: 580 },
    { item: 'Special Pizza', price: 530 },
    { item: 'Chicken Pizza', price: 550 },
    { item: 'Chicken with Tuna Pizza', price: 550 },
    { item: 'Tuna Pizza', price: 500 },
    { item: 'V/G Pizza', price: 450 },
    { item: 'Beef Pizza', price: 430 },
    { item: 'Margarita Pizza', price: 400 },
    { item: 'Mixed Salad', price: 300 },
    { item: 'Rice with Meat', price: 300 },
    { item: 'Special Fexira', price: 300 },
    { item: 'Fasting Fexira', price: 250 },
    { item: 'Special Rap', price: 400 },
    { item: 'Vegetables Rap', price: 300 },
  ],
  'Sandwich': [
    { item: 'Club Sandwich', price: 400 },
    { item: 'Chicken Sandwich', price: 300 },
    { item: 'V/G Sandwich', price: 200 },
    { item: 'Tuna Sandwich', price: 300 },
    { item: 'Egg Sandwich', price: 250 },
    { item: 'Special Sandwich', price: 300 },
    { item: 'Fish Sandwich', price: 200 },
  ],
  'Breakfast': [
    { item: 'Normal Full', price: 200 },
    { item: 'Normal Firfir', price: 200 },
    { item: 'Full with Avocado', price: 230 },
    { item: 'Special Full', price: 250 },
    { item: 'Egg with Avocado', price: 220 },
    { item: 'Egg Silsie', price: 180 },
    { item: 'Egg Firfir', price: 180 },
    { item: 'Beef Firfir', price: 350 },
    { item: 'Kuanta Firfir', price: 300 },
    { item: 'V/G Pasta', price: 200 },
    { item: 'Fried Vegetables', price: 250 },
    { item: 'Rice Beef', price: 300 },
    { item: 'Pasta Tuna', price: 300 },
    { item: 'Pasta with Tomato', price: 200 },
    { item: 'Special Firfir', price: 350 },
    { item: 'Special Chechebsa', price: 250 },
    { item: 'Fasting Chechebsa', price: 200 },
  ],
  'Juice': [
    { item: 'Special Juice', price: 200 },
    { item: 'Avocado Juice', price: 180 },
    { item: 'Papaye Juice', price: 150 },
    { item: 'Mango Juice', price: 180 },
    { item: 'Spruce Juice', price: 150 },
  ],
  'Hot Drink': [
    { item: 'Tea', price: 20 },
    { item: 'Milk Coffee', price: 60 },
    { item: 'Macchiato', price: 60 },
    { item: 'Milk', price: 50 },
    { item: 'Lawez with Coffee', price: 80 },
    { item: 'Lawez with Keshr', price: 80 },
    { item: 'Lawez with Tea', price: 70 },
    { item: 'Lawez', price: 70 },
    { item: 'Coffee', price: 30 },
    { item: 'Fasting Macchiato', price: 50 },
    { item: 'Yetimemue', price: 70 },
    { item: 'Lemon Tea', price: 20 },
    { item: 'Orange Tea', price: 70 },
    { item: 'Mango Tea', price: 70 },
    { item: 'Ananas Tea', price: 70 },
    { item: 'Keshr', price: 30 },
    { item: 'Spruce Tea', price: 60 },
    { item: 'Special Tea Big', price: 100 },
    { item: 'Special Tea Small', price: 70 },
    { item: 'Cappuccino', price: 70 },
  ],
  'Drinks & Other': [
    { item: 'Soft Drink', price: 50 },
    { item: 'Ambo Water', price: 50 },
    { item: 'Novida', price: 60 },
    { item: '1/2 L H2O', price: 30 },
    { item: '1 L H2O', price: 40 },
    { item: '2 L H2O', price: 50 },
    { item: 'Extra Egg', price: 35 },
    { item: 'Extra Monese', price: 40 },
    { item: 'Extra Kachup', price: 40 },
    { item: 'Extra Bread', price: 20 },
    { item: 'Injera', price: 20 },
  ],
};

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Find user
    const userRes = await client.query(
      'SELECT id FROM users WHERE email = $1', [EMAIL]
    );
    if (userRes.rows.length === 0) {
      throw new Error(`User not found: ${EMAIL}`);
    }
    const ownerId = userRes.rows[0].id;
    console.log(`✅ Found user: ${EMAIL} (${ownerId})`);

    // 2. Check for existing restaurant, delete if present to start fresh
    const existingRest = await client.query(
      'SELECT id FROM restaurants WHERE owner_id = $1 AND name = $2',
      [ownerId, 'Happy Pizza & Burger']
    );
    if (existingRest.rows.length > 0) {
      const restId = existingRest.rows[0].id;
      await client.query('DELETE FROM restaurants WHERE id = $1', [restId]);
      console.log('🗑️  Removed existing restaurant to re-seed cleanly.');
    }

    // 3. Create restaurant
    const slug = 'happy-pizza-burger-' + uuidv4().slice(0, 8);
    const uniqueQrId = uuidv4();
    const restRes = await client.query(
      `INSERT INTO restaurants (owner_id, name, slug, unique_qr_id, menu_theme)
       VALUES ($1, $2, $3, $4, 'elegant')
       RETURNING id`,
      [ownerId, 'Happy Pizza & Burger', slug, uniqueQrId]
    );
    const restaurantId = restRes.rows[0].id;
    console.log(`🏪 Created restaurant: Happy Pizza & Burger (${restaurantId})`);

    // 4. Create categories + items
    let catOrder = 0;
    let totalItems = 0;
    for (const [catName, items] of Object.entries(MENU)) {
      const catRes = await client.query(
        `INSERT INTO categories (restaurant_id, name, display_order)
         VALUES ($1, $2, $3) RETURNING id`,
        [restaurantId, catName, catOrder++]
      );
      const categoryId = catRes.rows[0].id;

      let itemOrder = 0;
      for (const { item, price } of items) {
        await client.query(
          `INSERT INTO menu_items (category_id, name, price, is_available, display_order)
           VALUES ($1, $2, $3, true, $4)`,
          [categoryId, item, price, itemOrder++]
        );
        totalItems++;
      }
      console.log(`  📂 ${catName}: ${items.length} items`);
    }

    await client.query('COMMIT');
    console.log(`\n✅ Done! ${totalItems} items across ${Object.keys(MENU).length} categories.`);
    console.log(`🔗 Menu URL: /menu/${uniqueQrId}`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
