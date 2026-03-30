"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReferralController", {
    enumerable: true,
    get: function() {
        return ReferralController;
    }
});
const _common = require("@nestjs/common");
const _referralservice = require("./referral.service");
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
let CreateReferralDto = class CreateReferralDto {
    constructor(){
        this.referrerId = 0;
        this.refereeOtrId = '';
    }
};
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], CreateReferralDto.prototype, "referrerId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateReferralDto.prototype, "refereeOtrId", void 0);
let ReferralController = class ReferralController {
    createReferral(body) {
        return this.referralService.createReferral(body.referrerId, body.refereeOtrId);
    }
    getReferralStats(referrerId) {
        return this.referralService.getReferralStats(+referrerId);
    }
    getReferralHistory(referrerId) {
        return this.referralService.getReferralHistory(+referrerId);
    }
    getRewards(userId) {
        return this.referralService.getRewards(+userId);
    }
    getAllReferrals() {
        return this.referralService.getAllReferrals();
    }
    constructor(referralService){
        this.referralService = referralService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CreateReferralDto === "undefined" ? Object : CreateReferralDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ReferralController.prototype, "createReferral", null);
_ts_decorate([
    (0, _common.Get)('stats/:referrerId'),
    _ts_param(0, (0, _common.Param)('referrerId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ReferralController.prototype, "getReferralStats", null);
_ts_decorate([
    (0, _common.Get)('history/:referrerId'),
    _ts_param(0, (0, _common.Param)('referrerId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ReferralController.prototype, "getReferralHistory", null);
_ts_decorate([
    (0, _common.Get)('rewards/:userId'),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ReferralController.prototype, "getRewards", null);
_ts_decorate([
    (0, _common.Get)('admin/all'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ReferralController.prototype, "getAllReferrals", null);
ReferralController = _ts_decorate([
    (0, _common.Controller)('referrals'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _referralservice.ReferralService === "undefined" ? Object : _referralservice.ReferralService
    ])
], ReferralController);

//# sourceMappingURL=referral.controller.js.map