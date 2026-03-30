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
let TestService = class TestService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTestDto) {
        const { name, examId, questionIds: manualQuestionIds } = createTestDto;
        let questionIdsToConnect = [];
        if (manualQuestionIds && manualQuestionIds.length > 0) {
            const existingQuestions = await this.prisma.question.findMany({
                where: { id: { in: manualQuestionIds } },
                select: { id: true }
            });
            if (existingQuestions.length !== manualQuestionIds.length) {
                const existingIds = existingQuestions.map(q => q.id);
                const missingIds = manualQuestionIds.filter(id => !existingIds.includes(id));
                throw new common_1.BadRequestException(`Some question IDs do not exist: ${missingIds.join(', ')}`);
            }
            questionIdsToConnect = manualQuestionIds.map(id => ({ id }));
        }
        else {
            const exam = await this.prisma.exam.findUnique({
                where: { id: examId },
                include: { subjects: true }
            });
            if (!exam)
                throw new common_1.BadRequestException('Exam not found');
            if (!exam.subjects || exam.subjects.length === 0) {
                throw new common_1.BadRequestException('This exam has no associated subjects and no manual questionIds provided. Please add subjects to the exam or provide questionIds.');
            }
            const subjectIds = exam.subjects.map(s => s.id);
            const questions = await this.prisma.question.findMany({
                where: { subjectId: { in: subjectIds } },
                select: { id: true }
            });
            if (questions.length === 0) {
                throw new common_1.BadRequestException('No questions found for the subjects associated with this exam. Please add questions to the subjects first.');
            }
            const targetCount = exam.noOfQuestions || 100;
            questionIdsToConnect = questions
                .sort(() => 0.5 - Math.random())
                .slice(0, targetCount)
                .map(q => ({ id: q.id }));
        }
        if (questionIdsToConnect.length === 0) {
            throw new common_1.BadRequestException('Cannot create a test with zero questions. Please provide questionIds or ensure the exam subjects have questions.');
        }
        return this.prisma.test.create({
            data: {
                name,
                examId,
                questions: {
                    connect: questionIdsToConnect
                }
            },
            include: {
                questions: {
                    select: { id: true }
                },
                exam: true
            }
        });
    }
    findAll() {
        return this.prisma.test.findMany({
            include: {
                exam: true,
                _count: {
                    select: { questions: true }
                }
            },
            take: 50,
            orderBy: { createdAt: 'desc' }
        });
    }
    findOne(id) {
        return this.prisma.test.findUnique({
            where: { id },
            include: {
                exam: true,
                questions: true
            }
        });
    }
    update(id, updateTestDto) {
        return this.prisma.test.update({
            where: { id },
            data: updateTestDto
        });
    }
    remove(id) {
        return this.prisma.test.delete({
            where: { id }
        });
    }
};
exports.TestService = TestService;
exports.TestService = TestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TestService);
//# sourceMappingURL=test.service.js.map