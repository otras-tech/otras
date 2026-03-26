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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArthaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let ArthaRepository = class ArthaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findProfileByUserId(userId) {
        return this.prisma.arthaProfile.findFirst({
            where: { userId: userId.toString() },
            include: { feedback: true }
        });
    }
    async findSelectedExam(userId) {
        const application = await this.prisma.application.findFirst({
            where: { userId: Number(userId) },
            include: { exam: true },
            orderBy: { createdAt: 'desc' }
        });
        return application?.exam;
    }
    async findAssessmentById(id) {
        return this.prisma.arthaAssessment.findUnique({
            where: { id },
            include: { profile: true }
        });
    }
    async findLatestAssessmentByTier(profileId, tier) {
        return this.prisma.arthaAssessment.findFirst({
            where: { profileId, tier },
            orderBy: { startTime: 'desc' }
        });
    }
    async updateProfileProgressByTier(profileId, tier, progress, readinessIndex) {
        const data = {};
        if (tier === 1)
            data.tier1Progress = progress;
        if (tier === 2)
            data.tier2Progress = progress;
        if (tier === 3)
            data.tier3Progress = progress;
        if (readinessIndex !== undefined)
            data.readinessIndex = readinessIndex;
        return this.prisma.arthaProfile.update({
            where: { id: profileId },
            data
        });
    }
    async findTier2Results(userId) {
        const result = await this.prisma.result.findFirst({
            where: { userId: Number(userId), tier: 2 },
            include: { test: { include: { questions: true } } },
            orderBy: { createdAt: 'desc' }
        });
        if (!result || typeof result.subjectBreakdown !== 'object')
            return { scores: {}, totalMarks: 15 };
        const breakdown = result.subjectBreakdown;
        const scores = {};
        let totalMarks = 0;
        Object.keys(breakdown).forEach(sub => {
            scores[sub] = breakdown[sub].score || 0;
            totalMarks += breakdown[sub].total || 0;
        });
        if (totalMarks === 0) {
            totalMarks = result.test?.questions?.length || 15;
        }
        return { scores, totalMarks };
    }
    async findTier3Metrics(userId) {
        const result = await this.prisma.result.findFirst({
            where: { userId: Number(userId), tier: 3 },
            orderBy: { createdAt: 'desc' }
        });
        if (!result || typeof result.subjectBreakdown !== 'object') {
            return { accuracy: 75, speed: 45, consistency: 70 };
        }
        const breakdown = result.subjectBreakdown;
        let correctCount = 0;
        let attemptedCount = 0;
        const sectionAccuracies = [];
        Object.values(breakdown).forEach((s) => {
            const correct = (s.correct || 0);
            const wrong = (s.wrong || 0);
            const attempted = correct + wrong;
            correctCount += correct;
            attemptedCount += attempted;
            if (attempted > 0) {
                sectionAccuracies.push((correct / attempted) * 100);
            }
        });
        const res = result;
        const examStartTime = res.startTime ? new Date(res.startTime).getTime() : 0;
        const examSubmitTime = res.submitTime ? new Date(res.submitTime).getTime() : 0;
        let examDurationSeconds = 0;
        if (examStartTime > 0 && examSubmitTime > 0) {
            examDurationSeconds = Math.max(0, (examSubmitTime - examStartTime) / 1000);
        }
        else {
            examDurationSeconds = 1800;
        }
        const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
        const speedSecondsPerQuestion = attemptedCount > 0 ? (examDurationSeconds / attemptedCount) : 0;
        let consistency = 70;
        if (sectionAccuracies.length > 1) {
            const mean = sectionAccuracies.reduce((a, b) => a + b, 0) / sectionAccuracies.length;
            const variance = sectionAccuracies.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sectionAccuracies.length;
            const stdDev = Math.sqrt(variance);
            consistency = Math.max(0, Math.min(100, 100 - (stdDev * 1.5)));
        }
        else if (sectionAccuracies.length === 1) {
            consistency = 100;
        }
        return {
            accuracy: Math.round(accuracy),
            speed: parseFloat(speedSecondsPerQuestion.toFixed(2)),
            consistency: Math.round(consistency)
        };
    }
    async saveAssessment(profileId, data) {
        return this.prisma.arthaAssessment.create({
            data: {
                profileId,
                tier: data.tier,
                exam: data.exam,
                logicalScore: data.logicalScore,
                quantScore: data.quantScore,
                verbalScore: data.verbalScore,
                subjectScores: data.subjectScores,
                accuracy: data.accuracy,
                speed: data.speed,
                consistency: data.consistency,
                percentile: data.percentile,
                score: data.score,
                totalMarks: data.totalMarks,
                readinessIndex: data.readinessIndex,
                startTime: data.startTime,
                submitTime: data.submitTime
            }
        });
    }
    async getPercentileData(tier, accuracy) {
        const total = await this.prisma.arthaAssessment.count({
            where: { tier, accuracy: { not: null } }
        });
        if (total === 0)
            return { percentile: 100, totalCandidates: 1 };
        const lowerCount = await this.prisma.arthaAssessment.count({
            where: {
                tier,
                accuracy: { lte: accuracy }
            }
        });
        const percentile = (lowerCount / total) * 100;
        return {
            percentile: Math.round(percentile * 100) / 100,
            totalCandidates: total
        };
    }
    async getProfilesCount() {
        return this.prisma.user.count();
    }
    async startAssessment(userId, tier) {
        let profile = await this.findProfileByUserId(userId);
        if (!profile) {
            profile = await this.prisma.arthaProfile.create({
                data: {
                    userId: userId.toString(),
                    logicalScore: 0,
                    quantScore: 0,
                    verbalScore: 0,
                    percentile: 0,
                    tier1Progress: 0,
                    tier2Progress: 0,
                    tier3Progress: 0,
                    otrCompleted: false
                },
                include: { feedback: true }
            });
        }
        return this.prisma.arthaAssessment.create({
            data: {
                profileId: profile.id,
                tier,
                startTime: new Date(),
            }
        });
    }
    async completeAssessment(assessmentId, data) {
        return this.prisma.arthaAssessment.update({
            where: { id: assessmentId },
            data: {
                ...data,
                submitTime: new Date()
            }
        });
    }
    async updateProfileReadiness(userId, readinessIndex) {
        const profile = await this.findProfileByUserId(userId);
        if (!profile)
            return null;
        return this.prisma.arthaProfile.update({
            where: { id: profile.id },
            data: { readinessIndex }
        });
    }
    async updateProfilePercentile(userId, percentile) {
        const profile = await this.findProfileByUserId(userId);
        if (!profile)
            return null;
        return this.prisma.arthaProfile.update({
            where: { id: profile.id },
            data: { percentile }
        });
    }
    async saveQuestionAttempt(data) {
        return this.prisma.arthaQuestionAttempt.create({
            data: {
                assessmentId: data.assessmentId,
                questionId: data.questionId,
                selectedOption: data.selectedOption,
                isCorrect: data.isCorrect,
                timeTaken: data.timeTaken
            }
        });
    }
    async findQuestionAttempts(assessmentId) {
        return this.prisma.arthaQuestionAttempt.findMany({
            where: { assessmentId },
            orderBy: { attemptedAt: 'asc' }
        });
    }
    async hasActiveSubscription(userId) {
        console.log("ARTHA: Checking subscription for user", userId);
        const payment = await this.prisma.payment.findFirst({
            where: {
                userId: Number(userId),
                status: 'paid'
            },
            include: { subscription: true }
        });
        if (payment) {
            console.log("ARTHA: Active subscription found", payment.subscription);
            return true;
        }
        console.log("ARTHA: Subscription required for tier");
        return false;
    }
    async createOrUpdateProfile(data, percentile, progress, readinessIndex = 0) {
        const existing = await this.findProfileByUserId(data.userId);
        console.log(`ARTHA: Updating Profile Tier 1 Progress: ${progress}%`);
        if (existing) {
            return this.prisma.arthaProfile.update({
                where: { id: existing.id },
                data: {
                    logicalScore: data.logicalScore,
                    quantScore: data.quantScore,
                    verbalScore: data.verbalScore,
                    percentile,
                    readinessIndex,
                    tier1Progress: progress,
                    otrCompleted: progress === 100
                },
                include: { feedback: true }
            });
        }
        return this.prisma.arthaProfile.create({
            data: {
                userId: data.userId.toString(),
                logicalScore: data.logicalScore,
                quantScore: data.quantScore,
                verbalScore: data.verbalScore,
                percentile,
                readinessIndex,
                tier1Progress: progress,
                tier2Progress: 0,
                tier3Progress: 0,
                otrCompleted: progress === 100
            },
            include: { feedback: true }
        });
    }
    async updateTier2Progress(userId, progress) {
        const profile = await this.findProfileByUserId(userId);
        if (!profile)
            throw new Error("Artha Profile not found");
        console.log(`ARTHA: Updating Profile Tier 2 Progress: ${progress}%`);
        return this.prisma.arthaProfile.update({
            where: { id: profile.id },
            data: { tier2Progress: progress }
        });
    }
    async updateTier3Progress(userId, progress) {
        const profile = await this.findProfileByUserId(userId);
        if (!profile)
            throw new Error("Artha Profile not found");
        console.log(`ARTHA: Updating Profile Tier 3 Progress: ${progress}%`);
        return this.prisma.arthaProfile.update({
            where: { id: profile.id },
            data: { tier3Progress: progress }
        });
    }
    async saveFeedback(profileId, tier, feedback) {
        return this.prisma.intelligenceFeedback.upsert({
            where: { profileId },
            update: {
                ...feedback,
                tier
            },
            create: {
                profileId,
                tier,
                ...feedback
            }
        });
    }
    async clearFeedback(profileId) {
        return this.prisma.intelligenceFeedback.deleteMany({
            where: { profileId }
        });
    }
    async upsertRecentReport(userId, data) {
        const user = await this.prisma.user.findUnique({
            where: { id: Number(userId) }
        });
        if (!user)
            return null;
        return this.prisma.arthaRecentReport.upsert({
            where: {
                otrId_tier: {
                    otrId: user.otrId,
                    tier: data.tier
                }
            },
            update: {
                score: data.score,
                totalMarks: data.totalMarks,
                accuracy: data.accuracy,
                speed: data.speed,
                consistency: data.consistency,
                readinessIndex: data.readinessIndex,
                percentile: data.percentile,
                subjectBreakdown: data.subjectBreakdown
            },
            create: {
                otrId: user.otrId,
                tier: data.tier,
                score: data.score,
                totalMarks: data.totalMarks,
                accuracy: data.accuracy,
                speed: data.speed,
                consistency: data.consistency,
                readinessIndex: data.readinessIndex,
                percentile: data.percentile,
                subjectBreakdown: data.subjectBreakdown
            }
        });
    }
    async findRecentReportsByUserId(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: Number(userId) }
        });
        if (!user)
            return [];
        return this.prisma.arthaRecentReport.findMany({
            where: { otrId: user.otrId },
            orderBy: { tier: 'asc' }
        });
    }
};
exports.ArthaRepository = ArthaRepository;
exports.ArthaRepository = ArthaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArthaRepository);
//# sourceMappingURL=artha.repository.js.map