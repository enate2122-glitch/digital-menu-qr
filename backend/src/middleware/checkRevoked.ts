import { Request, Response, NextFunction } from 'express';
import { isTokenRevoked } from '../services/token.service';

export async function checkRevoked(req: Request, res: Response, next: NextFunction): Promise<void> {
  const jti = req.user?.jti;

  if (!jti) {
    res.status(401).json({ error: { code: 'MISSING_TOKEN', message: 'Authorization token is required.' } });
    return;
  }

  const revoked = await isTokenRevoked(jti);
  if (revoked) {
    res.status(401).json({ error: { code: 'TOKEN_REVOKED', message: 'Token has been revoked.' } });
    return;
  }

  next();
}
