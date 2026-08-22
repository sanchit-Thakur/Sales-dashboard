import Redis from 'ioredis';
import { env } from './env.js';

export const redisClient = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) {
      console.warn('⚠️ Redis connection retries exceeded. Falling back to in-memory/bypass mode.');
      return null;
    }
    return Math.min(times * 200, 1000);
  },
});

redisClient.on('connect', () => {
  console.log('⚡ Connected to Redis instance');
});

redisClient.on('error', (err) => {
  console.warn('⚠️ Redis Client Warning:', err.message);
});
