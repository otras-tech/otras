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
exports.MockTestController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const mock_test_service_1 = require("./mock-test.service");
const mock_test_dto_1 = require("./dto/mock-test.dto");
const throttler_1 = require("@nestjs/throttler");
const swagger_1 = require("@nestjs/swagger");
let MockTestController = class MockTestController {
    mockTestService;
    constructor(mockTestService) {
        this.mockTestService = mockTestService;
    }
    async findAll(categoryId, cursor) {
        return this.mockTestService.findAll(categoryId, cursor);
    }
    async startAttempt(dto, req) {
        if (req.user.otrId !== dto.otrId) {
            throw new common_1.ForbiddenException('Cannot start attempt for another user');
        }
        return this.mockTestService.startAttempt(dto);
    }
    async submitAttempt(dto, req) {
        if (req.user.otrId !== dto.otrId) {
            throw new common_1.ForbiddenException('Cannot submit for another user');
        }
        return this.mockTestService.submitAttempt(dto);
    }
    async submitExamAttempt(dto, req) {
        if (req.user.otrId !== dto.otrId) {
            throw new common_1.ForbiddenException('Cannot submit for another user');
        }
        return this.mockTestService.submitExamAttempt(dto);
    }
    async getRecentAttempt(otrId, req) {
        if (req.user.otrId !== otrId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.mockTestService.getUserMockAttempts(otrId);
    }
    async calculateRank(mockTestId, otrId, req) {
        if (req.user.otrId !== otrId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.mockTestService.calculateRank(mockTestId, otrId);
    }
    async findOne(id) {
        return this.mockTestService.findOne(id);
    }
};
exports.MockTestController = MockTestController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all mock tests with optional filtering' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, description: 'Filter by category ID' }),
    (0, swagger_1.ApiQuery)({ name: 'cursor', required: false, description: 'Pagination cursor (ID)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of mock tests' }),
    __param(0, (0, common_1.Query)('categoryId', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('cursor', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MockTestController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('start-attempt'),
    (0, swagger_1.ApiOperation)({ summary: 'Start a new mock test attempt' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attempt started' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mock_test_dto_1.StartMockAttemptDto, Object]),
    __metadata("design:returntype", Promise)
], MockTestController.prototype, "startAttempt", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('attempts'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a standard mock test attempt' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attempt submitted' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mock_test_dto_1.SubmitMockAttemptDto, Object]),
    __metadata("design:returntype", Promise)
], MockTestController.prototype, "submitAttempt", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('exam-attempts'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a structured exam attempt' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Exam attempt submitted' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mock_test_dto_1.SubmitExamAttemptDto, Object]),
    __metadata("design:returntype", Promise)
], MockTestController.prototype, "submitExamAttempt", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('attempts/recent/:otrId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent mock test attempts for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns recent attempts' }),
    __param(0, (0, common_1.Param)('otrId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MockTestController.prototype, "getRecentAttempt", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('rank/:mockTestId/:otrId'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate user rank in a specific mock test' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns rank details' }),
    __param(0, (0, common_1.Param)('mockTestId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('otrId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], MockTestController.prototype, "calculateRank", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of a specific mock test' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mock test details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Mock test not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MockTestController.prototype, "findOne", null);
exports.MockTestController = MockTestController = __decorate([
    (0, swagger_1.ApiTags)('Mock Tests'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('mock-test'),
    __metadata("design:paramtypes", [mock_test_service_1.MockTestService])
], MockTestController);
//# sourceMappingURL=mock-test.controller.js.map