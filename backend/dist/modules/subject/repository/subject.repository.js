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
exports.SubjectRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let SubjectRepository = class SubjectRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.subject.create({ data });
    }
    async findAll(cursor, take) {
        const safeTake = Math.min(take || 20, 100);
        return this.prisma.subject.findMany({
            where: { isDeleted: false },
            include: { exams: { where: { isDeleted: false } } },
            take: safeTake,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
        });
    }
    async findById(id) {
        return this.prisma.subject.findUnique({
            where: { id, isDeleted: false },
            include: { exams: { where: { isDeleted: false } } },
        });
    }
    async update(id, data) {
        return this.prisma.subject.update({ where: { id }, data });
    }
    async softDelete(id) {
        return this.prisma.subject.update({ where: { id }, data: { isDeleted: true } });
    }
};
exports.SubjectRepository = SubjectRepository;
exports.SubjectRepository = SubjectRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubjectRepository);
//# sourceMappingURL=subject.repository.js.map