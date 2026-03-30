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
  private readonly inflight = new Map<string, Promise<any>>();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // ─── Core CRUD (unchanged signatures) ─────────────────────────────

  async get<T>(key: string): Promise<T | null> {
    try {
      return (await this.cacheManager.get(key)) as T | null;
    } catch (error) {
      this.logger.error(`Error getting key "${key}" from cache`, error.stack);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      this.logger.error(`Error setting key "${key}" in cache`, error.stack);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key "${key}" from cache`, error.stack);
    }
  }

  /**
   * Invalidates all keys matching a pattern.
   * Note: This requires the store to support 'keys' method (Redis store does).
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const store = (this.cacheManager as any).store;
      // In cache-manager v5, store.keys is often found on the underlying store object
      if (store && typeof (store as any).keys === 'function') {
        const keys = await (store as any).keys(pattern);
        if (keys && keys.length > 0) {
          await Promise.all(keys.map((key: string) => this.cacheManager.del(key)));
          this.logger.log(`Invalidated ${keys.length} keys matching pattern: ${pattern}`);
        }
      }
    } catch (error) {
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
  async getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttl: number): Promise<T> {
    // 1. Try cache first
    const cached = await this.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    // 2. Check if another request is already fetching this key
    const existing = this.inflight.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    // 3. We are the first — execute fetch, store promise in inflight map
    const fetchPromise = (async () => {
      try {
        const result = await fetchFn();
        // Apply TTL jitter (±10%) to prevent synchronized expiry
        const jitteredTtl = Math.round(ttl * (0.9 + Math.random() * 0.2));
        await this.set(key, result, jitteredTtl);
        return result;
      } finally {
        this.inflight.delete(key);
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
        this.logger.warn(`Failed to invalidate key "${key}" — TTL safety net will handle`, err);
      }
    }

    // 2. Invalidate patterns (Redis-backed stores only)
    if (patterns && patterns.length > 0) {
      for (const pattern of patterns) {
        try {
          await this.invalidatePattern(pattern);
        } catch (err) {
          this.logger.warn(`Failed to invalidate pattern "${pattern}" — TTL safety net will handle`, err);
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
  static buildKey(prefix: string, params: Record<string, any> = {}, maxPage = 10): string | null {
    const parts = [prefix];
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;

      // Cap pagination depth to prevent key explosion
      if ((k === 'cursor' || k === 'page' || k === 'skip') && typeof v === 'number') {
        if (v > maxPage) return null; // Signal: do not cache deep pages
      }

      parts.push(`${k}:${v}`);
    }
    return parts.join(':');
  }
}
