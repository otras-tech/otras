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
exports.ExamService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
let ExamService = class ExamService {
    prisma;
    cacheService;
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
    }
    async invalidateCache() {
        await this.cacheService.safeInvalidate(['exams_all'], ['exam_details_*']);
    }
    async create(data) {
        const { subjectIds, ...examData } = data;
        const targetSubjects = subjectIds || [];
        const exam = await this.prisma.exam.create({
            data: {
                ...examData,
                subjects: {
                    connect: targetSubjects.map((id) => ({ id })),
                },
            },
            include: { subjects: true },
        });
        await this.invalidateCache();
        return exam;
    }
    async update(id, updateData) {
        const { subjectIds, ...data } = updateData;
        const targetSubjects = subjectIds;
        if (targetSubjects) {
            const exam = await this.prisma.exam.update({
                where: { id },
                data: {
                    ...data,
                    subjects: {
                        set: [],
                        connect: targetSubjects.map((id) => ({ id })),
                    },
                },
                include: { subjects: true },
            });
            await this.invalidateCache();
            return exam;
        }
        const exam = await this.prisma.exam.update({
            where: { id },
            data: data,
            include: { subjects: true },
        });
        await this.invalidateCache();
        return exam;
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
    async findOne(id) {
        return this.prisma.exam.findUnique({
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
    async getTest(examId) {
        const exam = await this.prisma.exam.findUnique({
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
                            select: {
                                id: true,
                                subject: { select: { id: true, name: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!exam)
            throw new common_1.NotFoundException('Exam not found');
        if (exam.tests.length === 0)
            throw new common_1.NotFoundException('No tests found for this exam. Use POST to generate one.');
        const randomTest = exam.tests[Math.floor(Math.random() * exam.tests.length)];
        const { tests, ...examInfo } = exam;
        return { test: randomTest, exam: examInfo };
    }
    async generateTest(examId) {
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId, isDeleted: false },
            select: {
                id: true,
                name: true,
                noOfQuestions: true,
                subjects: { select: { id: true } },
            },
        });
        if (!exam)
            throw new common_1.NotFoundException('Exam not found');
        if (!exam.subjects || exam.subjects.length === 0) {
            throw new common_1.InternalServerErrorException('No subjects associated with this exam to generate questions');
        }
        const subjectIds = exam.subjects.map((s) => s.id);
        const questions = await this.prisma.question.findMany({
            where: { subjectId: { in: subjectIds } },
            select: { id: true },
        });
        if (questions.length === 0) {
            throw new common_1.NotFoundException('No questions available in associated subjects to generate a test');
        }
        const selectedQuestions = questions
            .sort(() => 0.5 - Math.random())
            .slice(0, exam.noOfQuestions || 100);
        const newTest = await this.prisma.test.create({
            data: {
                name: `${exam.name} Auto-Generated - ${new Date().toLocaleDateString()}`,
                examId: exam.id,
                questions: {
                    connect: selectedQuestions.map((q) => ({ id: q.id })),
                },
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                questions: {
                    select: {
                        id: true,
                        subject: { select: { id: true, name: true } },
                    },
                },
            },
        });
        return { test: newTest, exam };
    }
    async findByTier(tier) {
        return this.prisma.exam.findMany({
            where: {
                isDeleted: false,
                name: {
                    contains: `Tier ${tier}`,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                name: true,
                shortDescription: true,
                subjects: { select: { id: true, name: true } },
            },
        });
    }
    async remove(id) {
        const exam = await this.prisma.exam.delete({
            where: { id },
        });
        await this.invalidateCache();
        return exam;
    }
};
exports.ExamService = ExamService;
exports.ExamService = ExamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], ExamService);
//# sourceMappingURL=exam.service.js.map