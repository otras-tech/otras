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
var TokenCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenCleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../database/prisma.service");
const redis_service_1 = require("../../common/redis/redis.service");
let TokenCleanupService = TokenCleanupService_1 = class TokenCleanupService {
    prisma;
    redisService;
    logger = new common_1.Logger(TokenCleanupService_1.name);
    BATCH_SIZE = 1000;
    constructor(prisma, redisService) {
        this.prisma = prisma;
        this.redisService = redisService;
    }
    async handleTokenCleanup() {
        const lockKey = 'cron:token-cleanup';
        const lockTtl = 300_000;
        const lockValue = await this.redisService.acquireLock(lockKey, lockTtl);
        if (!lockValue) {
            this.logger.log('Token cleanup already running on another instance. Skipping.');
            return;
        }
        this.logger.log('Starting expired token cleanup job (batch mode)...');
        let totalDeleted = 0;
        try {
            const now = new Date();
            while (true) {
                const expiredBatch = await this.prisma.refreshToken.findMany({
                    where: { expiresAt: { lt: now } },
                    select: { id: true },
                    take: this.BATCH_SIZE,
                });
                if (expiredBatch.length === 0)
                    break;
                const ids = expiredBatch.map((t) => t.id);
                const result = await this.prisma.refreshToken.deleteMany({
                    where: { id: { in: ids } },
                });
                totalDeleted += result.count;
                this.logger.log(`Batch deleted ${result.count} tokens (total: ${totalDeleted})`);
                if (expiredBatch.length < this.BATCH_SIZE)
                    break;
            }
            this.logger.log(`Cleanup complete. Total deleted: ${totalDeleted} expired tokens.`);
        }
        catch (error) {
            this.logger.error(`Error during token cleanup job (deleted ${totalDeleted} before failure):`, error);
        }
        finally {
            await this.redisService.releaseLock(lockKey, lockValue);
        }
    }
};
exports.TokenCleanupService = TokenCleanupService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TokenCleanupService.prototype, "handleTokenCleanup", null);
exports.TokenCleanupService = TokenCleanupService = TokenCleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], TokenCleanupService);
//# sourceMappingURL=token-cleanup.service.js.map