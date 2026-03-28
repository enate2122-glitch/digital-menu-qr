import 'dotenv/config';
import bcrypt from 'bcrypt';
import pool from '../db/pool';

async function createAdmin() {
  const email = 'menu@admin.com';
  const password = '0934942672';
  const hash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, 'super_admin')
     ON CONFLICT (email) DO UPDATE SET password_hash = $2, role = 'super_admin', status = 'active'`,
    [email, hash]
  );

  console.log(`Super admin created: ${email}`);
  await pool.end();
}

createAdmin().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
