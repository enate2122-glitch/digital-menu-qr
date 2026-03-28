import { Router, Request, Response } from 'express';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../services/menuItem.service';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.post('/', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  const { category_id, name, price, description, image_url, is_available, display_order } = req.body;

  if (!category_id || !name || price === undefined) {
    return res.status(400).json({
      error: { code: 'MISSING_FIELDS', message: 'category_id, name, and price are required.' },
    });
  }

  try {
    const item = await createMenuItem(req.user!.id, {
      category_id,
      name,
      price,
      description,
      image_url,
      is_available,
      display_order,
    });
    return res.status(201).json(item);
  } catch (err: any) {
    if (err.status === 422) {
      return res.status(422).json({ error: { code: 'INVALID_PRICE', message: err.message } });
    }
    if (err.status === 403) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: err.message } });
    }
    if (err.status === 404) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message } });
    }
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } });
  }
});

router.patch('/:id', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  const { name, description, price, image_url, is_available, display_order } = req.body;

  try {
    const item = await updateMenuItem(req.params.id, req.user!.id, {
      name,
      description,
      price,
      image_url,
      is_available,
      display_order,
    });
    return res.status(200).json(item);
  } catch (err: any) {
    if (err.status === 422) {
      return res.status(422).json({ error: { code: 'INVALID_PRICE', message: err.message } });
    }
    if (err.status === 403) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: err.message } });
    }
    if (err.status === 404) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message } });
    }
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } });
  }
});

router.delete('/:id', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  try {
    await deleteMenuItem(req.params.id, req.user!.id);
    return res.status(204).send();
  } catch (err: any) {
    if (err.status === 403) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: err.message } });
    }
    if (err.status === 404) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message } });
    }
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } });
  }
});

export default router;
