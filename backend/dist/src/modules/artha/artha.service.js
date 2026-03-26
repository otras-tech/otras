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
var ArthaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArthaService = void 0;
const common_1 = require("@nestjs/common");
const artha_repository_1 = require("./repository/artha.repository");
const tier3_metrics_service_1 = require("./tier3-metrics.service");
let ArthaService = ArthaService_1 = class ArthaService {
    repository;
    metricsService;
    logger = new common_1.Logger(ArthaService_1.name);
    ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5000';
    AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/v1';
    constructor(repository, metricsService) {
        this.repository = repository;
        this.metricsService = metricsService;
    }
    async getStatus(userId) {
        console.log("ARTHA: Fetching profile for user", userId);
        const profile = await this.repository.findProfileByUserId(userId);
        const hasSubscription = await this.repository.hasActiveSubscription(userId);
        if (hasSubscription) {
            console.log("ARTHA: Tier access granted for user", userId);
        }
        if (!profile) {
            return {
                tier1: { unlocked: true, completed: false, progress: 0 },
                tier2: {
                    unlocked: false,
                    completed: false,
                    progress: 0,
                    subscriptionRequired: false
                },
                tier3: {
                    unlocked: false,
                    completed: false,
                    progress: 0,
                    subscriptionRequired: false
                },
                percentile: 0,
                readinessIndex: 0,
                logicalScore: 0,
                quantScore: 0,
                verbalScore: 0,
                feedback: null
            };
        }
        const recentReports = await this.repository.findRecentReportsByUserId(userId);
        const hasT1Report = recentReports.some(r => r.tier === 1);
        const hasT2Report = recentReports.some(r => r.tier === 2);
        const hasT3Report = recentReports.some(r => r.tier === 3);
        const tier1Completed = hasT1Report || profile.tier1Progress === 100;
        const tier2Completed = hasT2Report || profile.tier2Progress === 100;
        const tier3Completed = hasT3Report || profile.tier3Progress === 100;
        const allCompleted = hasT1Report && hasT2Report && hasT3Report;
        const selectedExam = await this.repository.findSelectedExam(userId);
        return {
            tier1: { unlocked: true, completed: tier1Completed, progress: profile.tier1Progress },
            tier2: {
                unlocked: allCompleted || tier1Completed,
                completed: tier2Completed,
                progress: profile.tier2Progress,
                subscriptionRequired: (allCompleted || tier1Completed) && !tier2Completed && !hasSubscription
            },
            tier3: {
                unlocked: allCompleted || tier2Completed,
                completed: tier3Completed,
                progress: profile.tier3Progress,
                subscriptionRequired: (allCompleted || tier2Completed) && !tier3Completed && !hasSubscription
            },
            percentile: profile.percentile,
            readinessIndex: profile.readinessIndex || 0,
            logicalScore: profile.logicalScore,
            quantScore: profile.quantScore,
            verbalScore: profile.verbalScore,
            feedback: profile.feedback,
            selectedExam: selectedExam?.name || null,
            recentReports: recentReports
        };
    }
    async startTierAssessment(userId, tier) {
        return this.repository.startAssessment(userId, tier);
    }
    async recordQuestionAttempt(data) {
        console.log(`\nARTHA Progress Engine: Question Attempted`);
        await this.repository.saveQuestionAttempt(data);
        const allAttempts = await this.repository.findQuestionAttempts(data.assessmentId);
        const assessment = await this.repository.findAssessmentById(data.assessmentId);
        if (assessment) {
            console.log(`Tier: Tier-${assessment.tier}`);
            const attemptedCount = allAttempts.length;
            console.log(`ARTHA Progress Engine: Attempt Count Updated`);
            console.log(`Attempted Questions: ${attemptedCount}`);
            const totalQuestionsInTier = data.totalQuestions || 15;
            console.log(`ARTHA Progress Engine: Total Questions Loaded`);
            console.log(`Total Questions In Tier: ${totalQuestionsInTier}`);
            if (totalQuestionsInTier <= 0) {
                console.warn("ARTHA Progress Engine: Warning - totalQuestionsInTier is 0 or invalid.");
            }
            console.log(`ARTHA Progress Engine: Calculating Progress`);
            console.log(`Formula: attempted / total * 100`);
            const progress = totalQuestionsInTier > 0
                ? Math.min(100, Math.round((attemptedCount / totalQuestionsInTier) * 100))
                : 0;
            console.log(`ARTHA Progress Engine: Calculation Result`);
            console.log(`Progress = (${attemptedCount} / ${totalQuestionsInTier}) * 100 = ${progress}%`);
            console.log(`ARTHA Progress Engine: Progress Stored In State (DB)`);
            console.log(`Stored Progress: ${progress}%`);
            await this.repository.updateProfileProgressByTier(assessment.profileId, assessment.tier, progress);
        }
        const correctCount = allAttempts.filter(a => a.isCorrect).length;
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
            progress: assessment ? Math.min(100, Math.round((attemptedCount / (data.totalQuestions || 15)) * 100)) : 0,
            correct: correctCount
        };
    }
    async processTier1(data, assessmentId) {
        console.log("\n---- ARTHA: Process Tier 1 Result Start ----");
        const existingProfile = await this.repository.findProfileByUserId(data.userId);
        if (existingProfile) {
            console.log(`ARTHA: Clearing old feedback for user ${data.userId} to ensure fresh analysis`);
            await this.repository.clearFeedback(existingProfile.id);
        }
        console.log("ARTHA: Logical Score:", data.logicalScore);
        console.log("ARTHA: Quant Score:", data.quantScore);
        console.log("ARTHA: Verbal Score:", data.verbalScore);
        const score = data.logicalScore + data.quantScore + data.verbalScore;
        const total_questions = data.totalQuestions || 15;
        const totalPerSubject = total_questions / 3;
        const attemptedCount = data.attemptedCount !== undefined ? data.attemptedCount : 0;
        const logicalPercent = Math.round((data.logicalScore / totalPerSubject) * 100);
        const quantPercent = Math.round((data.quantScore / totalPerSubject) * 100);
        const verbalPercent = Math.round((data.verbalScore / totalPerSubject) * 100);
        console.log(`\nARTHA Progress Engine: Finalizing Tier-1 Progress`);
        console.log(`ARTHA Progress Engine: Total Questions Retrieved`);
        console.log(`Total Questions In Tier: ${total_questions}`);
        console.log(`ARTHA Progress Engine: Attempt Count Updated`);
        console.log(`Attempted Questions: ${attemptedCount}`);
        console.log(`ARTHA Progress Engine: Calculating Progress`);
        console.log(`Formula: attempted / total * 100`);
        const progress = total_questions > 0 ? Math.min(100, Math.round((attemptedCount / total_questions) * 100)) : 0;
        console.log(`ARTHA Progress Engine: Calculation Result`);
        console.log(`Progress = (${attemptedCount} / ${total_questions}) * 100 = ${progress}%`);
        console.log(`ARTHA Progress Engine: Progress Stored In State (DB)`);
        console.log(`Stored Progress: ${progress}%`);
        const totalScore = score;
        const totalQuestions = total_questions;
        const percentile = Math.max(0, Math.min(100, Number(((totalScore / totalQuestions) * 100).toFixed(2))));
        console.log(`\nARTHA Percentile Engine: Calculating percentile`);
        console.log(`totalScore → ${totalScore}`);
        console.log(`totalQuestions → ${totalQuestions}`);
        console.log(`percentile → ${percentile}`);
        console.log("ARTHA: Final Calculated Percentile:", percentile);
        console.log("---- ARTHA: Process Tier 1 Result End ----\n");
        const readinessIndex = await this.calculateReadiness(data.userId.toString(), 1, { aptitude_score: percentile });
        const profileData = {
            ...data,
            logicalScore: logicalPercent,
            quantScore: quantPercent,
            verbalScore: verbalPercent
        };
        const profile = await this.repository.createOrUpdateProfile(profileData, percentile, progress, readinessIndex);
        const tier = 1;
        const inputData = {
            logicalScore: logicalPercent,
            quantScore: quantPercent,
            verbalScore: verbalPercent,
            percentile: percentile,
            language: data.language
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
                verbal: verbalPercent
            },
            readinessIndex
        };
        if (assessmentId) {
            await this.repository.completeAssessment(assessmentId, assessmentData);
        }
        else {
            await this.repository.saveAssessment(profile.id, {
                ...assessmentData,
                startTime: new Date(),
                submitTime: new Date()
            });
        }
        await this.repository.upsertRecentReport(data.userId.toString(), {
            tier: 1,
            score: totalScore,
            totalMarks: totalQuestions,
            percentile,
            readinessIndex,
            accuracy: Math.round(percentile),
            subjectBreakdown: assessmentData.subjectScores
        });
        console.log("ARTHA: Sending Tier 1 data to AI service with language:", inputData.language);
        console.log("ARTHA: AI Payload Details:", JSON.stringify(inputData, null, 2));
        const feedback = await this.generateAndSaveAiFeedback(profile, tier, inputData);
        const status = await this.getStatus(data.userId);
        return { ...status, feedback: feedback || null };
    }
    async processTier2(userId, assessmentId, language, attemptedCountOverride, totalQuestionsOverride) {
        console.log("\n---- ARTHA: Process Tier 2 Result Start ----");
        console.log("ARTHA: User ID:", userId);
        const selectedExam = await this.repository.findSelectedExam(userId);
        const { scores: subjectScores, totalMarks: tier2TotalMarks } = await this.repository.findTier2Results(userId);
        let attemptedCount = 0;
        let totalQuestions = tier2TotalMarks || 20;
        if (assessmentId) {
            const allAttempts = await this.repository.findQuestionAttempts(assessmentId);
            attemptedCount = allAttempts.length;
        }
        const finalTotalQuestions = totalQuestionsOverride || totalQuestions;
        const finalAttemptedCount = attemptedCountOverride || attemptedCount;
        console.log(`\nARTHA Progress Engine: Finalizing Tier-2 Progress`);
        console.log(`ARTHA Progress Engine: Total Questions Retrieved`);
        console.log(`Total Questions In Tier: ${finalTotalQuestions}`);
        console.log(`ARTHA Progress Engine: Attempt Count Updated`);
        console.log(`Attempted Questions: ${finalAttemptedCount}`);
        console.log(`ARTHA Progress Engine: Calculating Progress`);
        console.log(`Formula: attempted / total * 100`);
        const progress = finalTotalQuestions > 0 ? Math.min(100, Math.round((finalAttemptedCount / finalTotalQuestions) * 100)) : 0;
        console.log(`ARTHA: Updating Profile Tier 2 Progress: ${progress}%`);
        await this.repository.updateTier2Progress(userId, progress);
        const totalScore = Object.values(subjectScores).reduce((acc, s) => acc + s, 0);
        const percentile = Math.max(0, Math.min(100, Number(((totalScore / finalTotalQuestions) * 100).toFixed(2))));
        console.log(`\nARTHA Percentile Engine: Calculating percentile`);
        console.log(`totalScore → ${totalScore}`);
        console.log(`totalQuestions → ${finalTotalQuestions}`);
        console.log(`percentile → ${percentile}`);
        console.log("ARTHA: Updating Profile Percentile in DB...");
        await this.repository.updateProfilePercentile(userId, percentile);
        console.log("ARTHA: Final Tier 2 Percentile:", percentile);
        console.log("---- ARTHA: Process Tier 2 Result End ----\n");
        const readinessIndex = await this.calculateReadiness(userId, 2, { subject_score: percentile });
        const profile = await this.repository.findProfileByUserId(userId);
        if (!profile)
            throw new Error("Artha Profile not found");
        const tier = 2;
        const examName = selectedExam?.name || "General Competitive Exam";
        const inputData = { selectedExam: examName, subjectScores, language, percentile };
        const assessmentData = {
            tier,
            exam: examName,
            subjectScores,
            percentile,
            score: totalScore,
            totalMarks: finalTotalQuestions,
            readinessIndex
        };
        if (assessmentId) {
            await this.repository.completeAssessment(assessmentId, assessmentData);
        }
        else {
            await this.repository.saveAssessment(profile.id, {
                ...assessmentData,
                startTime: new Date(),
                submitTime: new Date()
            });
        }
        await this.repository.upsertRecentReport(userId, {
            tier: 2,
            score: totalScore,
            totalMarks: finalTotalQuestions,
            percentile,
            readinessIndex,
            accuracy: percentile,
            subjectBreakdown: subjectScores
        });
        console.log("ARTHA: Sending Tier 2 data to AI service with language:", language);
        await this.generateAndSaveAiFeedback(profile, tier, inputData);
        return this.getStatus(userId);
    }
    async processTier3(userId, assessmentId, language, attemptedCountOverride, totalQuestionsOverride) {
        console.log("\n---- ARTHA: Process Tier 3 Result Start ----");
        console.log("ARTHA: User ID:", userId);
        let inputData;
        const tier = 3;
        let attemptedCount = 0;
        let totalQuestions = 15;
        if (assessmentId) {
            console.log("ARTHA: Processing results for assessment ID:", assessmentId);
            const allAttempts = await this.repository.findQuestionAttempts(assessmentId);
            const correctCount = allAttempts.filter(a => a.isCorrect).length;
            attemptedCount = allAttempts.length;
            const totalTime = allAttempts.reduce((acc, a) => acc + a.timeTaken, 0);
            const assessment = await this.repository.findAssessmentById(assessmentId);
            totalQuestions = attemptedCount > 15 ? attemptedCount : 15;
            console.log("ARTHA: Tier 3 Results - Correct:", correctCount, "Attempted:", attemptedCount);
            const accuracy = this.metricsService.calculateAccuracy(correctCount, attemptedCount);
            const speed = this.metricsService.calculateSpeed(totalTime, attemptedCount);
            const consistency = this.metricsService.calculateConsistency(allAttempts);
            inputData = {
                accuracy: Math.round(accuracy),
                speed: parseFloat(speed.toFixed(2)),
                consistency
            };
            try {
                const wrongCount = attemptedCount - correctCount;
                const score = correctCount - (wrongCount * 0.25);
                inputData.score = score;
                inputData.percentile = Math.max(0, Math.min(100, Number(((score / totalQuestions) * 100).toFixed(2))));
                console.log(`ARTHA Percentile Engine: Calculating percentile`);
                console.log(`totalScore (corrected) → ${score}`);
                console.log(`totalQuestions → ${totalQuestions}`);
                console.log(`percentile → ${inputData.percentile}`);
                console.log("ARTHA: Updating Profile Percentile in DB...");
                await this.repository.updateProfilePercentile(userId, inputData.percentile);
            }
            catch (err) {
                this.logger.error('ARTHA: Percentile calculation error for Tier 3', err);
                inputData.percentile = inputData.accuracy;
            }
        }
        const examRecordT3 = await this.repository.findSelectedExam(userId);
        const finalTotalQuestionsT3 = totalQuestionsOverride || examRecordT3?.noOfQuestions || 15;
        const finalAttemptedCountT3 = attemptedCountOverride || attemptedCount;
        console.log(`\nARTHA Progress Engine: Finalizing Tier-3 Progress`);
        console.log(`ARTHA Progress Engine: Total Questions Retrieved`);
        console.log(`Total Questions In Tier: ${finalTotalQuestionsT3}`);
        console.log(`ARTHA Progress Engine: Attempt Count Updated`);
        console.log(`Attempted Questions: ${finalAttemptedCountT3}`);
        console.log(`ARTHA Progress Engine: Calculating Progress`);
        console.log(`Formula: attempted / total * 100`);
        const progress = finalTotalQuestionsT3 > 0 ? Math.min(100, Math.round((finalAttemptedCountT3 / finalTotalQuestionsT3) * 100)) : 0;
        console.log(`ARTHA: Updating Profile Tier 3 Progress: ${progress}%`);
        await this.repository.updateTier3Progress(userId, progress);
        if (!assessmentId) {
            console.log("ARTHA: Loading existing Tier 3 metrics from database...");
            const metrics = await this.repository.findTier3Metrics(userId);
            inputData = {
                accuracy: metrics.accuracy,
                speed: metrics.speed,
                consistency: metrics.consistency,
                percentile: metrics.accuracy
            };
        }
        const readinessIndexT3 = await this.calculateReadiness(userId, 3, {
            time_management_score: inputData.speed,
            mock_average_score: inputData.accuracy,
            consistency_score: inputData.consistency
        });
        console.log("ARTHA: Final Tier 3 Percentile:", inputData.percentile || 0);
        console.log("---- ARTHA: Process Tier 3 Result End ----\n");
        inputData.language = language;
        const assessmentData = {
            tier,
            accuracy: inputData.accuracy,
            speed: inputData.speed,
            consistency: inputData.consistency,
            percentile: inputData.percentile || 0,
            score: inputData.score || 0,
            totalMarks: finalTotalQuestionsT3,
            readinessIndex: readinessIndexT3
        };
        const finalProfile = await this.repository.findProfileByUserId(userId);
        if (!finalProfile)
            throw new Error("Artha Profile not found after update");
        if (assessmentId) {
            await this.repository.completeAssessment(assessmentId, assessmentData);
        }
        else {
            await this.repository.saveAssessment(finalProfile.id, {
                ...assessmentData,
                startTime: new Date(),
                submitTime: new Date()
            });
        }
        await this.repository.upsertRecentReport(userId, {
            tier: 3,
            score: assessmentData.score,
            totalMarks: finalTotalQuestionsT3,
            accuracy: assessmentData.accuracy,
            speed: assessmentData.speed,
            consistency: assessmentData.consistency,
            percentile: assessmentData.percentile,
            readinessIndex: readinessIndexT3
        });
        console.log("ARTHA: Sending Tier 3 data to AI service with language:", language);
        await this.generateAndSaveAiFeedback(finalProfile, tier, inputData);
        return this.getStatus(userId);
    }
    async calculateReadiness(userId, tier, currentData) {
        console.log(`\nARTHA Readiness Engine: Tier submission received`);
        console.log(`ARTHA Readiness Engine: Tier detected → Tier ${tier}`);
        console.log(`ARTHA Readiness Engine: Raw scores extracted → ${JSON.stringify(currentData)}`);
        const profile = await this.repository.findProfileByUserId(userId);
        let aptitude_score = 0;
        let subject_score = 0;
        let time_management_score = 0;
        let mock_average_score = 0;
        let consistency_score = 0;
        console.log(`\nARTHA Readiness Engine: Normalizing scores`);
        if (tier === 1) {
            aptitude_score = currentData.aptitude_score || 0;
        }
        else if (tier === 2) {
            aptitude_score = ((profile?.logicalScore || 0) + (profile?.quantScore || 0) + (profile?.verbalScore || 0)) / 3;
            subject_score = currentData.subject_score || 0;
        }
        else if (tier === 3) {
            aptitude_score = ((profile?.logicalScore || 0) + (profile?.quantScore || 0) + (profile?.verbalScore || 0)) / 3;
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
        const featureVector = [aptitude_score, subject_score, time_management_score, mock_average_score, consistency_score];
        console.log(`ARTHA Readiness Engine: Feature vector → [${featureVector.map(v => Number(v.toFixed(2))).join(',')}]`);
        console.log(`\nARTHA Readiness Engine: Calling readiness_model`);
        try {
            const response = await fetch(`${this.ML_SERVICE_URL}/readiness/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    aptitude_score,
                    subject_score,
                    time_management_score,
                    mock_average_score,
                    consistency_score
                }),
                signal: AbortSignal.timeout(15000)
            });
            if (response.ok) {
                const result = await response.json();
                console.log(`\nARTHA Readiness Engine: Model response → readiness_index = ${result.readinessIndex}`);
                const readinessIndex = Math.round(result.readinessIndex);
                console.log(`ARTHA Readiness Engine: Updating career readiness index in DB`);
                await this.repository.updateProfileReadiness(userId, readinessIndex);
                console.log(`ARTHA Readiness Engine: Returning readiness index to frontend.`);
                return readinessIndex;
            }
            else {
                console.error(`ARTHA Readiness Engine ERROR: Model prediction failed status ${response.status}`);
                const errorText = await response.text();
                console.error(`ARTHA Readiness Engine ERROR Response: ${errorText}`);
                throw new Error("ML Service returned non-200");
            }
        }
        catch (error) {
            console.error(`ARTHA Readiness Engine ERROR [Fallback Activated]: ${error.message}`);
            let fallbackScore = 0;
            if (tier === 1) {
                fallbackScore = aptitude_score * 0.5;
            }
            else if (tier === 2) {
                fallbackScore = (aptitude_score * 0.4) + (subject_score * 0.4);
            }
            else {
                fallbackScore = (aptitude_score * 0.3) + (subject_score * 0.3) + (time_management_score * 0.15) + (mock_average_score * 0.15) + (consistency_score * 0.1);
            }
            const calculatedFallback = Math.round(fallbackScore);
            const finalReadiness = Math.max(profile?.readinessIndex || 0, calculatedFallback);
            console.log(`ARTHA Readiness Engine: Using fallback readiness index: ${finalReadiness}`);
            await this.repository.updateProfileReadiness(userId, finalReadiness);
            return finalReadiness;
        }
    }
    async generateAndSaveAiFeedback(profile, tier, data) {
        try {
            console.log("ARTHA: Sending payload to AI Service:", { tier, language: data.language });
            const response = await fetch(`${this.AI_SERVICE_URL}/ai/intelligence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier,
                    data
                }),
                signal: AbortSignal.timeout(90000)
            });
            if (response.ok) {
                const feedback = await response.json();
                console.log("ARTHA: AI output generated");
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
    __metadata("design:paramtypes", [artha_repository_1.ArthaRepository,
        tier3_metrics_service_1.Tier3MetricsService])
], ArthaService);
//# sourceMappingURL=artha.service.js.map