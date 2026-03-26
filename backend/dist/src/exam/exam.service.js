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
const prisma_service_1 = require("../prisma/prisma.service");
let ExamService = class ExamService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const { subjects, subjectIds, id, ...examData } = data;
        const targetSubjects = subjects || subjectIds || [];
        return this.prisma.exam.create({
            data: {
                ...examData,
                subjects: {
                    connect: targetSubjects.map((id) => ({ id })),
                },
            },
            include: { subjects: true },
        });
    }
    async update(id, updateData) {
        const { subjects, subjectIds, ...data } = updateData;
        const targetSubjects = subjects || subjectIds;
        if (targetSubjects) {
            return this.prisma.exam.update({
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
        }
        return this.prisma.exam.update({
            where: { id },
            data: data,
            include: { subjects: true },
        });
    }
    async findAll() {
        return this.prisma.exam.findMany({
            include: { subjects: true },
            take: 50
        });
    }
    async findOne(id) {
        return this.prisma.exam.findUnique({
            where: { id },
            include: { subjects: true },
        });
    }
    async getRandomTest(examId) {
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
            include: {
                tests: {
                    take: 5,
                    include: {
                        questions: {
                            include: { subject: true },
                        },
                    },
                },
                subjects: true,
            },
        });
        if (!exam) {
            throw new common_1.NotFoundException('Exam not found');
        }
        if (exam.tests.length === 0) {
            if (exam.subjects && exam.subjects.length > 0) {
                const subjectIds = exam.subjects.map(s => s.id);
                const questions = await this.prisma.question.findMany({
                    where: { subjectId: { in: subjectIds } },
                });
                if (questions.length > 0) {
                    const selectedQuestions = questions
                        .sort(() => 0.5 - Math.random())
                        .slice(0, exam.noOfQuestions || 100)
                        .map(q => ({ id: q.id }));
                    const newTest = await this.prisma.test.create({
                        data: {
                            name: `${exam.name} Auto-Generated Test`,
                            examId: exam.id,
                            questions: {
                                connect: selectedQuestions,
                            },
                        },
                        include: {
                            questions: {
                                include: { subject: true },
                            },
                        },
                    });
                    const { tests, ...examInfo } = exam;
                    return {
                        test: newTest,
                        exam: examInfo,
                    };
                }
            }
            throw new common_1.NotFoundException('No tests found for this exam and no questions available to generate one.');
        }
        const randomTest = exam.tests[Math.floor(Math.random() * exam.tests.length)];
        const { tests, ...examInfo } = exam;
        return {
            test: randomTest,
            exam: examInfo
        };
    }
    async findByTier(tier) {
        return this.prisma.exam.findMany({
            where: {
                name: {
                    contains: `Tier ${tier}`,
                    mode: 'insensitive',
                },
            },
            include: { subjects: true },
        });
    }
    async remove(id) {
        return this.prisma.exam.delete({
            where: { id },
        });
    }
};
exports.ExamService = ExamService;
exports.ExamService = ExamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamService);
//# sourceMappingURL=exam.service.js.map