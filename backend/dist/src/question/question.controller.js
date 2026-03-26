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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionController = void 0;
const common_1 = require("@nestjs/common");
const question_service_1 = require("./question.service");
const swagger_1 = require("@nestjs/swagger");
const create_question_dto_1 = require("./dto/create-question.dto");
let QuestionController = class QuestionController {
    questionService;
    constructor(questionService) {
        this.questionService = questionService;
    }
    create(data) {
        return this.questionService.create(data);
    }
    findAll(examId, subjectId) {
        return this.questionService.findAll({
            examId: examId ? +examId : undefined,
            subjectId: subjectId ? +subjectId : undefined,
        });
    }
    findOne(id) {
        return this.questionService.findOne(id);
    }
    update(id, data) {
        return this.questionService.update(id, data);
    }
    remove(id) {
        return this.questionService.remove(id);
    }
};
exports.QuestionController = QuestionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new question in the bank' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Question created' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_question_dto_1.CreateQuestionDto]),
    __metadata("design:returntype", void 0)
], QuestionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all questions with optional filtering' }),
    (0, swagger_1.ApiQuery)({ name: 'examId', required: false, description: 'Filter by Exam ID' }),
    (0, swagger_1.ApiQuery)({ name: 'subjectId', required: false, description: 'Filter by Subject ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of questions' }),
    __param(0, (0, common_1.Query)('examId')),
    __param(1, (0, common_1.Query)('subjectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QuestionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get question details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question details' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], QuestionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a question' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], QuestionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a question' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], QuestionController.prototype, "remove", null);
exports.QuestionController = QuestionController = __decorate([
    (0, swagger_1.ApiTags)('Questions'),
    (0, common_1.Controller)('question'),
    __metadata("design:paramtypes", [question_service_1.QuestionService])
], QuestionController);
//# sourceMappingURL=question.controller.js.map