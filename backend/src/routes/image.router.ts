import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/requireRole';
import { uploadImage, MAX_FILE_SIZE } from '../services/image.service';
import { getActivePlan } from '../services/subscription.service';
import { getLimits } from '../utils/planLimits';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE + 1 },
});

router.post(
  '/upload',
  authenticate,
  requireRole('owner'),
  upload.single('image'),
  async (req: Request, res: Response) => {
    // Check plan allows image uploads
    const plan = await getActivePlan(req.user!.id);
    if (!plan) {
      return res.status(403).json({ error: { code: 'NO_SUBSCRIPTION', message: 'No active subscription.' } });
    }
    if (!getLimits(plan).imageUploads) {
      return res.status(403).json({ error: { code: 'PLAN_LIMIT', message: `Image uploads are not available on the ${plan} plan. Upgrade to Growing or Enterprise.` } });
    }

    if (!req.file) {
      return res.status(400).json({ error: { code: 'MISSING_FILE', message: 'No image file provided.' } });
    }

    try {
      const url = await uploadImage(req.file.buffer);
      return res.status(201).json({ url });
    } catch (err: any) {
      if (err.status === 413) {
        return res.status(413).json({ error: { code: 'FILE_TOO_LARGE', message: err.message } });
      }
      if (err.status === 422) {
        return res.status(422).json({ error: { code: 'INVALID_IMAGE_FORMAT', message: err.message } });
      }
      return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' } });
    }
  }
);

export default router;
