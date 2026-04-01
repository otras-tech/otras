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
exports.ResultController = void 0;
const common_1 = require("@nestjs/common");
const result_service_1 = require("./result.service");
const result_dto_1 = require("./dto/result.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const throttler_1 = require("@nestjs/throttler");
const swagger_1 = require("@nestjs/swagger");
let ResultController = class ResultController {
    resultService;
    constructor(resultService) {
        this.resultService = resultService;
    }
    async start(dto, req) {
        if (req.user.id !== dto.userId) {
            throw new common_1.ForbiddenException('Cannot start test for another user');
        }
        return this.resultService.startTest(dto.userId, dto.testId, dto.tier);
    }
    async submit(dto, req) {
        if (req.user.id !== dto.userId) {
            throw new common_1.ForbiddenException('Cannot submit test for another user');
        }
        return this.resultService.calculateAndSave(dto);
    }
    async getUserResults(userId, req, cursor) {
        if (req.user.id !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.resultService.getUserResults(userId, cursor);
    }
};
exports.ResultController = ResultController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start a new test attempt' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Test started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Ownership mismatch' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [result_dto_1.StartTestDto, Object]),
    __metadata("design:returntype", Promise)
], ResultController.prototype, "start", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit test answers for calculation' }),
    (0, swagger_1.ApiResponse)({ status: 202, description: 'Submission accepted and queued' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Validation failed' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [result_dto_1.SubmitTestDto, Object]),
    __metadata("design:returntype", Promise)
], ResultController.prototype, "submit", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all test results for a user' }),
    (0, swagger_1.ApiQuery)({
        name: 'cursor',
        required: false,
        description: 'Pagination cursor (ID)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns a list of results' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('cursor', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Number]),
    __metadata("design:returntype", Promise)
], ResultController.prototype, "getUserResults", null);
exports.ResultController = ResultController = __decorate([
    (0, swagger_1.ApiTags)('Results'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('results'),
    __metadata("design:paramtypes", [result_service_1.ResultService])
], ResultController);
//# sourceMappingURL=result.controller.js.map