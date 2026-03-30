"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationController", {
    enumerable: true,
    get: function() {
        return ApplicationController;
    }
});
const _common = require("@nestjs/common");
const _applicationservice = require("./application.service");
const _classvalidator = require("class-validator");
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
let CreateApplicationDto = class CreateApplicationDto {
};
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], CreateApplicationDto.prototype, "userId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], CreateApplicationDto.prototype, "examId", void 0);
let ApplicationController = class ApplicationController {
    create(body) {
        return this.applicationService.create(body.userId, body.examId);
    }
    findByOtrId(otrId) {
        return this.applicationService.findByOtrId(otrId);
    }
    findByUser(userId) {
        return this.applicationService.findByUser(+userId);
    }
    findAll() {
        return this.applicationService.findAll();
    }
    updateStatus(id, statusData) {
        return this.applicationService.updateStatus(+id, statusData);
    }
    constructor(applicationService){
        this.applicationService = applicationService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CreateApplicationDto === "undefined" ? Object : CreateApplicationDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ApplicationController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)('user/otr/:otrId'),
    _ts_param(0, (0, _common.Param)('otrId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ApplicationController.prototype, "findByOtrId", null);
_ts_decorate([
    (0, _common.Get)('user/:userId'),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ApplicationController.prototype, "findByUser", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ApplicationController.prototype, "findAll", null);
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
], ApplicationController.prototype, "updateStatus", null);
ApplicationController = _ts_decorate([
    (0, _common.Controller)('applications'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService
    ])
], ApplicationController);

//# sourceMappingURL=application.controller.js.map