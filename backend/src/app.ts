import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRouter from './routes/auth.router';
import restaurantRouter from './routes/restaurant.router';
import categoryRouter from './routes/category.router';
import itemRouter from './routes/item.router';
import imageRouter from './routes/image.router';
import qrRouter from './routes/qr.router';
import publicMenuRouter from './routes/publicMenu.router';

export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  app.use('/api/auth', authRouter);
  app.use('/api/restaurants', restaurantRouter);
  app.use('/api/categories', categoryRouter);
  app.use('/api/items', itemRouter);
  app.use('/api/images', imageRouter);
  app.use('/api/restaurant', qrRouter);
  app.use('/api/public', publicMenuRouter);

  return app;
}
