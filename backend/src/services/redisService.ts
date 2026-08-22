import { redisClient } from '../config/redis.js';

export class RedisService {
  private static inMemoryFallback = new Map<string, { value: string; expiresAt: number }>();

  static async get<T>(key: string): Promise<T | null> {
    try {
      if (redisClient.status === 'ready') {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
      }
    } catch {
      // Fallback
    }

    const item = this.inMemoryFallback.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.inMemoryFallback.delete(key);
      return null;
    }
    return JSON.parse(item.value);
  }

  static async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    const stringified = JSON.stringify(value);
    try {
      if (redisClient.status === 'ready') {
        await redisClient.setex(key, ttlSeconds, stringified);
        return;
      }
    } catch {
      // Fallback
    }

    this.inMemoryFallback.set(key, {
      value: stringified,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  static async del(key: string): Promise<void> {
    try {
      if (redisClient.status === 'ready') {
        await redisClient.del(key);
        return;
      }
    } catch {
      // Fallback
    }
    this.inMemoryFallback.delete(key);
  }
}
