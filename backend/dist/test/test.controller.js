"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TestController", {
    enumerable: true,
    get: function() {
        return TestController;
    }
});
const _common = require("@nestjs/common");
const _testservice = require("./test.service");
const _createtestdto = require("./dto/create-test.dto");
const _updatetestdto = require("./dto/update-test.dto");
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
let TestController = class TestController {
    create(createTestDto) {
        return this.testService.create(createTestDto);
    }
    findAll() {
        return this.testService.findAll();
    }
    getPreview(examId) {
        return this.testService.getPreview(+examId);
    }
    findOne(id) {
        return this.testService.findOne(+id);
    }
    update(id, updateTestDto) {
        return this.testService.update(+id, updateTestDto);
    }
    remove(id) {
        return this.testService.remove(+id);
    }
    constructor(testService){
        this.testService = testService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createtestdto.CreateTestDto === "undefined" ? Object : _createtestdto.CreateTestDto
    ]),
    _ts_metadata("design:returntype", void 0)
], TestController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], TestController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)('preview/:examId'),
    _ts_param(0, (0, _common.Param)('examId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], TestController.prototype, "getPreview", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], TestController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updatetestdto.UpdateTestDto === "undefined" ? Object : _updatetestdto.UpdateTestDto
    ]),
    _ts_metadata("design:returntype", void 0)
], TestController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], TestController.prototype, "remove", null);
TestController = _ts_decorate([
    (0, _common.Controller)('test'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _testservice.TestService === "undefined" ? Object : _testservice.TestService
    ])
], TestController);

//# sourceMappingURL=test.controller.js.map