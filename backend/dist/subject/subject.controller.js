"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SubjectController", {
    enumerable: true,
    get: function() {
        return SubjectController;
    }
});
const _common = require("@nestjs/common");
const _cachemanager = require("@nestjs/cache-manager");
const _adminauthguard = require("../auth/guards/admin-auth.guard");
const _subjectservice = require("./subject.service");
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
let SubjectController = class SubjectController {
    create(data) {
        return this.subjectService.create(data);
    }
    findAll() {
        return this.subjectService.findAll();
    }
    findOne(id) {
        return this.subjectService.findOne(+id);
    }
    update(id, data) {
        return this.subjectService.update(+id, data);
    }
    remove(id) {
        return this.subjectService.remove(+id);
    }
    constructor(subjectService){
        this.subjectService = subjectService;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_adminauthguard.AdminAuthGuard),
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], SubjectController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _cachemanager.CacheTTL)(600000),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], SubjectController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SubjectController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminauthguard.AdminAuthGuard),
    (0, _common.Patch)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], SubjectController.prototype, "update", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminauthguard.AdminAuthGuard),
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SubjectController.prototype, "remove", null);
SubjectController = _ts_decorate([
    (0, _common.Controller)('subjects'),
    (0, _common.UseInterceptors)(_cachemanager.CacheInterceptor),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _subjectservice.SubjectService === "undefined" ? Object : _subjectservice.SubjectService
    ])
], SubjectController);

//# sourceMappingURL=subject.controller.js.map