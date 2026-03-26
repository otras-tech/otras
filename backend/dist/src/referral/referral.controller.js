"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralController = void 0;
const common_1 = require("@nestjs/common");
const referral_service_1 = require("./referral.service");
const swagger_1 = require("@nestjs/swagger");
const referral_dto_1 = require("./dto/referral.dto");
let ReferralController = class ReferralController {
    referralService;
    constructor(referralService) {
        this.referralService = referralService;
    }
    createReferral(dto) {
        return this.referralService.createReferral(dto.referrerId, dto.refereeOtrId);
    }
    getReferralStats(referrerId) {
        return this.referralService.getReferralStats(referrerId);
    }
    getReferralHistory(referrerId) {
        return this.referralService.getReferralHistory(referrerId);
    }
    getRewards(userId) {
        return this.referralService.getRewards(userId);
    }
    getAllReferrals() {
        return this.referralService.getAllReferrals();
    }
};
exports.ReferralController = ReferralController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new referral link between users' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Referral created' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [referral_dto_1.CreateReferralDto]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "createReferral", null);
__decorate([
    (0, common_1.Get)('stats/:referrerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get summary stats of referrals for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Referral statistics' }),
    __param(0, (0, common_1.Param)('referrerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "getReferralStats", null);
__decorate([
    (0, common_1.Get)('history/:referrerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed referral history for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of referrals made' }),
    __param(0, (0, common_1.Param)('referrerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "getReferralHistory", null);
__decorate([
    (0, common_1.Get)('rewards/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending/earned referral rewards for a user' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "getRewards", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all referrals in the system (Admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "getAllReferrals", null);
exports.ReferralController = ReferralController = __decorate([
    (0, swagger_1.ApiTags)('Referrals'),
    (0, common_1.Controller)('referrals'),
    __metadata("design:paramtypes", [referral_service_1.ReferralService])
], ReferralController);
//# sourceMappingURL=referral.controller.js.map