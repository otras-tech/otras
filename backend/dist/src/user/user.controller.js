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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_service_1 = require("./user.service");
const result_service_1 = require("../result/result.service");
const mock_test_service_1 = require("../mock-test/mock-test.service");
let UserController = class UserController {
    userService;
    resultService;
    mockTestService;
    constructor(userService, resultService, mockTestService) {
        this.userService = userService;
        this.resultService = resultService;
        this.mockTestService = mockTestService;
    }
    async findAll() {
        return this.userService.findAll();
    }
    async findOne(id) {
        return this.userService.findById(id);
    }
    async getDashboardData(id) {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const results = await this.resultService.getUserResults(id);
        const mockAttempts = await this.mockTestService.getUserMockAttempts(user.otrId);
        const mergedAttempts = [
            ...results.map(r => {
                const totalQs = r.test?._count?.questions || 1;
                return {
                    id: `res_${r.id}`,
                    score: r.score,
                    percentage: Math.min(Math.round((r.score / totalQs) * 100), 100),
                    createdAt: r.createdAt,
                    testName: r.test?.name || 'Artha Assessment',
                    type: 'artha',
                    subjectBreakdown: r.subjectBreakdown
                };
            }),
            ...mockAttempts.map(m => ({
                id: `mock_${m.id}`,
                score: m.score,
                percentage: m.totalMarks > 0
                    ? (m.correctAnswers != null
                        ? Math.min(Math.round((m.correctAnswers / m.totalMarks) * 100), 100)
                        : Math.max(0, Math.min(Math.round((m.score / m.totalMarks) * 100), 100)))
                    : 0,
                createdAt: m.attemptedAt,
                testName: m.mockTest?.title || 'Official Mock Test',
                type: 'mock',
                subjectBreakdown: m.subjectBreakdown
            }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const arthaProfile = await this.userService.getArthaProfile(id.toString());
        let readinessIndex = 0;
        if (arthaProfile && arthaProfile.readinessIndex > 0) {
            readinessIndex = Math.round(arthaProfile.readinessIndex);
        }
        else if (arthaProfile && arthaProfile.percentile > 0) {
            readinessIndex = Math.round(arthaProfile.percentile);
        }
        else {
            const latestAttempt = mergedAttempts[0];
            readinessIndex = latestAttempt ? latestAttempt.percentage : 0;
        }
        return {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                otrId: user.otrId,
                email: user.email,
            },
            stats: {
                readinessIndex,
                testsCompleted: mergedAttempts.length,
                recentTend: mergedAttempts.slice(0, 7).reverse().map(r => r.percentage),
                percentile: arthaProfile?.percentile || 0,
                logicalScore: arthaProfile?.logicalScore || 0,
                quantScore: arthaProfile?.quantScore || 0,
                verbalScore: arthaProfile?.verbalScore || 0,
            },
            mockTests: mergedAttempts.map(a => ({
                score: a.percentage,
                createdAt: a.createdAt,
                subjectBreakdown: a.subjectBreakdown
            })),
            recentResults: mergedAttempts.slice(0, 3).map(a => ({
                id: a.id,
                score: a.score,
                percentage: a.percentage,
                createdAt: a.createdAt,
                test: { name: a.testName }
            }))
        };
    }
    async update(id, data) {
        return this.userService.update(id, data);
    }
    async remove(id) {
        return this.userService.remove(id);
    }
    async getTierStatus(id) {
        return this.userService.getTierStatus(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Find all users (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all users' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User record' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Get)(':id/dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unified dashboard data (Results + Mock Attempts)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Aggregated dashboard statistics' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDashboardData", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/tier-status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTierStatus", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        result_service_1.ResultService,
        mock_test_service_1.MockTestService])
], UserController);
//# sourceMappingURL=user.controller.js.map