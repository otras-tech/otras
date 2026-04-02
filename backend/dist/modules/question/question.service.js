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
exports.QuestionService = void 0;
const common_1 = require("@nestjs/common");
const question_repository_1 = require("./repository/question.repository");
let QuestionService = class QuestionService {
    questionRepository;
    constructor(questionRepository) {
        this.questionRepository = questionRepository;
    }
    create(data) {
        const { subjectId, ...rest } = data;
        return this.questionRepository.create({
            ...rest,
            subject: { connect: { id: subjectId } },
        });
    }
    findAll(query) {
        const where = {};
        if (query?.subjectId)
            where.subjectId = query.subjectId;
        if (query?.examId) {
            where.tests = { some: { examId: query.examId } };
        }
        return this.questionRepository.findAll(where);
    }
    async findOne(id) {
        const question = await this.questionRepository.findById(id);
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        return question;
    }
    update(id, data) {
        const { subjectId, ...rest } = data;
        const updateData = { ...rest };
        if (subjectId) {
            updateData.subject = { connect: { id: subjectId } };
        }
        return this.questionRepository.update(id, updateData);
    }
    remove(id) {
        return this.questionRepository.softDelete(id);
    }
};
exports.QuestionService = QuestionService;
exports.QuestionService = QuestionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [question_repository_1.QuestionRepository])
], QuestionService);
//# sourceMappingURL=question.service.js.map