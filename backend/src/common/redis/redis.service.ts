import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: Redis;
  private isDisabled = false;

  // ─── In-Memory Lock Fallback ───────────────────────────────────────
  // Used when Redis is unavailable. Prevents race conditions in
  // single-instance dev/staging. NOT a replacement for Redis in production.
  private readonly localLocks = new Map<
    string,
    { value: string; expiresAt: number }
  >();
  private localLockCleanupInterval!: ReturnType<typeof setInterval>;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const disableRedisVal = this.configService.get('DISABLE_REDIS');
    this.isDisabled = disableRedisVal === 'true' || disableRedisVal === true;

    if (this.isDisabled) {
      this.logger.warn(
        'Redis is disabled via DISABLE_REDIS. Using in-memory lock fallback.',
      );
    } else {
      const redisUrl =
        this.configService.get<string>('REDIS_URL') || 'redis://127.0.0.1:6379';
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1, // ✅ Fail fast
        connectTimeout: 5000, // ✅ 5s connection timeout to prevent hanging
        commandTimeout: 5000, // 5s timeout to prevent hanging app on Redis issues
        retryStrategy: (times) => {
          // ✅ Limit retries during bootstrap (exactly 3 attempts)
          if (times > 3) return null;
          const delay = Math.min(times * 100, 3000);
          return delay;
        },
      });

      this.client.on('connect', () =>
        this.logger.log('Redis connected successfully'),
      );
      this.client.on('error', (err) => {
        this.logger.error('Redis connection error', err);
      });
    }

    // Periodic cleanup of expired in-memory locks (every 30s)
    this.localLockCleanupInterval = setInterval(() => {
      const now = Date.now();
      let cleaned = 0;
      for (const [key, entry] of this.localLocks) {
        if (entry.expiresAt <= now) {
          this.localLocks.delete(key);
          cleaned++;
        }
      }
      if (cleaned > 0) {
        this.logger.debug(`Cleaned ${cleaned} expired in-memory locks`);
      }
    }, 30_000);
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
    if (this.localLockCleanupInterval) {
      clearInterval(this.localLockCleanupInterval);
    }
    this.localLocks.clear();
  }

  getClient(): Redis | null {
    return this.client || null;
  }

  /**
   * Acquires a distributed lock with ownership tracking.
   * Uses SET NX PX on Redis, or an in-memory Map fallback when Redis is unavailable.
   *
   * @param key   The lock key.
   * @param ttl   Lock expiration in milliseconds.
   * @returns     A unique lock value (UUID) if acquired, or null if not acquired.
   *              The caller MUST pass this value back to `releaseLock` to prove ownership.
   */
  async acquireLock(key: string, ttl: number): Promise<string | null> {
    const lockValue = uuidv4();

    // ─── Redis path ─────────────────────────────────────────────────
    if (!this.isDisabled && this.client) {
      try {
        const result = await this.client.set(key, lockValue, 'PX', ttl, 'NX');
        return result === 'OK' ? lockValue : null;
      } catch (err) {
        this.logger.error(
          `Redis acquireLock error for "${key}", falling back to in-memory`,
          err,
        );
        // Fall through to in-memory
      }
    }

    // ─── In-memory fallback ─────────────────────────────────────────
    const now = Date.now();
    const existing = this.localLocks.get(key);
    if (existing && existing.expiresAt > now) {
      return null; // Lock is held by someone else
    }

    this.localLocks.set(key, { value: lockValue, expiresAt: now + ttl });
    return lockValue;
  }

  /**
   * Releases a lock ONLY if the caller owns it (value matches).
   * This prevents Process A from accidentally releasing Process B's lock.
   *
   * Uses a Lua script on Redis for atomic compare-and-delete.
   *
   * @param key       The lock key.
   * @param lockValue The value returned by acquireLock. If null/undefined, release is skipped.
   */
  async releaseLock(key: string, lockValue?: string | null): Promise<void> {
    if (!lockValue) return;

    // ─── Redis path (atomic Lua script) ─────────────────────────────
    if (!this.isDisabled && this.client) {
      try {
        const script = `
          if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
          else
            return 0
          end
        `;
        await this.client.eval(script, 1, key, lockValue);
        return;
      } catch (err) {
        this.logger.error(`Redis releaseLock error for "${key}"`, err);
        // Fall through to in-memory cleanup
      }
    }

    // ─── In-memory fallback ─────────────────────────────────────────
    const existing = this.localLocks.get(key);
    if (existing && existing.value === lockValue) {
      this.localLocks.delete(key);
    }
  }
  /**
   * Adds/updates a member's score in a sorted set (ZSET).
   */
  async zAdd(key: string, score: number, member: string): Promise<void> {
    if (this.isDisabled || !this.client) return;
    try {
      await this.client.zadd(key, score, member);
    } catch (err: any) {
      this.logger.warn(`Redis zAdd failed for key "${key}": ${err.message}`);
    }
  }

  /**
   * Returns the 1-indexed rank of a member in a sorted set (descending order).
   * Returns null if member not found or Redis disabled.
   */
  async zRevRank(key: string, member: string): Promise<number | null> {
    if (this.isDisabled || !this.client) return null;
    try {
      const rank = await this.client.zrevrank(key, member);
      return rank !== null ? rank + 1 : null;
    } catch (err: any) {
      this.logger.warn(
        `Redis zRevRank failed for key "${key}": ${err.message}`,
      );
      return null;
    }
  }

  /**
   * Returns the total number of members in a sorted set.
   */
  async zCard(key: string): Promise<number> {
    if (this.isDisabled || !this.client) return 0;
    try {
      return await this.client.zcard(key);
    } catch (err: any) {
      this.logger.warn(`Redis zCard failed for key "${key}": ${err.message}`);
      return 0;
    }
  }
}
