"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExamController", {
    enumerable: true,
    get: function() {
        return ExamController;
    }
});
const _common = require("@nestjs/common");
const _examservice = require("./exam.service");
const _adminauthguard = require("../auth/guards/admin-auth.guard");
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
let ExamController = class ExamController {
    findAll() {
        return this.examService.findAll();
    }
    findOne(id) {
        return this.examService.findOne(+id);
    }
    getRandomTest(id) {
        return this.examService.getRandomTest(+id);
    }
    create(createExamDto) {
        return this.examService.create(createExamDto);
    }
    update(id, updateExamDto) {
        return this.examService.update(+id, updateExamDto);
    }
    remove(id) {
        return this.examService.remove(+id);
    }
    constructor(examService){
        this.examService = examService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ExamController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ExamController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Get)(':id/random-test'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ExamController.prototype, "getRandomTest", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_adminauthguard.AdminAuthGuard),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], ExamController.prototype, "create", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _common.UseGuards)(_adminauthguard.AdminAuthGuard),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], ExamController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.UseGuards)(_adminauthguard.AdminAuthGuard),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ExamController.prototype, "remove", null);
ExamController = _ts_decorate([
    (0, _common.Controller)('exams'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _examservice.ExamService === "undefined" ? Object : _examservice.ExamService
    ])
], ExamController);

//# sourceMappingURL=exam.controller.js.map