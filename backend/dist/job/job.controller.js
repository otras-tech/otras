"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JobController", {
    enumerable: true,
    get: function() {
        return JobController;
    }
});
const _common = require("@nestjs/common");
const _jobservice = require("./job.service");
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
let JobController = class JobController {
    create(createJobDto) {
        return this.jobService.create(createJobDto);
    }
    findAll() {
        return this.jobService.findAll();
    }
    findOne(id) {
        return this.jobService.findOne(id);
    }
    constructor(jobService){
        this.jobService = jobService;
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
], JobController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], JobController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], JobController.prototype, "findOne", null);
JobController = _ts_decorate([
    (0, _common.Controller)('jobs'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jobservice.JobService === "undefined" ? Object : _jobservice.JobService
    ])
], JobController);

//# sourceMappingURL=job.controller.js.map