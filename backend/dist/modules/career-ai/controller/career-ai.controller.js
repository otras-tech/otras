"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CareerAIController", {
    enumerable: true,
    get: function() {
        return CareerAIController;
    }
});
const _common = require("@nestjs/common");
const _careeraiservice = require("../service/career-ai.service");
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
let CareerAIController = class CareerAIController {
    async generateRoadmap(dto) {
        return this.careerAIService.generateRoadmap(dto);
    }
    async getStatus(jobId) {
        return this.careerAIService.getJobStatus(jobId);
    }
    constructor(careerAIService){
        this.careerAIService = careerAIService;
    }
};
_ts_decorate([
    (0, _common.Post)('generate-roadmap'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], CareerAIController.prototype, "generateRoadmap", null);
_ts_decorate([
    (0, _common.Get)('status/:jobId'),
    _ts_param(0, (0, _common.Param)('jobId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CareerAIController.prototype, "getStatus", null);
CareerAIController = _ts_decorate([
    (0, _common.Controller)('career-ai'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _careeraiservice.CareerAIService === "undefined" ? Object : _careeraiservice.CareerAIService
    ])
], CareerAIController);

//# sourceMappingURL=career-ai.controller.js.map