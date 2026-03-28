import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL ?? 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export default redisClient;
