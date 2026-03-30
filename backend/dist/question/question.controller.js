"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "QuestionController", {
    enumerable: true,
    get: function() {
        return QuestionController;
    }
});
const _common = require("@nestjs/common");
const _questionservice = require("./question.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let QuestionController = class QuestionController {
    create(data) {
        return this.questionService.create(data);
    }
    findAll(examId, subjectId) {
        return this.questionService.findAll({
            examId: examId ? +examId : undefined,
            subjectId: subjectId ? +subjectId : undefined
        });
    }
    findOne(id) {
        return this.questionService.findOne(+id);
    }
    update(id, data) {
        return this.questionService.update(+id, data);
    }
    remove(id) {
        return this.questionService.remove(+id);
    }
    constructor(questionService){
        this.questionService = questionService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], QuestionController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Query)('examId')),
    _ts_param(1, (0, _common.Query)('subjectId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], QuestionController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], QuestionController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], QuestionController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], QuestionController.prototype, "remove", null);
QuestionController = _ts_decorate([
    (0, _common.Controller)('question'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _questionservice.QuestionService === "undefined" ? Object : _questionservice.QuestionService
    ])
], QuestionController);

//# sourceMappingURL=question.controller.js.map