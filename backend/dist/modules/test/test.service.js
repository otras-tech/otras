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
const test_repository_1 = require("./repository/test.repository");
const cache_service_1 = require("../../common/cache/cache.service");
let TestService = class TestService {
    repository;
    cacheService;
    constructor(repository, cacheService) {
        this.repository = repository;
        this.cacheService = cacheService;
    }
    async invalidateCache() {
        await this.cacheService.safeInvalidate(['tests_all'], ['test_details_*']);
    }
    async create(createTestDto) {
        const { name, examId, questionIds: manualQuestionIds } = createTestDto;
        let questionIds = [];
        if (manualQuestionIds && manualQuestionIds.length > 0) {
            const existing = await this.repository.findQuestionsByIds(manualQuestionIds);
            if (existing.length !== manualQuestionIds.length) {
                const existingIds = existing.map((q) => q.id);
                const missingIds = manualQuestionIds.filter((id) => !existingIds.includes(id));
                throw new common_1.BadRequestException(`Some question IDs do not exist: ${missingIds.join(', ')}`);
            }
            questionIds = manualQuestionIds;
        }
        else {
            const exam = await this.repository.findExamWithSubjects(examId);
            if (!exam)
                throw new common_1.BadRequestException('Exam not found');
            if (!exam.subjects || exam.subjects.length === 0) {
                throw new common_1.BadRequestException('This exam has no associated subjects. Please add subjects first.');
            }
            const subjectIds = exam.subjects.map((s) => s.id);
            const questions = await this.repository.findQuestionsBySubjectIds(subjectIds);
            if (questions.length === 0) {
                throw new common_1.BadRequestException('No questions found for the subjects associated with this exam.');
            }
            const targetCount = exam.noOfQuestions || 100;
            questionIds = questions
                .sort(() => 0.5 - Math.random())
                .slice(0, targetCount)
                .map((q) => q.id);
        }
        if (questionIds.length === 0) {
            throw new common_1.BadRequestException('Cannot create a test with zero questions.');
        }
        const test = await this.repository.createTest({ name, examId }, questionIds);
        await this.invalidateCache();
        return test;
    }
    findAll(cursor, take) {
        const safeTake = Math.min(take || 20, 100);
        return this.repository.findAll(cursor, safeTake);
    }
    async findOne(id) {
        const test = await this.repository.findById(id);
        if (!test)
            throw new common_1.NotFoundException('Test not found');
        return test;
    }
    async update(id, updateTestDto) {
        const test = await this.repository.updateTest(id, {
            name: updateTestDto.name,
            examId: updateTestDto.examId,
        });
        await this.invalidateCache();
        return test;
    }
    async remove(id) {
        const test = await this.repository.softDelete(id);
        await this.invalidateCache();
        return test;
    }
};
exports.TestService = TestService;
exports.TestService = TestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [test_repository_1.TestRepository,
        cache_service_1.CacheService])
], TestService);
//# sourceMappingURL=test.service.js.map