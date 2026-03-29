import { query } from '../db';

export type Plan = 'professional' | 'growing' | 'enterprise';
export type SubStatus = 'pending' | 'active' | 'rejected' | 'cancelled';

export interface Subscription {
  id: string;
  user_id: string;
  plan: Plan;
  status: SubStatus;
  created_at: Date;
  approved_at: Date | null;
  approved_by: string | null;
  notes: string | null;
  email?: string;
}

export async function createSubscription(userId: string, plan: Plan): Promise<Subscription> {
  // Cancel any existing pending/active sub first
  await query(`UPDATE subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status IN ('pending','active')`, [userId]);
  const res = await query<Subscription>(
    `INSERT INTO subscriptions (user_id, plan) VALUES ($1, $2) RETURNING *`,
    [userId, plan]
  );
  return res.rows[0];
}

export async function getMySubscription(userId: string): Promise<Subscription | null> {
  const res = await query<Subscription>(
    `SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  return res.rows[0] ?? null;
}

export async function listSubscriptions(): Promise<Subscription[]> {
  const res = await query<Subscription>(
    `SELECT s.*, u.email FROM subscriptions s JOIN users u ON u.id = s.user_id ORDER BY s.created_at DESC`,
    []
  );
  return res.rows;
}

export async function approveSubscription(subId: string, adminId: string): Promise<Subscription> {
  const res = await query<Subscription>(
    `UPDATE subscriptions SET status = 'active', approved_at = now(), approved_by = $2 WHERE id = $1 RETURNING *`,
    [subId, adminId]
  );
  if (!res.rows[0]) throw Object.assign(new Error('Subscription not found.'), { statusCode: 404 });
  return res.rows[0];
}

export async function rejectSubscription(subId: string, adminId: string, notes?: string): Promise<Subscription> {
  const res = await query<Subscription>(
    `UPDATE subscriptions SET status = 'rejected', approved_by = $2, notes = $3 WHERE id = $1 RETURNING *`,
    [subId, adminId, notes ?? null]
  );
  if (!res.rows[0]) throw Object.assign(new Error('Subscription not found.'), { statusCode: 404 });
  return res.rows[0];
}
