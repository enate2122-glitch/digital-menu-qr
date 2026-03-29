import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { getPublicMenu } from '../services/publicMenu.service';

const router = Router();

// Use memory store by default; swap in RedisStore only if Redis is connected
function buildRateLimiter() {
  try {
    // Dynamically require so a missing/closed Redis client doesn't crash startup
    const { RedisStore } = require('rate-limit-redis');
    const redisClient = require('../redis/client').default;

    if (redisClient.isOpen) {
      return rateLimit({
        windowMs: 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (_req: Request, res: Response) => {
          res.setHeader('Retry-After', '60');
          res.status(429).json({
            error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again in 60 seconds.' },
          });
        },
        store: new RedisStore({
          sendCommand: (...args: string[]) => redisClient.sendCommand(args),
        }),
      });
    }
  } catch {
    // fall through to memory store
  }

  console.warn('Redis not available — using in-memory rate limit store');
  return rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      res.setHeader('Retry-After', '60');
      res.status(429).json({
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again in 60 seconds.' },
      });
    },
  });
}

const rateLimiter = buildRateLimiter();

router.get('/menu/:unique_qr_id', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { unique_qr_id } = req.params;
    const result = await getPublicMenu(unique_qr_id);

    if (!result) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Menu not found.' },
      });
    }

    // Cache public menu for 30 seconds on CDN/browser
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred.' },
    });
  }
});

export default router;
