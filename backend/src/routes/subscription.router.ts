import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/requireRole';
import { createSubscription, getMySubscription, listSubscriptions, approveSubscription, rejectSubscription, Plan } from '../services/subscription.service';

const router = Router();

const VALID_PLANS: Plan[] = ['professional', 'growing', 'enterprise'];

// Owner: submit a plan
router.post('/', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  const { plan } = req.body;
  if (!VALID_PLANS.includes(plan)) {
    return res.status(400).json({ error: { code: 'INVALID_PLAN', message: 'Invalid plan.' } });
  }
  try {
    const sub = await createSubscription(req.user!.id, plan);
    return res.status(201).json(sub);
  } catch {
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } });
  }
});

// Owner: get my subscription
router.get('/me', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  try {
    const sub = await getMySubscription(req.user!.id);
    return res.json(sub ?? null);
  } catch {
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } });
  }
});

// Super admin: list all subscriptions
router.get('/', authenticate, requireRole('super_admin'), async (_req: Request, res: Response) => {
  try {
    const subs = await listSubscriptions();
    return res.json(subs);
  } catch {
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } });
  }
});

// Super admin: approve
router.patch('/:id/approve', authenticate, requireRole('super_admin'), async (req: Request, res: Response) => {
  try {
    const sub = await approveSubscription(req.params.id, req.user!.id);
    return res.json(sub);
  } catch (err: unknown) {
    const e = err as { statusCode?: number; message?: string };
    return res.status(e.statusCode ?? 500).json({ error: { message: e.message } });
  }
});

// Super admin: reject
router.patch('/:id/reject', authenticate, requireRole('super_admin'), async (req: Request, res: Response) => {
  try {
    const sub = await rejectSubscription(req.params.id, req.user!.id, req.body.notes);
    return res.json(sub);
  } catch (err: unknown) {
    const e = err as { statusCode?: number; message?: string };
    return res.status(e.statusCode ?? 500).json({ error: { message: e.message } });
  }
});

export default router;
