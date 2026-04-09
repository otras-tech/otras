import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  // ─── Stampede Protection ─────────────────────────────────────────
  // In-process map of inflight fetch promises. When multiple requests
  // hit the same cold cache key simultaneously, only one executes the
  // DB query; the others await the same Promise.
  private readonly inflight = new Map<string, Promise<unknown>>();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  // ─── Private Helper ───────────────────────────────────────────────

  /**
   * Returns the underlying ioredis client from the cache-manager store,
   * or null when running with a non-Redis store (e.g. in-memory for tests).
   */
  private getRedisClient(): any | null {
    try {
      const store = (this.cacheManager as any).store;
      return store?.client ?? null;
    } catch {
      return null;
    }
  }

  // ─── Core CRUD (unchanged signatures) ─────────────────────────────

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.cacheManager.get<T>(key);

      if (data !== null && data !== undefined) {
        console.log("🔥 CACHE HIT:", key); // ✅ ADD THIS LINE
      }

      return data ?? null;
    } catch (error: any) {
      this.logger.error(`Error getting key "${key}" from cache`, error.stack);
      return null;
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error: any) {
      this.logger.error(`Error setting key "${key}" in cache`, error.stack);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error: any) {
      this.logger.error(`Error deleting key "${key}" from cache`, error.stack);
    }
  }

  /**
   * Invalidates all keys matching a pattern using non-blocking SCAN.
   * Crucial for 500K+ users to prevent Redis event loop blocking.
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const store = (this.cacheManager as any).store;
      const client = store?.client; // 'cache-manager-redis-yet' exposes the ioredis client

      if (client && typeof client.scan === 'function') {
        let cursor = '0';
        let totalInvalidated = 0;

        do {
          const result = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
          cursor = result[0];
          const keys = result[1];

          if (keys && keys.length > 0) {
            await Promise.all(keys.map((key: string) => this.del(key)));
            totalInvalidated += keys.length;
          }
        } while (cursor !== '0');

        if (totalInvalidated > 0) {
          this.logger.log(`Invalidated ${totalInvalidated} keys matching pattern: ${pattern}`);
        }
      } else if (store?.keys) {
        const keys = await store.keys(pattern);
        if (keys && keys.length > 0) {
          await Promise.all(keys.map((key: string) => this.del(key)));
          this.logger.warn(`Invalidated ${keys.length} keys using blocking KEYS fallback`);
        }
      }
    } catch (error: any) {
      this.logger.error(`Error invalidating pattern "${pattern}"`, error.stack);
    }
  }


  // ─── NEW: Stampede-Protected Cache Read ───────────────────────────

  /**
   * Gets a value from cache, or populates it via `fetchFn` if missing.
   * Prevents cache stampede: only ONE concurrent caller runs fetchFn;
   * all others await the same in-flight Promise.
   *
   * @param key      Cache key
   * @param fetchFn  Function that fetches from the DB (called only on cache miss)
   * @param ttl      TTL in milliseconds. A jitter of ±10% is applied to prevent
   *                 synchronized expiry across keys.
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number,
  ): Promise<T> {
    // 1. Try cache
    const cached = await this.get<T>(key);
    if (cached !== null && cached !== undefined) {
      console.log("🔥 CACHE HIT (getOrSet):", key);
      return cached;
    }

    // 2. In-memory dedupe (same instance)
    const existing = this.inflight.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    // 3. 🔒 Redis distributed lock (cross-instance)
    const redis = this.getRedisClient();
    const lockKey = `lock:${key}`;

    if (redis && typeof redis.set === 'function') {
      const lock = await redis.set(lockKey, '1', 'NX', 'EX', 5);

      if (!lock) {
        // another instance is fetching → wait & retry
        await new Promise((res) => setTimeout(res, 100));
        return this.getOrSet(key, fetchFn, ttl);
      }
    }

    console.log("❌ DB HIT:", key);

    const fetchPromise = (async () => {
      try {
        const result = await fetchFn();

        const jitteredTtl = Math.round(ttl * (0.9 + Math.random() * 0.2));
        await this.set(key, result, jitteredTtl);

        return result;
      } finally {
        this.inflight.delete(key);
        // 🔓 release lock (only if Redis is available)
        if (redis && typeof redis.del === 'function') {
          await redis.del(lockKey).catch(() => { });
        }
      }
    })();

    this.inflight.set(key, fetchPromise);
    return fetchPromise;
  }
  // ─── NEW: Safe Invalidation with Fallback ─────────────────────────

  /**
   * Safely invalidates explicit keys and optional patterns.
   * Never throws — failures are logged but swallowed because
   * the TTL safety net ensures eventual consistency.
   *
   * @param keys      Explicit cache keys to delete
   * @param patterns  Optional glob patterns to invalidate (Redis only)
   */
  async safeInvalidate(keys: string[], patterns?: string[]): Promise<void> {
    // 1. Delete explicit keys
    for (const key of keys) {
      try {
        await this.cacheManager.del(key);
      } catch (err) {
        this.logger.warn(
          `Failed to invalidate key "${key}" — TTL safety net will handle`,
          err,
        );
      }
    }

    // 2. Invalidate patterns (Redis-backed stores only)
    if (patterns && patterns.length > 0) {
      for (const pattern of patterns) {
        try {
          await this.invalidatePattern(pattern);
        } catch (err) {
          this.logger.warn(
            `Failed to invalidate pattern "${pattern}" — TTL safety net will handle`,
            err,
          );
        }
      }
    }
  }

  // ─── NEW: Key Normalization Utility ───────────────────────────────

  /**
   * Normalizes a cache key to prevent key explosion from unbounded
   * pagination. Caps cursor/page values to prevent infinite key space.
   *
   * @param prefix    Key prefix (e.g., 'exams', 'mock_tests')
   * @param params    Key parameters
   * @param maxPage   Maximum page/cursor depth to cache (default: 10)
   */
  static buildKey(
    prefix: string,
    params: Record<string, string | number | undefined> = {},
    maxPage = 10,
  ): string | null {
    const parts = [prefix];
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;

      // Cap pagination depth to prevent key explosion
      if (
        (k === 'cursor' || k === 'page' || k === 'skip') &&
        typeof v === 'number'
      ) {
        if (v > maxPage) return null; // Signal: do not cache deep pages
      }

      parts.push(`${k}:${v}`);
    }
    return parts.join(':');
  }
}
