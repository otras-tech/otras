"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StudyPlanController", {
    enumerable: true,
    get: function() {
        return StudyPlanController;
    }
});
const _common = require("@nestjs/common");
const _studyplanservice = require("../service/study-plan.service");
const _createstudyplandto = require("../dto/create-study-plan.dto");
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
let StudyPlanController = class StudyPlanController {
    async generate(dto) {
        try {
            console.log('Processing StudyPlan generate request...');
            const result = await this.studyPlanService.generate(dto);
            console.log('StudyPlan generation successful in controller.');
            return result;
        } catch (e) {
            console.error('FATAL: StudyPlan Controller Generate Error:', e);
            throw e;
        }
    }
    async save(body) {
        console.log('Saving StudyPlan:', body.dto.targetExam);
        return this.studyPlanService.save(body.dto, body.aiData);
    }
    async findByUserId(userId) {
        return this.studyPlanService.findByUserId(userId);
    }
    async findOne(id) {
        return this.studyPlanService.findOne(id);
    }
    async updateActivity(activityId, userId, completed, missed) {
        return this.studyPlanService.updateActivityStatus(activityId, userId, {
            completed,
            missed
        });
    }
    async nextDay(id) {
        return this.studyPlanService.moveToNextDay(id);
    }
    async simulateDayPassed(id) {
        return this.studyPlanService.simulateDayPassed(id);
    }
    async simulateDateChange(id) {
        console.log('Simulate date change triggered for:', id);
        return this.studyPlanService.moveMissedTasks(id);
    }
    async delete(id) {
        return this.studyPlanService.delete(id);
    }
    constructor(studyPlanService){
        this.studyPlanService = studyPlanService;
    }
};
_ts_decorate([
    (0, _common.Post)('generate'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createstudyplandto.CreateStudyPlanDto === "undefined" ? Object : _createstudyplandto.CreateStudyPlanDto
    ]),
    _ts_metadata("design:returntype", Promise)
], StudyPlanController.prototype, "generate", null);
_ts_decorate([
    (0, _common.Post)('save'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], StudyPlanController.prototype, "save", null);
_ts_decorate([
    (0, _common.Get)('user/:userId'),
    _ts_param(0, (0, _common.Param)('userId', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], StudyPlanController.prototype, "findByUserId", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], StudyPlanController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)('activity/:activityId'),
    _ts_param(0, (0, _common.Param)('activityId')),
    _ts_param(1, (0, _common.Body)('userId', _common.ParseIntPipe)),
    _ts_param(2, (0, _common.Body)('completed')),
    _ts_param(3, (0, _common.Body)('missed')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Number,
        Boolean,
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], StudyPlanController.prototype, "updateActivity", null);
_ts_decorate([
    (0, _common.Post)(':id/next-day'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], StudyPlanController.prototype, "nextDay", null);
_ts_decorate([
    (0, _common.Post)(':id/simulate-day-passed'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], StudyPlanController.prototype, "simulateDayPassed", null);
_ts_decorate([
    (0, _common.Post)('simulate-date-change/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], StudyPlanController.prototype, "simulateDateChange", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], StudyPlanController.prototype, "delete", null);
StudyPlanController = _ts_decorate([
    (0, _common.Controller)('study-plan'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _studyplanservice.StudyPlanService === "undefined" ? Object : _studyplanservice.StudyPlanService
    ])
], StudyPlanController);

//# sourceMappingURL=study-plan.controller.js.map