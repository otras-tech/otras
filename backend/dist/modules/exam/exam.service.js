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
const exam_repository_1 = require("./repository/exam.repository");
const cache_service_1 = require("../../common/cache/cache.service");
let ExamService = class ExamService {
    examRepository;
    cacheService;
    constructor(examRepository, cacheService) {
        this.examRepository = examRepository;
        this.cacheService = cacheService;
    }
    async invalidateCache() {
        await this.cacheService.safeInvalidate(['exams_all'], ['exam_details_*']);
    }
    async create(data) {
        const { subjectIds, ...examData } = data;
        const targetSubjects = subjectIds || [];
        const exam = await this.examRepository.create({
            ...examData,
            subjects: { connect: targetSubjects.map((id) => ({ id })) },
        });
        await this.invalidateCache();
        return exam;
    }
    async update(id, updateData) {
        const { subjectIds, ...data } = updateData;
        const updateInput = { ...data };
        if (subjectIds) {
            updateInput.subjects = {
                set: [],
                connect: subjectIds.map((id) => ({ id })),
            };
        }
        const exam = await this.examRepository.update(id, updateInput);
        await this.invalidateCache();
        return exam;
    }
    async findAll(cursor, take) {
        return this.examRepository.findAll(cursor, take);
    }
    async findOne(id) {
        return this.examRepository.findById(id);
    }
    async getTest(examId) {
        const exam = await this.examRepository.findWithTests(examId);
        if (!exam)
            throw new common_1.NotFoundException('Exam not found');
        if (exam.tests.length === 0) {
            throw new common_1.NotFoundException('No tests found for this exam. Use POST to generate one.');
        }
        const randomTest = exam.tests[Math.floor(Math.random() * exam.tests.length)];
        const { tests, ...examInfo } = exam;
        return { test: randomTest, exam: examInfo };
    }
    async generateTest(examId) {
        const exam = await this.examRepository.findForTestGeneration(examId);
        if (!exam)
            throw new common_1.NotFoundException('Exam not found');
        const subjectIds = exam.subjects.map((s) => s.id);
        const totalQuestions = await this.examRepository.countQuestions(subjectIds);
        if (totalQuestions === 0) {
            throw new common_1.NotFoundException('No questions available in associated subjects to generate a test');
        }
        const testSize = exam.noOfQuestions || 100;
        const selectedQuestionIds = [];
        const usedOffsets = new Set();
        if (testSize > totalQuestions / 2) {
            const allQs = await this.examRepository.findAllQuestionIds(subjectIds);
            selectedQuestionIds.push(...allQs
                .sort(() => 0.5 - Math.random())
                .slice(0, testSize)
                .map((q) => q.id));
        }
        else {
            while (selectedQuestionIds.length < testSize &&
                usedOffsets.size < totalQuestions) {
                const randomOffset = Math.floor(Math.random() * totalQuestions);
                if (!usedOffsets.has(randomOffset)) {
                    usedOffsets.add(randomOffset);
                    const [question] = await this.examRepository.findQuestionAtOffset(subjectIds, randomOffset);
                    if (question)
                        selectedQuestionIds.push(question.id);
                }
            }
        }
        const newTest = await this.examRepository.createTest({
            name: `${exam.name} Auto-Generated - ${new Date().toLocaleDateString()}`,
            exam: { connect: { id: exam.id } },
            questions: { connect: selectedQuestionIds.map((id) => ({ id })) },
        });
        return { test: newTest, exam };
    }
    async findByTier(tier) {
        return this.examRepository.findByTier(tier);
    }
    async remove(id) {
        const exam = await this.examRepository.softDelete(id);
        await this.invalidateCache();
        return exam;
    }
};
exports.ExamService = ExamService;
exports.ExamService = ExamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [exam_repository_1.ExamRepository,
        cache_service_1.CacheService])
], ExamService);
//# sourceMappingURL=exam.service.js.map