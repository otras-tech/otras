import { Cache } from 'cache-manager';
export declare class CacheService {
    private cacheManager;
    private readonly logger;
    private readonly inflight;
    constructor(cacheManager: Cache);
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    invalidatePattern(pattern: string): Promise<void>;
    getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttl: number): Promise<T>;
    safeInvalidate(keys: string[], patterns?: string[]): Promise<void>;
    static buildKey(prefix: string, params?: Record<string, any>, maxPage?: number): string | null;
}
