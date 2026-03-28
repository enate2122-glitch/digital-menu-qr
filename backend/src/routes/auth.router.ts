import { Router, Request, Response } from 'express';
import { loginUser, registerOwner, listOwners, deactivateOwner } from '../services/auth.service';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
    });
  }

  try {
    const result = await loginUser(email, password);
    return res.status(200).json(result);
  } catch (err: unknown) {
    const e = err as { code?: string; statusCode?: number; message?: string };

    if (e.statusCode === 403) {
      return res.status(403).json({
        error: { code: e.code ?? 'ACCOUNT_INACTIVE', message: e.message ?? 'Account is inactive.' },
      });
    }

    // 401 for invalid credentials — generic message to avoid user enumeration
    return res.status(401).json({
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
    });
  }
});

router.get('/users', authenticate, requireRole('super_admin'), async (_req: Request, res: Response) => {
  try {
    const owners = await listOwners();
    return res.status(200).json(owners);
  } catch {
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' },
    });
  }
});

router.post('/register', authenticate, requireRole('super_admin'), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: { code: 'MISSING_FIELDS', message: 'email and password are required.' },
    });
  }

  try {
    const user = await registerOwner(email, password);
    return res.status(201).json(user);
  } catch (err: unknown) {
    const e = err as { code?: string; statusCode?: number; message?: string };

    if (e.statusCode === 409) {
      return res.status(409).json({
        error: { code: e.code ?? 'EMAIL_EXISTS', message: e.message ?? 'Email already exists.' },
      });
    }

    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' },
    });
  }
});

router.patch('/users/:id/deactivate', authenticate, requireRole('super_admin'), async (req: Request, res: Response) => {
  try {
    await deactivateOwner(req.params.id);
    return res.status(200).json({ message: 'User deactivated.' });
  } catch (err: unknown) {
    const e = err as { code?: string; statusCode?: number; message?: string };

    if (e.statusCode === 404) {
      return res.status(404).json({
        error: { code: e.code ?? 'USER_NOT_FOUND', message: e.message ?? 'User not found.' },
      });
    }

    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' },
    });
  }
});

export default router;
