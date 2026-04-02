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
exports.ApplicationRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let ApplicationRepository = class ApplicationRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(userId, examId) {
        return this.prisma.application.upsert({
            where: { userId_examId: { userId, examId } },
            update: {},
            create: { userId, examId },
        });
    }
    async findByUserId(userId) {
        return this.prisma.application.findMany({
            where: { userId, isDeleted: false },
            include: { exam: { select: { id: true, name: true, applicationStatus: true } } },
        });
    }
    async findByUserIdRaw(userId) {
        return this.prisma.application.findMany({
            where: { userId },
            include: { exam: true },
        });
    }
    async findById(id) {
        return this.prisma.application.findUnique({ where: { id } });
    }
    async findByOtrId(otrId) {
        const user = await this.prisma.user.findUnique({
            where: { otrId },
            select: { id: true },
        });
        if (!user)
            return null;
        return this.prisma.application.findMany({
            where: { userId: user.id, isDeleted: false },
            include: { exam: true },
        });
    }
    async findAll() {
        return this.prisma.application.findMany({
            where: { isDeleted: false },
            include: { user: true, exam: true },
        });
    }
    async updateStatus(id, data) {
        return this.prisma.application.update({ where: { id }, data });
    }
};
exports.ApplicationRepository = ApplicationRepository;
exports.ApplicationRepository = ApplicationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationRepository);
//# sourceMappingURL=application.repository.js.map