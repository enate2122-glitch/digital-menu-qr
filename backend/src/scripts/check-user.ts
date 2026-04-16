import 'dotenv/config';
import pool from '../db/pool';

async function main() {
  const email = 'amour@owner.com';

  const userRes = await pool.query(
    'SELECT id, email, role, status, created_at FROM users WHERE email = $1',
    [email]
  );

  if (userRes.rows.length === 0) {
    console.log('❌ User not found:', email);
    process.exit(0);
  }

  const user = userRes.rows[0];
  console.log('\n✅ User found:');
  console.table(user);

  const subRes = await pool.query(
    `SELECT plan, status, created_at, approved_at, notes
     FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC`,
    [user.id]
  );

  if (subRes.rows.length === 0) {
    console.log('\n⚠️  No subscriptions found for this user.');
  } else {
    console.log('\n📋 Subscriptions:');
    console.table(subRes.rows);
  }

  const restRes = await pool.query(
    'SELECT id, name, slug, menu_theme, created_at FROM restaurants WHERE owner_id = $1',
    [user.id]
  );

  if (restRes.rows.length === 0) {
    console.log('\n⚠️  No restaurants found for this user.');
  } else {
    console.log('\n🏪 Restaurants:');
    console.table(restRes.rows);
  }

  await pool.end();
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
