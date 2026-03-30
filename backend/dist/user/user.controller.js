"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserController", {
    enumerable: true,
    get: function() {
        return UserController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
const _userservice = require("./user.service");
const _resultservice = require("../result/result.service");
const _mocktestservice = require("../mock-test/mock-test.service");
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
let UserController = class UserController {
    async ping() {
        return 'pong';
    }
    async update(id, data) {
        return this.userService.update(id, data);
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
            throw new _common.NotFoundException('User not found');
        }
        const results = await this.resultService.getUserResults(id);
        const mockAttempts = user.otrId ? await this.mockTestService.getUserMockAttempts(user.otrId) : [];
        // Normalize and merge both types of attempts for a unified history
        const mergedAttempts = [
            ...results.map((r)=>{
                const totalQs = r.test?._count?.questions || 1;
                return {
                    id: `res_${r.id}`,
                    score: r.score,
                    percentage: Math.min(Math.round(r.score / totalQs * 100), 100),
                    createdAt: r.createdAt,
                    testName: r.test?.name || 'Artha Assessment',
                    type: 'artha',
                    subjectBreakdown: r.subjectBreakdown
                };
            }),
            ...mockAttempts.map((m)=>({
                    id: `mock_${m.id}`,
                    score: m.score,
                    percentage: m.totalMarks > 0 ? m.correctAnswers != null ? Math.min(Math.round(m.correctAnswers / m.totalMarks * 100), 100) : Math.max(0, Math.min(Math.round(m.score / m.totalMarks * 100), 100)) : 0,
                    createdAt: m.attemptedAt,
                    testName: m.mockTest?.title || 'Official Mock Test',
                    type: 'mock',
                    subjectBreakdown: m.subjectBreakdown
                }))
        ].sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // Prefer ARTHA percentile as the Career Index if available
        const arthaProfile = await this.userService.getArthaProfile(id.toString());
        let readinessIndex = 0;
        if (arthaProfile && arthaProfile.readinessIndex > 0) {
            readinessIndex = Math.round(arthaProfile.readinessIndex);
        } else if (arthaProfile && arthaProfile.percentile > 0) {
            readinessIndex = Math.round(arthaProfile.percentile);
        } else {
            // Fallback: score-based calculation
            const latestAttempt = mergedAttempts[0];
            readinessIndex = latestAttempt ? latestAttempt.percentage : 0;
        }
        return {
            user: {
                firstName: user.firstName || 'CANDIDATE',
                lastName: user.lastName || '',
                otrId: user.otrId || 'REF',
                email: user.email
            },
            stats: {
                readinessIndex,
                testsCompleted: mergedAttempts.length,
                recentTend: mergedAttempts.slice(0, 7).reverse().map((r)=>r.percentage),
                percentile: arthaProfile?.percentile || 0,
                logicalScore: arthaProfile?.logicalScore || 0,
                quantScore: arthaProfile?.quantScore || 0,
                verbalScore: arthaProfile?.verbalScore || 0
            },
            mockTests: mergedAttempts.map((a)=>({
                    score: a.percentage,
                    createdAt: a.createdAt,
                    subjectBreakdown: a.subjectBreakdown
                })),
            recentResults: mergedAttempts.slice(0, 3).map((a)=>({
                    id: a.id,
                    score: a.score,
                    percentage: a.percentage,
                    createdAt: a.createdAt,
                    test: {
                        name: a.testName
                    }
                }))
        };
    }
    async remove(id) {
        return this.userService.remove(id);
    }
    async getTierStatus(id) {
        return this.userService.getTierStatus(id);
    }
    constructor(userService, resultService, mockTestService){
        this.userService = userService;
        this.resultService = resultService;
        this.mockTestService = mockTestService;
    }
};
_ts_decorate([
    (0, _common.Get)('ping'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "ping", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Patch)('profile/:id'),
    (0, _common.Put)('profile/:id'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Get)(':id/dashboard'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "getDashboardData", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
_ts_decorate([
    (0, _common.Get)(':id/tier-status'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "getTierStatus", null);
UserController = _ts_decorate([
    (0, _common.Controller)('users'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userservice.UserService === "undefined" ? Object : _userservice.UserService,
        typeof _resultservice.ResultService === "undefined" ? Object : _resultservice.ResultService,
        typeof _mocktestservice.MockTestService === "undefined" ? Object : _mocktestservice.MockTestService
    ])
], UserController);

//# sourceMappingURL=user.controller.js.map