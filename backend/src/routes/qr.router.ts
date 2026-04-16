import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/requireRole';
import { query } from '../db';
import { generateQrPng } from '../services/qr.service';

const router = Router();

router.get('/qr', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  try {
    const restaurantId = req.query.restaurantId as string | undefined;

    // If restaurantId provided, fetch that specific one (verify ownership)
    // Otherwise fall back to first restaurant
    const sql = restaurantId
      ? 'SELECT id, unique_qr_id, name FROM restaurants WHERE id = $1 AND owner_id = $2'
      : 'SELECT id, unique_qr_id, name FROM restaurants WHERE owner_id = $1 ORDER BY created_at ASC LIMIT 1';
    const params = restaurantId ? [restaurantId, req.user!.id] : [req.user!.id];

    const result = await query<{ id: string; unique_qr_id: string; name: string }>(sql, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Restaurant not found.' } });
    }

    let { id, unique_qr_id, name } = result.rows[0];

    if (!unique_qr_id) {
      unique_qr_id = uuidv4();
      await query('UPDATE restaurants SET unique_qr_id = $1 WHERE id = $2', [unique_qr_id, id]);
    }

    const svgBuffer = await generateQrPng(unique_qr_id, name);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', `attachment; filename="${name.replace(/[^a-z0-9]/gi, '-')}-qr.svg"`);
    return res.send(svgBuffer);
  } catch (err) {
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } });
  }
});

export default router;
