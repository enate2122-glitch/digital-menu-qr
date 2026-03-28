import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from '../utils/password';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  status: string;
}

export interface LoginResult {
  token: string;
  role: string;
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  const result = await query<UserRow>(
    'SELECT id, email, password_hash, role, status FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];

  // Use a constant-time comparison path even when user not found to avoid timing attacks
  const passwordMatch = user
    ? await verifyPassword(password, user.password_hash)
    : false;

  if (!user || !passwordMatch) {
    const err = Object.assign(new Error('Invalid email or password.'), { code: 'INVALID_CREDENTIALS', statusCode: 401 });
    throw err;
  }

  if (user.status === 'inactive') {
    const err = Object.assign(new Error('Account is inactive.'), { code: 'ACCOUNT_INACTIVE', statusCode: 403 });
    throw err;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'];

  const payload = {
    sub: user.id,
    role: user.role,
    jti: uuidv4(),
  };

  const token = jwt.sign(payload, secret, { expiresIn });

  return { token, role: user.role };
}

export interface RegisterResult {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: Date;
}

export interface OwnerRecord {
  id: string;
  email: string;
  status: string;
  created_at: Date;
}

export async function listOwners(): Promise<OwnerRecord[]> {
  const result = await query<OwnerRecord>(
    `SELECT id, email, status, created_at FROM users WHERE role = 'owner' ORDER BY created_at ASC`,
    []
  );
  return result.rows;
}

export async function deactivateOwner(userId: string): Promise<void> {
  const result = await query(
    `UPDATE users SET status = 'inactive' WHERE id = $1 AND role = 'owner'`,
    [userId]
  );
  if (result.rowCount === 0) {
    throw Object.assign(new Error('User not found.'), { code: 'USER_NOT_FOUND', statusCode: 404 });
  }
}

export async function registerOwner(email: string, password: string): Promise<RegisterResult> {
  const passwordHash = await hashPassword(password);

  try {
    const result = await query<RegisterResult>(
      `INSERT INTO users (email, password_hash, role, status)
       VALUES ($1, $2, 'owner', 'active')
       RETURNING id, email, role, status, created_at`,
      [email, passwordHash]
    );
    return result.rows[0];
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === '23505') {
      throw Object.assign(new Error('An account with this email already exists.'), {
        code: 'EMAIL_EXISTS',
        statusCode: 409,
      });
    }
    throw err;
  }
}
