import 'dotenv/config';
import pool from '../db/pool';

async function main() {
  const client = await pool.connect();
  try {
    // User
    const userRes = await client.query(
      'SELECT id, email, role, status FROM users WHERE email = $1',
      ['amour@owner.com']
    );
    const user = userRes.rows[0];
    if (!user) { console.log('❌ User not found'); return; }
    console.log('\n✅ User:', user.email, '| role:', user.role, '| status:', user.status);

    // Subscription
    const subRes = await client.query(
      'SELECT plan, status FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );
    const sub = subRes.rows[0];
    console.log('📋 Subscription:', sub ? `${sub.plan} (${sub.status})` : 'NONE');

    // Restaurant
    const restRes = await client.query(
      'SELECT id, name, unique_qr_id, menu_theme FROM restaurants WHERE owner_id = $1',
      [user.id]
    );
    const rest = restRes.rows[0];
    if (!rest) { console.log('❌ No restaurant found'); return; }
    console.log('\n🏪 Restaurant:', rest.name);
    console.log('   Theme:', rest.menu_theme);
    console.log('   Menu URL: /menu/' + rest.unique_qr_id);

    // Categories + item counts
    const catRes = await client.query(
      'SELECT id, name, display_order FROM categories WHERE restaurant_id = $1 ORDER BY display_order',
      [rest.id]
    );
    console.log(`\n📂 ${catRes.rows.length} categories:`);
    let total = 0;
    for (const cat of catRes.rows) {
      const itemRes = await client.query(
        'SELECT COUNT(*) as count FROM menu_items WHERE category_id = $1',
        [cat.id]
      );
      const count = Number(itemRes.rows[0].count);
      total += count;
      console.log(`   ${cat.display_order + 1}. ${cat.name}: ${count} items`);
    }
    console.log(`\n✅ Total items: ${total}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
