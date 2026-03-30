"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiController", {
    enumerable: true,
    get: function() {
        return AiController;
    }
});
const _common = require("@nestjs/common");
const _airequestdto = require("./dto/ai-request.dto");
const _aiservice = require("./ai.service");
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
let AiController = class AiController {
    async generateRoadmap(dto) {
        return this.aiService.generate(dto);
    }
    constructor(aiService){
        this.aiService = aiService;
    }
};
_ts_decorate([
    (0, _common.Post)('roadmap'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _airequestdto.AiRequestDto === "undefined" ? Object : _airequestdto.AiRequestDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AiController.prototype, "generateRoadmap", null);
AiController = _ts_decorate([
    (0, _common.Controller)('ai'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aiservice.AiService === "undefined" ? Object : _aiservice.AiService
    ])
], AiController);

//# sourceMappingURL=ai.controller.js.map