import { Router, Request, Response } from 'express';
import { createCategory, updateCategory, deleteCategory } from '../services/category.service';
import { listMenuItems } from '../services/menuItem.service';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.post('/', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  const { restaurant_id, name, display_order } = req.body;

  if (!restaurant_id || !name) {
    return res.status(400).json({
      error: { code: 'MISSING_FIELDS', message: 'restaurant_id and name are required.' },
    });
  }

  try {
    const category = await createCategory(req.user!.id, { restaurant_id, name, display_order });
    return res.status(201).json(category);
  } catch (err: any) {
    if (err.status === 403) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: err.message } });
    }
    if (err.status === 404) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message } });
    }
    if (err.status === 409) {
      return res.status(409).json({ error: { code: 'CONFLICT', message: err.message } });
    }
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' },
    });
  }
});

router.patch('/:id', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  const { name, display_order } = req.body;

  try {
    const category = await updateCategory(req.params.id, req.user!.id, { name, display_order });
    return res.status(200).json(category);
  } catch (err: any) {
    if (err.status === 403) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: err.message } });
    }
    if (err.status === 404) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message } });
    }
    if (err.status === 409) {
      return res.status(409).json({ error: { code: 'CONFLICT', message: err.message } });
    }
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' },
    });
  }
});

router.delete('/:id', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  try {
    await deleteCategory(req.params.id, req.user!.id);
    return res.status(204).send();
  } catch (err: any) {
    if (err.status === 403) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: err.message } });
    }
    if (err.status === 404) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message } });
    }
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' },
    });
  }
});

router.get('/:id/items', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  try {
    const items = await listMenuItems(req.params.id, req.user!.id);
    return res.status(200).json(items);
  } catch (err: any) {
    if (err.status === 403) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: err.message } });
    }
    if (err.status === 404) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message } });
    }
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' },
    });
  }
});

export default router;
