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
exports.ExamRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let ExamRepository = class ExamRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.exam.create({ data, include: { subjects: true } });
    }
    async update(id, data) {
        return this.prisma.exam.update({ where: { id }, data, include: { subjects: true } });
    }
    async findAll(cursor, take) {
        const safeTake = Math.min(take || 20, 100);
        return this.prisma.exam.findMany({
            where: { isDeleted: false },
            select: {
                id: true,
                name: true,
                cutoff: true,
                syllabus: true,
                noOfQuestions: true,
                subjects: { select: { id: true, name: true } },
            },
            take: safeTake,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.exam.findFirst({
            where: { id, isDeleted: false },
            select: {
                id: true,
                name: true,
                cutoff: true,
                syllabus: true,
                eligibility: true,
                longDescription: true,
                noOfQuestions: true,
                pattern: true,
                shortDescription: true,
                applicationStatus: true,
                createdAt: true,
                subjects: { select: { id: true, name: true } },
            },
        });
    }
    async findWithTests(examId) {
        return this.prisma.exam.findFirst({
            where: { id: examId, isDeleted: false },
            select: {
                id: true,
                name: true,
                noOfQuestions: true,
                tests: {
                    where: { isDeleted: false },
                    take: 10,
                    select: {
                        id: true,
                        name: true,
                        questions: {
                            select: { id: true, subject: { select: { id: true, name: true } } },
                        },
                    },
                },
            },
        });
    }
    async findForTestGeneration(examId) {
        return this.prisma.exam.findFirst({
            where: { id: examId, isDeleted: false },
            select: {
                id: true,
                name: true,
                noOfQuestions: true,
                subjects: { select: { id: true } },
            },
        });
    }
    async countQuestions(subjectIds) {
        return this.prisma.question.count({
            where: { subjectId: { in: subjectIds }, isDeleted: false },
        });
    }
    async findAllQuestionIds(subjectIds) {
        return this.prisma.question.findMany({
            where: { subjectId: { in: subjectIds }, isDeleted: false },
            select: { id: true },
            take: 1000,
        });
    }
    async findQuestionAtOffset(subjectIds, skip) {
        return this.prisma.question.findMany({
            where: { subjectId: { in: subjectIds }, isDeleted: false },
            select: { id: true },
            take: 1,
            skip,
        });
    }
    async createTest(data) {
        return this.prisma.test.create({
            data,
            select: {
                id: true,
                name: true,
                createdAt: true,
                questions: { select: { id: true, subject: { select: { id: true, name: true } } } },
            },
        });
    }
    async findByTier(tier) {
        return this.prisma.exam.findMany({
            where: {
                isDeleted: false,
                name: { contains: `Tier ${tier}`, mode: 'insensitive' },
            },
            select: {
                id: true,
                name: true,
                shortDescription: true,
                subjects: { select: { id: true, name: true } },
            },
        });
    }
    async softDelete(id) {
        return this.prisma.exam.update({ where: { id }, data: { isDeleted: true } });
    }
};
exports.ExamRepository = ExamRepository;
exports.ExamRepository = ExamRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamRepository);
//# sourceMappingURL=exam.repository.js.map