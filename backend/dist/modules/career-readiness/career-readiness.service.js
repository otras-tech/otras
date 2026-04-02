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
var CareerReadinessService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerReadinessService = void 0;
const common_1 = require("@nestjs/common");
const career_readiness_repository_1 = require("./repository/career-readiness.repository");
let CareerReadinessService = CareerReadinessService_1 = class CareerReadinessService {
    repository;
    logger = new common_1.Logger(CareerReadinessService_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    async saveResult(requesterOtrId, data) {
        if (requesterOtrId !== data.otrId) {
            throw new common_1.ForbiddenException('Cannot submit career readiness result for another user');
        }
        const testId = Number(data.testId);
        if (isNaN(testId)) {
            throw new Error(`Invalid testId: ${data.testId}`);
        }
        this.logger.log(`Saving career readiness result for user ${data.otrId}, test ${testId}`);
        const test = await this.repository.findTestById(testId);
        if (!test) {
            this.logger.error(`Test ${testId} not found`);
            throw new common_1.NotFoundException(`Test with ID ${testId} not found`);
        }
        const subjectBreakdown = {};
        let correctAnswers = 0;
        let wrongAnswers = 0;
        test.questions.forEach((q) => {
            const subjectName = q.subject?.name || 'General';
            if (!subjectBreakdown[subjectName]) {
                subjectBreakdown[subjectName] = {
                    correct: 0,
                    wrong: 0,
                    unanswered: 0,
                    total: 0,
                    score: 0,
                };
            }
            subjectBreakdown[subjectName].total++;
            const userAns = data.answers.find((a) => Number(a.questionId) === q.id);
            if (userAns) {
                if (userAns.selectedOption === q.answer) {
                    correctAnswers++;
                    subjectBreakdown[subjectName].correct++;
                    subjectBreakdown[subjectName].score += 1;
                }
                else {
                    wrongAnswers++;
                    subjectBreakdown[subjectName].wrong++;
                    subjectBreakdown[subjectName].score -= 0.25;
                }
            }
            else {
                subjectBreakdown[subjectName].unanswered++;
            }
        });
        const totalMarks = test.questions.length;
        const negativeMarks = wrongAnswers * 0.25;
        const totalScore = correctAnswers - negativeMarks;
        const existing = await this.repository.findExistingScore(data.otrId, testId);
        const scoreData = {
            totalScore,
            totalMarks,
            correctAnswers,
            wrongAnswers,
            negativeMarks,
            subjectBreakdown: subjectBreakdown,
        };
        if (existing) {
            return await this.repository.updateScore(existing.id, scoreData);
        }
        else {
            return await this.repository.createScore({
                otrId: data.otrId,
                testId: testId,
                ...scoreData,
            });
        }
    }
    async getByOtrId(requesterOtrId, otrId) {
        if (requesterOtrId !== otrId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.repository.findByOtrId(otrId);
    }
};
exports.CareerReadinessService = CareerReadinessService;
exports.CareerReadinessService = CareerReadinessService = CareerReadinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [career_readiness_repository_1.CareerReadinessRepository])
], CareerReadinessService);
//# sourceMappingURL=career-readiness.service.js.map