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
var ArthaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArthaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const artha_repository_1 = require("./repository/artha.repository");
const tier3_metrics_service_1 = require("./tier3-metrics.service");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let ArthaService = ArthaService_1 = class ArthaService {
    repository;
    metricsService;
    configService;
    arthaQueue;
    logger = new common_1.Logger(ArthaService_1.name);
    ML_SERVICE_URL;
    AI_SERVICE_URL;
    constructor(repository, metricsService, configService, arthaQueue) {
        this.repository = repository;
        this.metricsService = metricsService;
        this.configService = configService;
        this.arthaQueue = arthaQueue;
        this.ML_SERVICE_URL =
            this.configService.get('ML_SERVICE_URL') || 'http://127.0.0.1:5000';
        this.AI_SERVICE_URL =
            this.configService.get('AI_SERVICE_URL') ||
                'http://localhost:8000/api/v1';
    }
    async getStatus(userId) {
        this.logger.log(`Fetching profile for user ${userId}`);
        const profile = await this.repository.findProfileByUserId(userId);
        const hasSubscription = await this.repository.hasActiveSubscription(userId);
        if (hasSubscription) {
            this.logger.log(`Tier access granted for user ${userId}`);
        }
        if (!profile) {
            return {
                tier1: { unlocked: true, completed: false, progress: 0 },
                tier2: {
                    unlocked: false,
                    completed: false,
                    progress: 0,
                    subscriptionRequired: false,
                },
                tier3: {
                    unlocked: false,
                    completed: false,
                    progress: 0,
                    subscriptionRequired: false,
                },
                percentile: 0,
                readinessIndex: 0,
                logicalScore: 0,
                quantScore: 0,
                verbalScore: 0,
                feedback: null,
            };
        }
        const recentReports = await this.repository.findRecentReportsByUserId(userId);
        const hasT1Report = recentReports.some((r) => r.tier === 1);
        const hasT2Report = recentReports.some((r) => r.tier === 2);
        const hasT3Report = recentReports.some((r) => r.tier === 3);
        const tier1Completed = hasT1Report || profile.tier1Progress === 100;
        const tier2Completed = hasT2Report || profile.tier2Progress === 100;
        const tier3Completed = hasT3Report || profile.tier3Progress === 100;
        const allCompleted = hasT1Report && hasT2Report && hasT3Report;
        const selectedExam = await this.repository.findSelectedExam(userId);
        return {
            tier1: {
                unlocked: true,
                completed: tier1Completed,
                progress: profile.tier1Progress,
            },
            tier2: {
                unlocked: allCompleted || tier1Completed,
                completed: tier2Completed,
                progress: profile.tier2Progress,
                subscriptionRequired: (allCompleted || tier1Completed) &&
                    !tier2Completed &&
                    !hasSubscription,
            },
            tier3: {
                unlocked: allCompleted || tier2Completed,
                completed: tier3Completed,
                progress: profile.tier3Progress,
                subscriptionRequired: (allCompleted || tier2Completed) &&
                    !tier3Completed &&
                    !hasSubscription,
            },
            percentile: profile.percentile,
            readinessIndex: profile.readinessIndex || 0,
            logicalScore: profile.logicalScore,
            quantScore: profile.quantScore,
            verbalScore: profile.verbalScore,
            feedback: profile.feedback,
            selectedExam: selectedExam?.name || null,
            recentReports: recentReports,
        };
    }
    async startTierAssessment(userId, tier) {
        return this.repository.startAssessment(userId, tier);
    }
    async recordQuestionAttempt(data) {
        this.logger.log(`Question Attempted`);
        await this.repository.saveQuestionAttempt(data);
        const allAttempts = await this.repository.findQuestionAttempts(data.assessmentId);
        const assessment = await this.repository.findAssessmentById(data.assessmentId);
        if (assessment) {
            this.logger.log(`Tier: Tier-${assessment.tier}`);
            const attemptedCount = allAttempts.length;
            this.logger.log(`Attempt Count Updated: ${attemptedCount}`);
            const totalQuestionsInTier = data.totalQuestions || 15;
            this.logger.log(`Total Questions In Tier: ${totalQuestionsInTier}`);
            if (totalQuestionsInTier <= 0) {
                this.logger.warn('ARTHA Progress Engine: Warning - totalQuestionsInTier is 0 or invalid.');
            }
            this.logger.log(`Calculating Progress: attempted ${attemptedCount} / total ${totalQuestionsInTier}`);
            const progress = totalQuestionsInTier > 0
                ? Math.min(100, Math.round((attemptedCount / totalQuestionsInTier) * 100))
                : 0;
            this.logger.log(`Progress calculated: ${progress}%`);
            this.logger.log(`Stored Progress: ${progress}%`);
            await this.repository.updateProfileProgressByTier(assessment.profileId, assessment.tier, progress);
        }
        const correctCount = allAttempts.filter((a) => a.isCorrect).length;
        const attemptedCount = allAttempts.length;
        const totalTime = allAttempts.reduce((acc, a) => acc + a.timeTaken, 0);
        const accuracy = this.metricsService.calculateAccuracy(correctCount, attemptedCount);
        const speed = this.metricsService.calculateSpeed(totalTime, attemptedCount);
        const consistency = this.metricsService.calculateConsistency(allAttempts);
        return {
            accuracy: Math.round(accuracy),
            speed: parseFloat(speed.toFixed(2)),
            consistency,
            attempted: attemptedCount,
            progress: assessment
                ? Math.min(100, Math.round((attemptedCount / (data.totalQuestions || 15)) * 100))
                : 0,
            correct: correctCount,
        };
    }
    async processTier1(data, assessmentId) {
        this.logger.log(`Process Tier 1 Result Start for user ${data.userId}`);
        const existingProfile = await this.repository.findProfileByUserId(data.userId);
        if (existingProfile) {
            this.logger.log(`Clearing old feedback for user ${data.userId} to ensure fresh analysis`);
            await this.repository.clearFeedback(existingProfile.id);
        }
        this.logger.log(`Scores - Logical: ${data.logicalScore}, Quant: ${data.quantScore}, Verbal: ${data.verbalScore}`);
        const score = data.logicalScore + data.quantScore + data.verbalScore;
        const total_questions = data.totalQuestions || 15;
        const totalPerSubject = total_questions / 3;
        const attemptedCount = data.attemptedCount !== undefined ? data.attemptedCount : 0;
        const logicalPercent = Math.round((data.logicalScore / totalPerSubject) * 100);
        const quantPercent = Math.round((data.quantScore / totalPerSubject) * 100);
        const verbalPercent = Math.round((data.verbalScore / totalPerSubject) * 100);
        this.logger.log(`Finalizing Tier-1 Progress: totalQuestions ${total_questions}, attempted ${attemptedCount}`);
        this.logger.log(`Attempted Questions: ${attemptedCount}`);
        this.logger.log(`ARTHA Progress Engine: Calculating Progress`);
        this.logger.log(`Formula: attempted / total * 100`);
        const progress = total_questions > 0
            ? Math.min(100, Math.round((attemptedCount / total_questions) * 100))
            : 0;
        this.logger.log(`Stored Progress: ${progress}%`);
        const totalScore = score;
        const totalQuestions = total_questions;
        const percentile = Math.max(0, Math.min(100, Number(((totalScore / totalQuestions) * 100).toFixed(2))));
        this.logger.log(`Percentile calculated: ${percentile}%`);
        this.logger.log('Final Calculated Percentile: ' + percentile);
        const readinessIndex = await this.calculateReadiness(data.userId.toString(), 1, { aptitude_score: percentile });
        const profileData = {
            ...data,
            logicalScore: logicalPercent,
            quantScore: quantPercent,
            verbalScore: verbalPercent,
        };
        const profile = await this.repository.createOrUpdateProfile(profileData, percentile, progress, readinessIndex);
        const tier = 1;
        const inputData = {
            logicalScore: logicalPercent,
            quantScore: quantPercent,
            verbalScore: verbalPercent,
            percentile: percentile,
            language: data.language,
        };
        const assessmentData = {
            tier,
            logicalScore: logicalPercent,
            quantScore: quantPercent,
            verbalScore: verbalPercent,
            percentile,
            score: totalScore,
            totalMarks: totalQuestions,
            accuracy: Math.round(percentile),
            subjectScores: {
                logical: logicalPercent,
                quant: quantPercent,
                verbal: verbalPercent,
            },
            readinessIndex,
        };
        if (assessmentId) {
            await this.repository.completeAssessment(assessmentId, {
                ...assessmentData,
                status: 'PENDING',
            });
        }
        else {
            const newAssessment = await this.repository.saveAssessment(profile.id, {
                ...assessmentData,
                status: 'PENDING',
                startTime: new Date(),
                submitTime: new Date(),
            });
            assessmentId = newAssessment.id;
        }
        await this.repository.upsertRecentReport(data.userId.toString(), {
            tier: 1,
            score: totalScore,
            totalMarks: totalQuestions,
            percentile,
            readinessIndex,
            accuracy: Math.round(percentile),
            subjectBreakdown: assessmentData.subjectScores,
        });
        const analysisData = {
            aptitude_score: percentile,
            logicalScore: logicalPercent,
            quantScore: quantPercent,
            verbalScore: verbalPercent,
            percentile: percentile,
            language: data.language,
        };
        if (this.configService.get('DISABLE_REDIS') === 'true') {
            this.logger.log(`Redis disabled: Running Tier 1 analysis synchronously`);
            await this.generateAndSaveAiFeedback(profile, tier, analysisData);
            await this.repository.completeAssessment(assessmentId, {
                status: 'COMPLETED',
            });
        }
        else {
            const job = await this.arthaQueue.add('tier-analysis', {
                type: 'tier-analysis',
                userId: data.userId,
                assessmentId,
                tier: 1,
                data: analysisData,
            }, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 },
            });
            await this.repository.completeAssessment(assessmentId, { jobId: job.id });
        }
        const status = await this.getStatus(data.userId);
        return {
            ...status,
            status: 'processing',
            jobId: assessmentId,
        };
    }
    async processTier2(userId, assessmentId, language, attemptedCountOverride, totalQuestionsOverride) {
        this.logger.log(`Process Tier 2 Result Start for user ${userId}`);
        const selectedExam = await this.repository.findSelectedExam(userId);
        const { scores: subjectScores, totalMarks: tier2TotalMarks } = await this.repository.findTier2Results(userId);
        let attemptedCount = 0;
        const totalQuestions = tier2TotalMarks || 20;
        if (assessmentId) {
            const allAttempts = await this.repository.findQuestionAttempts(assessmentId);
            attemptedCount = allAttempts.length;
        }
        const finalTotalQuestions = totalQuestionsOverride || totalQuestions;
        const finalAttemptedCount = attemptedCountOverride || attemptedCount;
        this.logger.log(`Finalizing Tier-2 Progress: totalQuestions ${finalTotalQuestions}, attempted ${finalAttemptedCount}`);
        const progress = finalTotalQuestions > 0
            ? Math.min(100, Math.round((finalAttemptedCount / finalTotalQuestions) * 100))
            : 0;
        this.logger.log(`Updating Profile Tier 2 Progress: ${progress}%`);
        await this.repository.updateTier2Progress(userId, progress);
        const totalScore = Object.values(subjectScores).reduce((acc, s) => acc + s, 0);
        const percentile = Math.max(0, Math.min(100, Number(((totalScore / finalTotalQuestions) * 100).toFixed(2))));
        this.logger.log(`Percentile calculated: ${percentile}%`);
        this.logger.log('Updating Profile Percentile in DB...');
        await this.repository.updateProfilePercentile(userId, percentile);
        this.logger.log('Final Tier 2 Percentile: ' + percentile);
        const readinessIndex = await this.calculateReadiness(userId, 2, {
            subject_score: percentile,
        });
        const profile = await this.repository.findProfileByUserId(userId);
        if (!profile)
            throw new Error('Artha Profile not found');
        const tier = 2;
        const examName = selectedExam?.name || 'General Competitive Exam';
        const inputData = {
            selectedExam: examName,
            subjectScores,
            language,
            percentile,
        };
        const assessmentData = {
            tier,
            exam: examName,
            subjectScores,
            percentile,
            score: totalScore,
            totalMarks: finalTotalQuestions,
            readinessIndex,
        };
        if (assessmentId) {
            await this.repository.completeAssessment(assessmentId, {
                ...assessmentData,
                status: 'PENDING',
            });
        }
        else {
            const newAssessment = await this.repository.saveAssessment(profile.id, {
                ...assessmentData,
                status: 'PENDING',
                startTime: new Date(),
                submitTime: new Date(),
            });
            assessmentId = newAssessment.id;
        }
        await this.repository.upsertRecentReport(userId, {
            tier: 2,
            score: totalScore,
            totalMarks: finalTotalQuestions,
            percentile,
            readinessIndex,
            accuracy: percentile,
            subjectBreakdown: subjectScores,
        });
        const analysisData = {
            selectedExam: examName,
            subjectScores,
            language,
            percentile,
            subject_score: percentile,
        };
        if (this.configService.get('DISABLE_REDIS') === 'true') {
            this.logger.log(`Redis disabled: Running Tier 2 analysis synchronously`);
            await this.generateAndSaveAiFeedback(profile, tier, analysisData);
            await this.repository.completeAssessment(assessmentId, {
                status: 'COMPLETED',
            });
        }
        else {
            const job = await this.arthaQueue.add('tier-analysis', {
                type: 'tier-analysis',
                userId,
                assessmentId,
                tier: 2,
                data: analysisData,
            }, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 },
            });
            await this.repository.completeAssessment(assessmentId, { jobId: job.id });
        }
        const status = await this.getStatus(userId);
        return { ...status, status: 'processing', jobId: assessmentId };
    }
    async processTier3(userId, assessmentId, language, attemptedCountOverride, totalQuestionsOverride) {
        this.logger.log(`Process Tier 3 Result Start for user ${userId}`);
        let inputData;
        const tier = 3;
        let attemptedCount = 0;
        let totalQuestions = 15;
        if (assessmentId) {
            this.logger.log(`Processing results for assessment ID: ${assessmentId}`);
            const allAttempts = await this.repository.findQuestionAttempts(assessmentId);
            const correctCount = allAttempts.filter((a) => a.isCorrect).length;
            attemptedCount = allAttempts.length;
            const totalTime = allAttempts.reduce((acc, a) => acc + a.timeTaken, 0);
            const assessment = await this.repository.findAssessmentById(assessmentId);
            totalQuestions = attemptedCount > 15 ? attemptedCount : 15;
            this.logger.log(`Tier 3 Results - Correct: ${correctCount}, Attempted: ${attemptedCount}`);
            const accuracy = this.metricsService.calculateAccuracy(correctCount, attemptedCount);
            const speed = this.metricsService.calculateSpeed(totalTime, attemptedCount);
            const consistency = this.metricsService.calculateConsistency(allAttempts);
            const wrongCount = attemptedCount - correctCount;
            const score = correctCount - wrongCount * 0.25;
            let percentile;
            try {
                percentile = Math.max(0, Math.min(100, Number(((score / totalQuestions) * 100).toFixed(2))));
                this.logger.log(`Percentile calculated: ${percentile}% (corrected score: ${score})`);
                this.logger.log('Updating Profile Percentile in DB...');
                await this.repository.updateProfilePercentile(userId, percentile);
            }
            catch (err) {
                this.logger.error('ARTHA: Percentile calculation error for Tier 3', err);
                percentile = Math.round(accuracy);
            }
            inputData = {
                accuracy: Math.round(accuracy),
                speed: parseFloat(speed.toFixed(2)),
                consistency,
                percentile,
                score,
            };
        }
        const examRecordT3 = await this.repository.findSelectedExam(userId);
        const finalTotalQuestionsT3 = totalQuestionsOverride || examRecordT3?.noOfQuestions || 15;
        const finalAttemptedCountT3 = attemptedCountOverride || attemptedCount;
        this.logger.log(`Finalizing Tier-3 Progress: totalQuestions ${finalTotalQuestionsT3}, attempted ${finalAttemptedCountT3}`);
        const progress = finalTotalQuestionsT3 > 0
            ? Math.min(100, Math.round((finalAttemptedCountT3 / finalTotalQuestionsT3) * 100))
            : 0;
        this.logger.log(`Updating Profile Tier 3 Progress: ${progress}%`);
        await this.repository.updateTier3Progress(userId, progress);
        if (!assessmentId) {
            this.logger.log('Loading existing Tier 3 metrics from database...');
            const metrics = await this.repository.findTier3Metrics(userId);
            inputData = {
                accuracy: metrics.accuracy,
                speed: metrics.speed,
                consistency: metrics.consistency,
                percentile: metrics.accuracy,
                score: 0,
            };
        }
        const readinessIndexT3 = await this.calculateReadiness(userId, 3, {
            time_management_score: inputData.speed,
            mock_average_score: inputData.accuracy,
            consistency_score: inputData.consistency,
        });
        this.logger.log('Final Tier 3 Percentile: ' + (inputData.percentile || 0));
        inputData.language = language;
        const assessmentData = {
            tier,
            accuracy: inputData.accuracy,
            speed: inputData.speed,
            consistency: inputData.consistency,
            percentile: inputData.percentile || 0,
            score: inputData.score || 0,
            totalMarks: finalTotalQuestionsT3,
            readinessIndex: readinessIndexT3,
        };
        const finalProfile = await this.repository.findProfileByUserId(userId);
        if (!finalProfile)
            throw new Error('Artha Profile not found after update');
        if (assessmentId) {
            await this.repository.completeAssessment(assessmentId, {
                ...assessmentData,
                status: 'PENDING',
            });
        }
        else {
            const newAssessment = await this.repository.saveAssessment(finalProfile.id, {
                ...assessmentData,
                status: 'PENDING',
                startTime: new Date(),
                submitTime: new Date(),
            });
            assessmentId = newAssessment.id;
        }
        await this.repository.upsertRecentReport(userId, {
            tier: 3,
            score: assessmentData.score,
            totalMarks: finalTotalQuestionsT3,
            accuracy: assessmentData.accuracy,
            speed: assessmentData.speed,
            consistency: assessmentData.consistency,
            percentile: assessmentData.percentile,
            readinessIndex: readinessIndexT3,
        });
        const analysisData = {
            ...inputData,
            time_management_score: inputData.speed,
            mock_average_score: inputData.accuracy,
            consistency_score: inputData.consistency,
        };
        if (this.configService.get('DISABLE_REDIS') === 'true') {
            this.logger.log(`Redis disabled: Running Tier 3 analysis synchronously`);
            await this.generateAndSaveAiFeedback(finalProfile, tier, analysisData);
            await this.repository.completeAssessment(assessmentId, {
                status: 'COMPLETED',
            });
        }
        else {
            const job = await this.arthaQueue.add('tier-analysis', {
                type: 'tier-analysis',
                userId,
                assessmentId,
                tier: 3,
                data: analysisData,
            }, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 },
            });
            await this.repository.completeAssessment(assessmentId, { jobId: job.id });
        }
        const status = await this.getStatus(userId);
        return { ...status, status: 'processing', jobId: assessmentId };
    }
    async calculateReadiness(userId, tier, currentData) {
        this.logger.log(`Readiness Engine: Tier submission received for Tier ${tier}`);
        this.logger.log(`Raw scores: ${JSON.stringify(currentData)}`);
        const profile = await this.repository.findProfileByUserId(userId);
        let aptitude_score = 0;
        let subject_score = 0;
        let time_management_score = 0;
        let mock_average_score = 0;
        let consistency_score = 0;
        this.logger.log(`ARTHA Readiness Engine: Normalizing scores`);
        if (tier === 1) {
            aptitude_score = currentData.aptitude_score || 0;
        }
        else if (tier === 2) {
            aptitude_score =
                ((profile?.logicalScore || 0) +
                    (profile?.quantScore || 0) +
                    (profile?.verbalScore || 0)) /
                    3;
            subject_score = currentData.subject_score || 0;
        }
        else if (tier === 3) {
            aptitude_score =
                ((profile?.logicalScore || 0) +
                    (profile?.quantScore || 0) +
                    (profile?.verbalScore || 0)) /
                    3;
            const assessment = await this.repository.findLatestAssessmentByTier(profile?.id || '', 2);
            if (assessment) {
                subject_score = assessment.percentile || 0;
            }
            time_management_score = currentData.time_management_score || 0;
            mock_average_score = currentData.mock_average_score || 0;
            consistency_score = currentData.consistency_score || 0;
        }
        aptitude_score = Math.max(0, Math.min(100, Number(aptitude_score)));
        subject_score = Math.max(0, Math.min(100, Number(subject_score)));
        time_management_score = Math.max(0, Math.min(100, Number(time_management_score)));
        mock_average_score = Math.max(0, Math.min(100, Number(mock_average_score)));
        consistency_score = Math.max(0, Math.min(100, Number(consistency_score)));
        const featureVector = [
            aptitude_score,
            subject_score,
            time_management_score,
            mock_average_score,
            consistency_score,
        ];
        this.logger.log(`Feature vector: [${featureVector.map((v) => Number(v.toFixed(2))).join(',')}]`);
        this.logger.log(`Calling readiness_model`);
        try {
            const response = await fetch(`${this.ML_SERVICE_URL}/readiness/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    aptitude_score,
                    subject_score,
                    time_management_score,
                    mock_average_score,
                    consistency_score,
                }),
                signal: AbortSignal.timeout(15000),
            });
            if (response.ok) {
                const result = await response.json();
                this.logger.log(`Model response: readiness_index = ${result.readinessIndex}`);
                const readinessIndex = Math.round(result.readinessIndex);
                this.logger.log(`Updating career readiness index in DB`);
                await this.repository.updateProfileReadiness(userId, readinessIndex);
                return readinessIndex;
            }
            else {
                this.logger.error(`Model prediction failed status ${response.status}`);
                const errorText = await response.text();
                this.logger.error(`Response: ${errorText}`);
                throw new Error('ML Service returned non-200');
            }
        }
        catch (error) {
            this.logger.error(`Readiness Engine ERROR [Fallback Activated]: ${error.message}`);
            let fallbackScore = 0;
            if (tier === 1) {
                fallbackScore = aptitude_score * 0.5;
            }
            else if (tier === 2) {
                fallbackScore = aptitude_score * 0.4 + subject_score * 0.4;
            }
            else {
                fallbackScore =
                    aptitude_score * 0.3 +
                        subject_score * 0.3 +
                        time_management_score * 0.15 +
                        mock_average_score * 0.15 +
                        consistency_score * 0.1;
            }
            const calculatedFallback = Math.round(fallbackScore);
            const finalReadiness = Math.max(profile?.readinessIndex || 0, calculatedFallback);
            this.logger.log(`Using fallback readiness index: ${finalReadiness}`);
            await this.repository.updateProfileReadiness(userId, finalReadiness);
            return finalReadiness;
        }
    }
    async generateAndSaveAiFeedback(profile, tier, data) {
        try {
            this.logger.log(`Sending payload to AI Service for Tier ${tier}`);
            const response = await fetch(`${this.AI_SERVICE_URL}/ai/intelligence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier,
                    data,
                }),
                signal: AbortSignal.timeout(90000),
            });
            if (response.ok) {
                const feedback = await response.json();
                this.logger.log('AI output generated');
                return await this.repository.saveFeedback(profile.id, tier, feedback);
            }
            else {
                this.logger.error(`ARTHA: AI Service returned error: ${response.statusText}`);
                return null;
            }
        }
        catch (error) {
            this.logger.error('ARTHA: Failed to call AI service for assessment feedback', error);
            return null;
        }
    }
};
exports.ArthaService = ArthaService;
exports.ArthaService = ArthaService = ArthaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, bullmq_1.InjectQueue)('artha')),
    __metadata("design:paramtypes", [artha_repository_1.ArthaRepository,
        tier3_metrics_service_1.Tier3MetricsService,
        config_1.ConfigService,
        bullmq_2.Queue])
], ArthaService);
//# sourceMappingURL=artha.service.js.map