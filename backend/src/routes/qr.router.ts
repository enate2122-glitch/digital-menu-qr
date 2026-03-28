import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/requireRole';
import { query } from '../db';
import { generateQrPng } from '../services/qr.service';

const router = Router();

router.get('/qr', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  try {
    // Fetch the restaurant owned by the authenticated user
    const result = await query<{ id: string; unique_qr_id: string }>(
      'SELECT id, unique_qr_id FROM restaurants WHERE owner_id = $1 LIMIT 1',
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Restaurant not found.' } });
    }

    let { id, unique_qr_id } = result.rows[0];

    // Task 8.2: generate and persist unique_qr_id if missing
    if (!unique_qr_id) {
      unique_qr_id = uuidv4();
      await query('UPDATE restaurants SET unique_qr_id = $1 WHERE id = $2', [unique_qr_id, id]);
    }

    const pngBuffer = await generateQrPng(unique_qr_id);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="qr.png"');
    return res.send(pngBuffer);
  } catch (err) {
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } });
  }
});

export default router;
