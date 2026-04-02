"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./repository/user.repository");
const result_service_1 = require("../result/result.service");
const mock_test_service_1 = require("../mock-test/mock-test.service");
const bcrypt = __importStar(require("bcrypt"));
let UserService = class UserService {
    userRepository;
    resultService;
    mockTestService;
    constructor(userRepository, resultService, mockTestService) {
        this.userRepository = userRepository;
        this.resultService = resultService;
        this.mockTestService = mockTestService;
    }
    async create(data) {
        const { referralCode, ...userData } = data;
        if (userData.pincode != null) {
            userData.pincode = userData.pincode.toString();
        }
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        let attempts = 0;
        const maxAttempts = 3;
        while (attempts < maxAttempts) {
            try {
                const otrId = this.generateOtrId(userData.domicile || '', userData.pincode || '');
                const tempCode = `REF${Math.floor(100000 + Math.random() * 900000)}`;
                return await this.userRepository.$transaction(async (tx) => {
                    const newUser = await tx.user.create({
                        data: {
                            ...userData,
                            password: hashedPassword,
                            otrId,
                            referralCode: tempCode,
                        },
                    });
                    if (referralCode) {
                        const referrer = await tx.user.findUnique({
                            where: { referralCode, isDeleted: false },
                        });
                        if (referrer && referrer.id !== newUser.id) {
                            await tx.user.update({
                                where: { id: referrer.id },
                                data: { credits: { increment: 10 } },
                            });
                            await tx.user.update({
                                where: { id: newUser.id },
                                data: { credits: { increment: 10 } },
                            });
                            await tx.referral.create({
                                data: {
                                    referrerId: referrer.id,
                                    refereeOtrId: newUser.otrId,
                                    creditsEarned: 10,
                                    status: 'Joined',
                                },
                            });
                        }
                    }
                    return newUser;
                });
            }
            catch (error) {
                if (error.code === 'P2002') {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        throw new common_1.ConflictException('Registration failed due to unique identifier collision. Please try again.');
                    }
                    continue;
                }
                throw error;
            }
        }
    }
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async findByOtrId(otrId) {
        return this.userRepository.findByOtrId(otrId);
    }
    async findById(id) {
        return this.userRepository.findById(id);
    }
    async findAll(cursor, take) {
        return this.userRepository.findAll(cursor, take);
    }
    async update(requesterId, requesterRole, targetId, data) {
        if (requesterId !== targetId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('You can only update your own profile');
        }
        const { password, ...updateData } = data;
        const finalData = { ...updateData };
        if (password) {
            finalData.password = await bcrypt.hash(password, 10);
        }
        return this.userRepository.update(targetId, finalData);
    }
    async remove(requesterRole, id) {
        if (requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Only admins can delete users');
        }
        return this.userRepository.softDelete(id);
    }
    async getDashboardData(requesterId, requesterRole, id) {
        if (requesterId !== id && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        const user = await this.userRepository.findByIdActive(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const [results, mockAttempts, arthaProfile] = await Promise.all([
            this.resultService.getUserResults(id, undefined, 10),
            this.mockTestService.getUserMockAttempts(user.otrId, user.otrId, undefined),
            this.userRepository.getArthaProfile(id.toString()),
        ]);
        const mergedAttempts = [
            ...results.map((r) => ({
                id: `res_${r.id}`,
                score: r.score,
                percentage: Math.min(Math.round((r.score / (r.test?._count?.questions || 1)) * 100), 100),
                createdAt: r.createdAt,
                testName: r.test?.name || 'Artha Assessment',
                type: 'artha',
                subjectBreakdown: r.subjectBreakdown,
            })),
            ...mockAttempts.map((m) => ({
                id: `mock_${m.id}`,
                score: m.score,
                percentage: m.totalMarks > 0 ? Math.round((m.score / m.totalMarks) * 100) : 0,
                createdAt: m.attemptedAt,
                testName: m.mockTest?.title || 'Official Mock Test',
                type: 'mock',
                subjectBreakdown: m.subjectBreakdown,
            })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const readinessIndex = arthaProfile?.readinessIndex || mergedAttempts[0]?.percentage || 0;
        return {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                otrId: user.otrId,
                email: user.email,
            },
            stats: {
                readinessIndex: Math.round(readinessIndex),
                testsCompleted: mergedAttempts.length,
                recentTend: mergedAttempts
                    .slice(0, 7)
                    .reverse()
                    .map((r) => r.percentage),
                percentile: arthaProfile?.percentile || 0,
                logicalScore: arthaProfile?.logicalScore || 0,
                quantScore: arthaProfile?.quantScore || 0,
                verbalScore: arthaProfile?.verbalScore || 0,
            },
            recentResults: mergedAttempts.slice(0, 5).map((a) => ({
                id: a.id,
                score: Number(a.score.toFixed(1)),
                percentage: a.percentage,
                createdAt: a.createdAt,
                test: { name: a.testName },
            })),
        };
    }
    async getArthaProfile(userId) {
        return this.userRepository.getArthaProfile(userId);
    }
    async getTierStatus(requesterId, requesterRole, id) {
        if (requesterId !== id && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        const oneYearAgo = new Date();
        oneYearAgo.setDate(oneYearAgo.getDate() - 365);
        const [profile, activePayment, anyPastPayment] = await Promise.all([
            this.userRepository.getArthaProfile(id.toString()),
            this.userRepository.getActivePayment(id, oneYearAgo),
            this.userRepository.getAnyPastPayment(id),
        ]);
        const hasActiveSubscription = !!activePayment;
        const hasExpiredSubscription = !hasActiveSubscription && !!anyPastPayment;
        const t1Prog = profile?.tier1Progress || 0;
        const t2Prog = profile?.tier2Progress || 0;
        const t3Prog = profile?.tier3Progress || 0;
        return {
            tier1: { unlocked: true, completed: t1Prog === 100 },
            tier2: {
                unlocked: t1Prog === 100,
                completed: t2Prog === 100,
                subscriptionRequired: t1Prog === 100 && !hasActiveSubscription,
                subscriptionExpired: t1Prog === 100 && hasExpiredSubscription,
            },
            tier3: {
                unlocked: t2Prog === 100,
                completed: t3Prog === 100,
                subscriptionRequired: t2Prog === 100 && !hasActiveSubscription,
                subscriptionExpired: t2Prog === 100 && hasExpiredSubscription,
            },
            hasActiveSubscription,
            hasExpiredSubscription,
        };
    }
    generateOtrId(state, pincode) {
        const stateMapping = {
            'andhra pradesh': 'AP',
            'arunachal pradesh': 'AR',
            assam: 'AS',
            bihar: 'BR',
            chhattisgarh: 'CG',
            goa: 'GA',
            gujarat: 'GJ',
            haryana: 'HR',
            'himachal pradesh': 'HP',
            jharkhand: 'JH',
            karnataka: 'KA',
            kerala: 'KL',
            'madhya pradesh': 'MP',
            maharashtra: 'MH',
            manipur: 'MN',
            meghalaya: 'ML',
            mizoram: 'MZ',
            nagaland: 'NL',
            odisha: 'OR',
            punjab: 'PB',
            rajasthan: 'RJ',
            sikkim: 'SK',
            'tamil nadu': 'TN',
            telangana: 'TG',
            tripura: 'TR',
            'uttar pradesh': 'UP',
            uttarakhand: 'UK',
            'west bengal': 'WB',
            'andaman and nicobar islands': 'AN',
            chandigarh: 'CH',
            'dadra and nagar haveli': 'DN',
            'daman and diu': 'DD',
            delhi: 'DL',
            'jammu and kashmir': 'JK',
            ladakh: 'LA',
            lakshadweep: 'LD',
            puducherry: 'PY',
        };
        const normalizedState = (state || '').trim().toLowerCase();
        let stateCode = stateMapping[normalizedState];
        if (!stateCode) {
            stateCode = (state || 'XX')
                .replace(/[^a-zA-Z]/g, '')
                .substring(0, 2)
                .toUpperCase();
            if (stateCode.length < 2)
                stateCode = stateCode.padEnd(2, 'X');
        }
        const year = new Date().getFullYear().toString().slice(-2);
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomAlphabets = '';
        for (let i = 0; i < 3; i++) {
            randomAlphabets += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const randomNumbers = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0');
        return `${stateCode}${year}${randomAlphabets}${randomNumbers}`;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        result_service_1.ResultService,
        mock_test_service_1.MockTestService])
], UserService);
//# sourceMappingURL=user.service.js.map