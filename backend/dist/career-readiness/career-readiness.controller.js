"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CareerReadinessController", {
    enumerable: true,
    get: function() {
        return CareerReadinessController;
    }
});
const _common = require("@nestjs/common");
const _careerreadinessservice = require("./career-readiness.service");
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
let CareerReadinessController = class CareerReadinessController {
    async saveResult(body) {
        console.log('Received submission request:', JSON.stringify(body, null, 2));
        try {
            const result = await this.careerReadinessService.saveResult(body);
            console.log('Successfully saved result');
            return result;
        } catch (error) {
            console.error('Error in saveResult:', error);
            throw error;
        }
    }
    async getByOtrId(otrId) {
        return this.careerReadinessService.getByOtrId(otrId);
    }
    constructor(careerReadinessService){
        this.careerReadinessService = careerReadinessService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], CareerReadinessController.prototype, "saveResult", null);
_ts_decorate([
    (0, _common.Get)(':otrId'),
    _ts_param(0, (0, _common.Param)('otrId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CareerReadinessController.prototype, "getByOtrId", null);
CareerReadinessController = _ts_decorate([
    (0, _common.Controller)('career-readiness'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _careerreadinessservice.CareerReadinessService === "undefined" ? Object : _careerreadinessservice.CareerReadinessService
    ])
], CareerReadinessController);

//# sourceMappingURL=career-readiness.controller.js.map