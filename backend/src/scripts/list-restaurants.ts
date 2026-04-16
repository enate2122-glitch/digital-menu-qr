import 'dotenv/config';
import pool from '../db/pool';

async function main() {
  const c = await pool.connect();
  try {
    const r = await c.query(
      `SELECT id, name, unique_qr_id, menu_theme FROM restaurants
       WHERE owner_id = (SELECT id FROM users WHERE email = 'amour@owner.com')`
    );
    console.log(`\nFound ${r.rows.length} restaurant(s):\n`);
    for (const rest of r.rows) {
      console.log(`🏪 ${rest.name} | theme: ${rest.menu_theme}`);
      console.log(`   URL: /menu/${rest.unique_qr_id}`);
      const cats = await c.query(
        `SELECT name, (SELECT COUNT(*) FROM menu_items WHERE category_id = categories.id)::int as items
         FROM categories WHERE restaurant_id = $1 ORDER BY display_order`,
        [rest.id]
      );
      if (cats.rows.length === 0) {
        console.log('   ⚠️  No categories');
      } else {
        for (const cat of cats.rows) {
          console.log(`   📂 ${cat.name}: ${cat.items} items`);
        }
      }
      console.log('');
    }
  } finally {
    c.release();
    await pool.end();
  }
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
