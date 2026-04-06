"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
let CacheService = CacheService_1 = class CacheService {
    cacheManager;
    logger = new common_1.Logger(CacheService_1.name);
    inflight = new Map();
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    async get(key) {
        try {
            return (await this.cacheManager.get(key));
        }
        catch (error) {
            this.logger.error(`Error getting key "${key}" from cache`, error.stack);
            return null;
        }
    }
    async set(key, value, ttl) {
        try {
            await this.cacheManager.set(key, value, ttl);
        }
        catch (error) {
            this.logger.error(`Error setting key "${key}" in cache`, error.stack);
        }
    }
    async del(key) {
        try {
            await this.cacheManager.del(key);
        }
        catch (error) {
            this.logger.error(`Error deleting key "${key}" from cache`, error.stack);
        }
    }
    async invalidatePattern(pattern) {
        try {
            const store = this.cacheManager.store;
            const client = store?.client;
            if (client && typeof client.scan === 'function') {
                let cursor = '0';
                let totalInvalidated = 0;
                do {
                    const result = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
                    cursor = result[0];
                    const keys = result[1];
                    if (keys && keys.length > 0) {
                        await Promise.all(keys.map((key) => this.del(key)));
                        totalInvalidated += keys.length;
                    }
                } while (cursor !== '0');
                if (totalInvalidated > 0) {
                    this.logger.log(`Invalidated ${totalInvalidated} keys matching pattern: ${pattern}`);
                }
            }
            else if (store?.keys) {
                const keys = await store.keys(pattern);
                if (keys && keys.length > 0) {
                    await Promise.all(keys.map((key) => this.del(key)));
                    this.logger.warn(`Invalidated ${keys.length} keys using blocking KEYS fallback`);
                }
            }
        }
        catch (error) {
            this.logger.error(`Error invalidating pattern "${pattern}"`, error.stack);
        }
    }
    async getOrSet(key, fetchFn, ttl) {
        const cached = await this.get(key);
        if (cached !== null && cached !== undefined) {
            return cached;
        }
        const existing = this.inflight.get(key);
        if (existing) {
            return existing;
        }
        const fetchPromise = (async () => {
            try {
                const result = await fetchFn();
                const jitteredTtl = Math.round(ttl * (0.9 + Math.random() * 0.2));
                await this.set(key, result, jitteredTtl);
                return result;
            }
            finally {
                this.inflight.delete(key);
            }
        })();
        this.inflight.set(key, fetchPromise);
        return fetchPromise;
    }
    async safeInvalidate(keys, patterns) {
        for (const key of keys) {
            try {
                await this.cacheManager.del(key);
            }
            catch (err) {
                this.logger.warn(`Failed to invalidate key "${key}" — TTL safety net will handle`, err);
            }
        }
        if (patterns && patterns.length > 0) {
            for (const pattern of patterns) {
                try {
                    await this.invalidatePattern(pattern);
                }
                catch (err) {
                    this.logger.warn(`Failed to invalidate pattern "${pattern}" — TTL safety net will handle`, err);
                }
            }
        }
    }
    static buildKey(prefix, params = {}, maxPage = 10) {
        const parts = [prefix];
        for (const [k, v] of Object.entries(params)) {
            if (v === undefined || v === null)
                continue;
            if ((k === 'cursor' || k === 'page' || k === 'skip') &&
                typeof v === 'number') {
                if (v > maxPage)
                    return null;
            }
            parts.push(`${k}:${v}`);
        }
        return parts.join(':');
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], CacheService);
//# sourceMappingURL=cache.service.js.map