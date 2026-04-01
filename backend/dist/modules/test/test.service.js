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
exports.TestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
let TestService = class TestService {
    prisma;
    cacheService;
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
    }
    async invalidateCache() {
        await this.cacheService.safeInvalidate(['tests_all'], ['test_details_*']);
    }
    async create(createTestDto) {
        const { name, examId, questionIds: manualQuestionIds } = createTestDto;
        let questionIdsToConnect = [];
        if (manualQuestionIds && manualQuestionIds.length > 0) {
            const existingQuestions = await this.prisma.question.findMany({
                where: { id: { in: manualQuestionIds } },
                select: { id: true },
            });
            if (existingQuestions.length !== manualQuestionIds.length) {
                const existingIds = existingQuestions.map((q) => q.id);
                const missingIds = manualQuestionIds.filter((id) => !existingIds.includes(id));
                throw new common_1.BadRequestException(`Some question IDs do not exist: ${missingIds.join(', ')}`);
            }
            questionIdsToConnect = manualQuestionIds.map((id) => ({ id }));
        }
        else {
            const exam = await this.prisma.exam.findUnique({
                where: { id: examId },
                include: { subjects: true },
            });
            if (!exam)
                throw new common_1.BadRequestException('Exam not found');
            if (!exam.subjects || exam.subjects.length === 0) {
                throw new common_1.BadRequestException('This exam has no associated subjects and no manual questionIds provided. Please add subjects to the exam or provide questionIds.');
            }
            const subjectIds = exam.subjects.map((s) => s.id);
            const questions = await this.prisma.question.findMany({
                where: { subjectId: { in: subjectIds } },
                select: { id: true },
            });
            if (questions.length === 0) {
                throw new common_1.BadRequestException('No questions found for the subjects associated with this exam. Please add questions to the subjects first.');
            }
            const targetCount = exam.noOfQuestions || 100;
            questionIdsToConnect = questions
                .sort(() => 0.5 - Math.random())
                .slice(0, targetCount)
                .map((q) => ({ id: q.id }));
        }
        if (questionIdsToConnect.length === 0) {
            throw new common_1.BadRequestException('Cannot create a test with zero questions. Please provide questionIds or ensure the exam subjects have questions.');
        }
        const test = await this.prisma.test.create({
            data: {
                name,
                examId,
                questions: {
                    connect: questionIdsToConnect,
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
        await this.invalidateCache();
        return test;
    }
    findAll(cursor, take) {
        const safeTake = Math.min(take || 20, 100);
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
            take: safeTake,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    findOne(id) {
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
    async update(id, updateTestDto) {
        const test = await this.prisma.test.update({
            where: { id },
            data: {
                name: updateTestDto.name,
                examId: updateTestDto.examId,
            },
        });
        await this.invalidateCache();
        return test;
    }
    async remove(id) {
        const test = await this.prisma.test.delete({
            where: { id },
        });
        await this.invalidateCache();
        return test;
    }
};
exports.TestService = TestService;
exports.TestService = TestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], TestService);
//# sourceMappingURL=test.service.js.map