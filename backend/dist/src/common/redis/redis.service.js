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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
const uuid_1 = require("uuid");
let RedisService = RedisService_1 = class RedisService {
    configService;
    logger = new common_1.Logger(RedisService_1.name);
    client;
    isDisabled = false;
    localLocks = new Map();
    localLockCleanupInterval;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const disableRedisVal = this.configService.get('DISABLE_REDIS');
        this.isDisabled = disableRedisVal === 'true' || disableRedisVal === true;
        if (this.isDisabled) {
            this.logger.warn('Redis is disabled via DISABLE_REDIS. Using in-memory lock fallback.');
        }
        else {
            const redisUrl = this.configService.get('REDIS_URL') || 'redis://127.0.0.1:6379';
            this.client = new ioredis_1.default(redisUrl, {
                maxRetriesPerRequest: null,
                retryStrategy: (times) => {
                    const delay = Math.min(times * 100, 3000);
                    return delay;
                },
            });
            this.client.on('connect', () => this.logger.log('Redis connected successfully'));
            this.client.on('error', (err) => {
                this.logger.error('Redis connection error', err);
            });
        }
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
    getClient() {
        return this.client || null;
    }
    async acquireLock(key, ttl) {
        const lockValue = (0, uuid_1.v4)();
        if (!this.isDisabled && this.client) {
            try {
                const result = await this.client.set(key, lockValue, 'PX', ttl, 'NX');
                return result === 'OK' ? lockValue : null;
            }
            catch (err) {
                this.logger.error(`Redis acquireLock error for "${key}", falling back to in-memory`, err);
            }
        }
        const now = Date.now();
        const existing = this.localLocks.get(key);
        if (existing && existing.expiresAt > now) {
            return null;
        }
        this.localLocks.set(key, { value: lockValue, expiresAt: now + ttl });
        return lockValue;
    }
    async releaseLock(key, lockValue) {
        if (!lockValue)
            return;
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
            }
            catch (err) {
                this.logger.error(`Redis releaseLock error for "${key}"`, err);
            }
        }
        const existing = this.localLocks.get(key);
        if (existing && existing.value === lockValue) {
            this.localLocks.delete(key);
        }
    }
    async zAdd(key, score, member) {
        if (this.isDisabled || !this.client)
            return;
        try {
            await this.client.zadd(key, score, member);
        }
        catch (err) {
            this.logger.warn(`Redis zAdd failed for key "${key}": ${err.message}`);
        }
    }
    async zRevRank(key, member) {
        if (this.isDisabled || !this.client)
            return null;
        try {
            const rank = await this.client.zrevrank(key, member);
            return rank !== null ? rank + 1 : null;
        }
        catch (err) {
            this.logger.warn(`Redis zRevRank failed for key "${key}": ${err.message}`);
            return null;
        }
    }
    async zCard(key) {
        if (this.isDisabled || !this.client)
            return 0;
        try {
            return await this.client.zcard(key);
        }
        catch (err) {
            this.logger.warn(`Redis zCard failed for key "${key}": ${err.message}`);
            return 0;
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map