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
var CleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../database/prisma.service");
let CleanupService = CleanupService_1 = class CleanupService {
    prisma;
    logger = new common_1.Logger(CleanupService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleExpiredTokensCleanup() {
        this.logger.log('Starting daily cleanup of expired refresh tokens...');
        try {
            const now = new Date();
            const result = await this.prisma.refreshToken.deleteMany({
                where: {
                    expiresAt: {
                        lt: now,
                    },
                },
            });
            this.logger.log(`Cleanup completed. Removed ${result.count} expired tokens.`);
        }
        catch (error) {
            this.logger.error(`Error during token cleanup: ${error.message}`);
        }
    }
    async handleSoftDeleteCleanup() {
        this.logger.log('Starting weekly cleanup of soft-deleted records...');
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        try {
            const results = await this.prisma.result.deleteMany({
                where: {
                    isDeleted: true,
                    updatedAt: { lt: thirtyDaysAgo },
                },
            });
            this.logger.log(`Cleanup completed. Removed ${results.count} soft-deleted results.`);
        }
        catch (error) {
            this.logger.error(`Error during soft-delete cleanup: ${error.message}`);
        }
    }
};
exports.CleanupService = CleanupService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CleanupService.prototype, "handleExpiredTokensCleanup", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_WEEKEND),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CleanupService.prototype, "handleSoftDeleteCleanup", null);
exports.CleanupService = CleanupService = CleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CleanupService);
//# sourceMappingURL=cleanup.service.js.map