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
exports.TestRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let TestRepository = class TestRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findQuestionsByIds(ids) {
        return this.prisma.question.findMany({
            where: { id: { in: ids }, isDeleted: false },
            select: { id: true },
        });
    }
    async findExamWithSubjects(examId) {
        return this.prisma.exam.findUnique({
            where: { id: examId, isDeleted: false },
            include: { subjects: { where: { isDeleted: false } } },
        });
    }
    async findQuestionsBySubjectIds(subjectIds) {
        return this.prisma.question.findMany({
            where: { subjectId: { in: subjectIds }, isDeleted: false },
            select: { id: true },
        });
    }
    async createTest(data, questionIds) {
        return this.prisma.test.create({
            data: {
                ...data,
                questions: {
                    connect: questionIds.map((id) => ({ id })),
                },
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                exam: {
                    select: { id: true, name: true },
                },
                _count: {
                    select: { questions: true },
                },
            },
        });
    }
    async findAll(cursor, take) {
        return this.prisma.test.findMany({
            where: { isDeleted: false },
            select: {
                id: true,
                name: true,
                createdAt: true,
                exam: {
                    select: { id: true, name: true },
                },
                _count: {
                    select: { questions: true },
                },
            },
            take,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.test.findUnique({
            where: { id, isDeleted: false },
            select: {
                id: true,
                name: true,
                createdAt: true,
                exam: {
                    select: { id: true, name: true, noOfQuestions: true },
                },
                questions: {
                    where: { isDeleted: false },
                    select: {
                        id: true,
                        text: true,
                        options: true,
                        subject: { select: { id: true, name: true } },
                    },
                },
            },
        });
    }
    async updateTest(id, data) {
        return this.prisma.test.update({
            where: { id },
            data,
        });
    }
    async softDelete(id) {
        return this.prisma.test.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
};
exports.TestRepository = TestRepository;
exports.TestRepository = TestRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TestRepository);
//# sourceMappingURL=test.repository.js.map