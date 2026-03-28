import { Router, Request, Response } from 'express';
import { createRestaurant, getRestaurant, updateRestaurant, listRestaurants } from '../services/restaurant.service';
import { listCategories } from '../services/category.service';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.get('/', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  try {
    const restaurants = await listRestaurants(req.user!.id);
    return res.status(200).json(restaurants);
  } catch {
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } });
  }
});

router.post('/', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  const { name, address, logo_url, primary_color } = req.body;

  if (!name) {
    return res.status(400).json({
      error: { code: 'MISSING_FIELDS', message: 'name is required.' },
    });
  }

  try {
    const restaurant = await createRestaurant(req.user!.id, { name, address, logo_url, primary_color });
    return res.status(201).json(restaurant);
  } catch (err: unknown) {
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' },
    });
  }
});

router.get('/:id', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurant(req.params.id, req.user!.id);
    return res.status(200).json(restaurant);
  } catch (err: any) {
    if (err.status === 404) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message } });
    }
    if (err.status === 403) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: err.message } });
    }
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' },
    });
  }
});

router.patch('/:id', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  try {
    const { name, address, logo_url, primary_color } = req.body;
    const restaurant = await updateRestaurant(req.params.id, req.user!.id, { name, address, logo_url, primary_color });
    return res.status(200).json(restaurant);
  } catch (err: any) {
    if (err.status === 404) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message } });
    }
    if (err.status === 403) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: err.message } });
    }
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' },
    });
  }
});

router.get('/:id/categories', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  try {
    const categories = await listCategories(req.params.id, req.user!.id);
    return res.status(200).json(categories);
  } catch (err: any) {
    if (err.status === 404) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message } });
    }
    if (err.status === 403) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: err.message } });
    }
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' },
    });
  }
});

export default router;
