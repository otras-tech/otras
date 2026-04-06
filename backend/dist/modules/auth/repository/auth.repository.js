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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let AuthRepository = class AuthRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRefreshToken(data, tx) {
        const prisma = tx || this.prisma;
        return prisma.refreshToken.create({ data });
    }
    async findTokenById(id) {
        return this.prisma.refreshToken.findFirst({
            where: { id, isDeleted: false },
        });
    }
    async deleteToken(id, tx) {
        const prisma = tx || this.prisma;
        return prisma.refreshToken.delete({ where: { id } }).catch(() => null);
    }
    async deleteTokensByUserId(userId, userType, tx) {
        const prisma = tx || this.prisma;
        return prisma.refreshToken.deleteMany({ where: { userId, userType } });
    }
    async deleteTokenByJti(id, userId, userType) {
        return this.prisma.refreshToken.deleteMany({
            where: { id, userId, userType },
        });
    }
    async countTokensByUserId(userId, userType, tx) {
        const prisma = tx || this.prisma;
        return prisma.refreshToken.count({ where: { userId, userType } });
    }
    async findOldestSession(userId, userType, tx) {
        const prisma = tx || this.prisma;
        return prisma.refreshToken.findFirst({
            where: { userId, userType },
            orderBy: { createdAt: 'asc' },
        });
    }
    async runTransaction(fn) {
        return this.prisma.$transaction(fn);
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthRepository);
//# sourceMappingURL=auth.repository.js.map