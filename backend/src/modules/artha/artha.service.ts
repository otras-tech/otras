import {
  Injectable,
  Logger,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ArthaRepository } from './repository/artha.repository';
import { ArthaProgressDto } from './dto/artha-progress.dto';
import { Tier3MetricsService } from './tier3-metrics.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ReadinessScores } from '../../common/types/types';

@Injectable()
export class ArthaService {
  private readonly logger = new Logger(ArthaService.name);
  private ML_SERVICE_URL!: string;
  private AI_SERVICE_URL!: string;

  constructor(
    private repository: ArthaRepository,
    private metricsService: Tier3MetricsService,
    private configService: ConfigService,
    @InjectQueue('artha') private arthaQueue: Queue,
  ) {
    this.ML_SERVICE_URL =
      this.configService.get('ML_SERVICE_URL') || 'http://127.0.0.1:5000';
    this.AI_SERVICE_URL =
      this.configService.get('AI_SERVICE_URL') ||
      'http://localhost:8000/api/v1';
  }

  async getStatus(
    requesterId: number,
    requesterOtrId: string,
    requesterRole: string,
    userId: string,
  ) {
    if (
      requesterId.toString() !== userId &&
      requesterOtrId !== userId &&
      requesterRole.toUpperCase() !== 'ADMIN'
    ) {
      throw new ForbiddenException('Access denied');
    }

    this.logger.log(`Fetching profile for user ${userId}`);
    const profile = await this.repository.findProfileByUserId(userId);
    const hasSubscription = await this.repository.hasActiveSubscription(userId);

    if (!profile) {
      return {
        tier1: { unlocked: true, completed: false, progress: 0 },
        tier2: { unlocked: false, completed: false, progress: 0, subscriptionRequired: false },
        tier3: { unlocked: false, completed: false, progress: 0, subscriptionRequired: false },
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
      tier1: { unlocked: true, completed: tier1Completed, progress: profile.tier1Progress },
      tier2: {
        unlocked: allCompleted || tier1Completed,
        completed: tier2Completed,
        progress: profile.tier2Progress,
        subscriptionRequired: (allCompleted || tier1Completed) && !tier2Completed && !hasSubscription,
      },
      tier3: {
        unlocked: allCompleted || tier2Completed,
        completed: tier3Completed,
        progress: profile.tier3Progress,
        subscriptionRequired: (allCompleted || tier2Completed) && !tier3Completed && !hasSubscription,
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

  async startTierAssessment(
    requesterId: number,
    requesterOtrId: string,
    requesterRole: string,
    userId: string,
    tier: number,
  ) {
    if (
      requesterId.toString() !== userId &&
      requesterOtrId !== userId &&
      requesterRole.toUpperCase() !== 'ADMIN'
    ) {
      throw new ForbiddenException('Cannot start assessment for another user');
    }
    return this.repository.startAssessment(userId, tier);
  }

  async recordQuestionAttempt(
    requesterId: number,
    requesterOtrId: string,
    requesterRole: string,
    data: {
      assessmentId: string;
      questionId: number;
      selectedOption: string;
      isCorrect: boolean;
      timeTaken: number;
      totalQuestions?: number;
    },
  ) {
    const assessment = await this.repository.findAssessmentById(data.assessmentId);
    if (!assessment) throw new NotFoundException('Assessment session not found');

    if (
      requesterId.toString() !== assessment.profile.userId &&
      requesterOtrId !== assessment.profile.userId &&
      requesterRole.toUpperCase() !== 'ADMIN'
    ) {
      throw new ForbiddenException('Cannot record attempt for another user assessment');
    }

    await this.repository.saveQuestionAttempt(data);
    const allAttempts = await this.repository.findQuestionAttempts(data.assessmentId);

    const totalQuestionsInTier = data.totalQuestions || 15;
    const progress = totalQuestionsInTier > 0 
      ? Math.min(100, Math.round((allAttempts.length / totalQuestionsInTier) * 100))
      : 0;

    await this.repository.updateProfileProgressByTier(
      assessment.profileId,
      assessment.tier,
      progress,
    );

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
      progress,
      correct: correctCount,
    };
  }

  async processTier1(
    requesterId: number,
    requesterOtrId: string,
    requesterRole: string,
    data: ArthaProgressDto,
    assessmentId?: string,
  ) {
    if (
      requesterId.toString() !== data.userId.toString() &&
      requesterOtrId !== data.userId.toString() &&
      requesterRole.toUpperCase() !== 'ADMIN'
    ) {
      throw new ForbiddenException('Cannot submit results for another user');
    }

    const existingProfile = await this.repository.findProfileByUserId(data.userId);
    if (existingProfile) {
      await this.repository.clearFeedback(existingProfile.id as any);
    }

    const score = data.logicalScore + data.quantScore + data.verbalScore;
    const total_questions = data.totalQuestions || 15;
    const totalPerSubject = total_questions / 3;
    const attemptedCount = data.attemptedCount || 0;

    const logicalPercent = Math.round((data.logicalScore / totalPerSubject) * 100);
    const quantPercent = Math.round((data.quantScore / totalPerSubject) * 100);
    const verbalPercent = Math.round((data.verbalScore / totalPerSubject) * 100);

    const progress = total_questions > 0 ? Math.min(100, Math.round((attemptedCount / total_questions) * 100)) : 0;
    const percentile = Math.max(0, Math.min(100, Number(((score / total_questions) * 100).toFixed(2))));

    const readinessIndex = await this.calculateReadiness(data.userId.toString(), 1, { aptitude_score: percentile });

    const profileData = {
      ...data,
      logicalScore: logicalPercent,
      quantScore: quantPercent,
      verbalScore: verbalPercent,
    };

    const profile = await this.repository.createOrUpdateProfile(profileData, percentile, progress, readinessIndex);

    const assessmentData = {
      tier: 1,
      logicalScore: logicalPercent,
      quantScore: quantPercent,
      verbalScore: verbalPercent,
      percentile,
      score,
      totalMarks: total_questions,
      accuracy: Math.round(percentile),
      subjectScores: { logical: logicalPercent, quant: quantPercent, verbal: verbalPercent },
      readinessIndex,
    };

    let actualAssessmentId = assessmentId;
    if (actualAssessmentId) {
      await this.repository.completeAssessment(actualAssessmentId, { ...assessmentData, status: 'PENDING' });
    } else {
      const newAssessment = await this.repository.saveAssessment(profile.id, {
        ...assessmentData,
        status: 'PENDING',
        startTime: new Date(),
        submitTime: new Date(),
      });
      actualAssessmentId = newAssessment.id;
    }

    await this.repository.upsertRecentReport(data.userId.toString(), {
      tier: 1,
      score,
      totalMarks: total_questions,
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
      percentile,
      language: data.language,
    };

    if (this.configService.get('DISABLE_REDIS') === 'true') {
      await this.generateAndSaveAiFeedback(profile, 1, analysisData);
      await this.repository.completeAssessment(actualAssessmentId, { status: 'COMPLETED' });
    } else {
      const job = await this.arthaQueue.add(
        'tier-analysis',
        {
          type: 'tier-analysis',
          userId: data.userId,
          assessmentId: actualAssessmentId,
          tier: 1,
          data: analysisData,
        },
        {
          jobId: `artha-tier1-${data.userId}-${actualAssessmentId}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: { count: 100 },
          removeOnFail: { count: 1000 },
        },
      );
      await this.repository.completeAssessment(actualAssessmentId, {
        jobId: job.id,
      });
    }

    return this.getStatus(requesterId, requesterOtrId, requesterRole, data.userId.toString());
  }

  async processTier2(
    requesterId: number,
    requesterOtrId: string,
    requesterRole: string,
    userId: string,
    assessmentId?: string,
    language?: string,
    attemptedCountOverride?: number,
    totalQuestionsOverride?: number,
  ) {
    if (
      requesterId.toString() !== userId &&
      requesterOtrId !== userId &&
      requesterRole.toUpperCase() !== 'ADMIN'
    ) {
      throw new ForbiddenException('Access denied');
    }

    const { scores: subjectScores, totalMarks: tier2TotalMarks } = await this.repository.findTier2Results(userId);
    const totalQuestions = totalQuestionsOverride || tier2TotalMarks || 20;

    let attemptedCount = 0;
    if (assessmentId) {
      const allAttempts = await this.repository.findQuestionAttempts(assessmentId);
      attemptedCount = allAttempts.length;
    }
    const finalAttemptedCount = attemptedCountOverride || attemptedCount;

    const progress = totalQuestions > 0 ? Math.min(100, Math.round((finalAttemptedCount / totalQuestions) * 100)) : 0;
    await this.repository.updateTier2Progress(userId, progress);

    const totalScore = Object.values(subjectScores).reduce((acc: number, s: number) => acc + s, 0);
    const percentile = Math.max(0, Math.min(100, Number(((totalScore / totalQuestions) * 100).toFixed(2))));

    await this.repository.updateProfilePercentile(userId, percentile);

    const readinessIndex = await this.calculateReadiness(userId, 2, { subject_score: percentile });
    const profile = await this.repository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Artha Profile not found');

    const assessmentData = {
      tier: 2,
      exam: (await this.repository.findSelectedExam(userId))?.name || 'General',
      subjectScores,
      percentile,
      score: totalScore,
      totalMarks: totalQuestions,
      readinessIndex,
    };

    let actualAssessmentId = assessmentId;
    if (actualAssessmentId) {
      await this.repository.completeAssessment(actualAssessmentId, { ...assessmentData, status: 'PENDING' });
    } else {
      const newAssessment = await this.repository.saveAssessment(profile.id, {
        ...assessmentData,
        status: 'PENDING',
        startTime: new Date(),
        submitTime: new Date(),
      });
      actualAssessmentId = newAssessment.id;
    }

    await this.repository.upsertRecentReport(userId, {
      tier: 2,
      score: totalScore,
      totalMarks: totalQuestions,
      percentile,
      readinessIndex,
      accuracy: percentile,
      subjectBreakdown: subjectScores,
    });

    const analysisData = { ...assessmentData, subject_score: percentile, language };

    if (this.configService.get('DISABLE_REDIS') === 'true') {
      await this.generateAndSaveAiFeedback(profile, 2, analysisData);
      await this.repository.completeAssessment(actualAssessmentId, { status: 'COMPLETED' });
    } else {
      const job = await this.arthaQueue.add(
        'tier-analysis',
        {
          type: 'tier-analysis',
          userId,
          assessmentId: actualAssessmentId,
          tier: 2,
          data: analysisData,
        },
        {
          jobId: `artha-tier2-${userId}-${actualAssessmentId}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: { count: 100 },
          removeOnFail: { count: 1000 },
        },
      );
      await this.repository.completeAssessment(actualAssessmentId, {
        jobId: job.id,
      });
    }

    return this.getStatus(requesterId, requesterOtrId, requesterRole, userId);
  }

  async processTier3(
    requesterId: number,
    requesterOtrId: string,
    requesterRole: string,
    userId: string,
    assessmentId?: string,
    language?: string,
    attemptedCountOverride?: number,
    totalQuestionsOverride?: number,
  ) {
    if (
      requesterId.toString() !== userId &&
      requesterOtrId !== userId &&
      requesterRole.toUpperCase() !== 'ADMIN'
    ) {
      throw new ForbiddenException('Access denied');
    }

    let inputData: any = {};
    let attemptedCount = 0;
    let totalQuestions = totalQuestionsOverride || 15;

    if (assessmentId) {
      const allAttempts = await this.repository.findQuestionAttempts(assessmentId);
      const correctCount = allAttempts.filter((a) => a.isCorrect).length;
      attemptedCount = allAttempts.length;
      const totalTime = allAttempts.reduce((acc, a) => acc + a.timeTaken, 0);

      const accuracy = this.metricsService.calculateAccuracy(correctCount, attemptedCount);
      const speed = this.metricsService.calculateSpeed(totalTime, attemptedCount);
      const consistency = this.metricsService.calculateConsistency(allAttempts);

      const score = correctCount - (attemptedCount - correctCount) * 0.25;
      const percentile = Math.max(0, Math.min(100, Number(((score / totalQuestions) * 100).toFixed(2))));

      await this.repository.updateProfilePercentile(userId, percentile);

      inputData = { accuracy: Math.round(accuracy), speed: parseFloat(speed.toFixed(2)), consistency, percentile, score };
    } else {
      const metrics = await this.repository.findTier3Metrics(userId);
      inputData = { accuracy: metrics.accuracy, speed: metrics.speed, consistency: metrics.consistency, percentile: metrics.accuracy, score: 0 };
    }

    const progress = totalQuestions > 0 ? Math.min(100, Math.round((attemptedCount || 0) / totalQuestions * 100)) : 0;
    await this.repository.updateTier3Progress(userId, progress);

    const readinessIndex = await this.calculateReadiness(userId, 3, {
      time_management_score: inputData.speed,
      mock_average_score: inputData.accuracy,
      consistency_score: inputData.consistency,
    });

    const profile = await this.repository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Artha Profile not found');

    const assessmentData = {
      tier: 3,
      accuracy: inputData.accuracy,
      speed: inputData.speed,
      consistency: inputData.consistency,
      percentile: inputData.percentile,
      score: inputData.score,
      totalMarks: totalQuestions,
      readinessIndex,
    };

    let actualAssessmentId = assessmentId;
    if (actualAssessmentId) {
      await this.repository.completeAssessment(actualAssessmentId, { ...assessmentData, status: 'PENDING' });
    } else {
      const newAssessment = await this.repository.saveAssessment(profile.id, {
        ...assessmentData,
        status: 'PENDING',
        startTime: new Date(),
        submitTime: new Date(),
      });
      actualAssessmentId = newAssessment.id;
    }

    await this.repository.upsertRecentReport(userId, {
      tier: 3,
      score: assessmentData.score,
      totalMarks: totalQuestions,
      accuracy: assessmentData.accuracy,
      speed: assessmentData.speed,
      consistency: assessmentData.consistency,
      percentile: assessmentData.percentile,
      readinessIndex,
    });

    const analysisData = { ...inputData, language };

    if (this.configService.get('DISABLE_REDIS') === 'true') {
      await this.generateAndSaveAiFeedback(profile, 3, analysisData);
      await this.repository.completeAssessment(actualAssessmentId, { status: 'COMPLETED' });
    } else {
      const job = await this.arthaQueue.add(
        'tier-analysis',
        {
          type: 'tier-analysis',
          userId,
          assessmentId: actualAssessmentId,
          tier: 3,
          data: analysisData,
        },
        {
          jobId: `artha-tier3-${userId}-${actualAssessmentId}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: { count: 100 },
          removeOnFail: { count: 1000 },
        },
      );
      await this.repository.completeAssessment(actualAssessmentId, {
        jobId: job.id,
      });
    }

    return this.getStatus(requesterId, requesterOtrId, requesterRole, userId);
  }

  private async calculateReadiness(userId: string, tier: number, currentData: ReadinessScores) {
    const profile = await this.repository.findProfileByUserId(userId);
    let aptitude = 0, subject = 0, time = 0, mock = 0, consistency = 0;

    if (tier === 1) {
      aptitude = currentData.aptitude_score || 0;
    } else if (tier === 2) {
      aptitude = ((profile?.logicalScore || 0) + (profile?.quantScore || 0) + (profile?.verbalScore || 0)) / 3;
      subject = currentData.subject_score || 0;
    } else if (tier === 3) {
      aptitude = ((profile?.logicalScore || 0) + (profile?.quantScore || 0) + (profile?.verbalScore || 0)) / 3;
      const t2 = await this.repository.findLatestAssessmentByTier(profile?.id || '', 2);
      subject = t2?.percentile || 0;
      time = currentData.time_management_score || 0;
      mock = currentData.mock_average_score || 0;
      consistency = currentData.consistency_score || 0;
    }

    // Call ML service or return weighted average for now:
    return Math.round((aptitude + subject + time + mock + consistency) / 5);
  }

  private async generateAndSaveAiFeedback(profile: any, tier: number, data: any) {
    // Call AI service...
    this.logger.log(`AI Feedback generated for tier ${tier}`);
    await this.repository.saveFeedback(profile.id, tier, { readinessInsight: 'Solid progress!' });
  }
}
