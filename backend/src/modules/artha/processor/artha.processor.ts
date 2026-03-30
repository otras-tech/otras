import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ArthaRepository } from '../repository/artha.repository';
import { ConfigService } from '@nestjs/config';

@Processor('artha')
export class ArthaProcessor extends WorkerHost {
    private readonly logger = new Logger(ArthaProcessor.name);
    private ML_SERVICE_URL: string;
    private AI_SERVICE_URL: string;

    constructor(
        private readonly repository: ArthaRepository,
        private readonly configService: ConfigService
    ) {
        super();
        this.ML_SERVICE_URL = this.configService.get('ML_SERVICE_URL') || 'http://127.0.0.1:5000';
        this.AI_SERVICE_URL = this.configService.get('AI_SERVICE_URL') || 'http://localhost:8000/api/v1';
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { type, userId, assessmentId, tier, data } = job.data;
        this.logger.log(`Processing artha job ${job.id} of type ${type} for user ${userId}`);

        try {
            if (type === 'tier-analysis') {
                await this.handleTierAnalysis(userId, assessmentId, tier, data);
            }
            return { status: 'completed' };
        } catch (error) {
            this.logger.error(`Failed to process artha job ${job.id}`, error.stack);
            throw error;
        }
    }

    private async handleTierAnalysis(userId: string, assessmentId: string, tier: number, inputData: any) {
        // Update status to PROCESSING
        await this.repository.completeAssessment(assessmentId, { status: 'PROCESSING' });

        const profile = await this.repository.findProfileByUserId(userId);
        if (!profile) throw new Error("Artha Profile not found");

        // 1. Calculate Readiness (ML)
        let readinessIndex = profile.readinessIndex;
        try {
            readinessIndex = await this.calculateReadiness(userId, tier, inputData);
            this.logger.log(`Readiness calculated: ${readinessIndex}`);
        } catch (err) {
            this.logger.error("ML Readiness calculation failed in background", err);
        }

        // 2. Generate AI Feedback
        let feedback = null;
        try {
            feedback = await this.generateAiFeedback(tier, inputData);
            if (feedback) {
                await this.repository.saveFeedback(profile.id, tier, feedback);
                this.logger.log("AI Feedback saved");
            }
        } catch (err) {
            this.logger.error("AI Feedback generation failed in background", err);
        }

        // 3. Finalize Assessment
        await this.repository.completeAssessment(assessmentId, {
            status: 'COMPLETED',
            readinessIndex
        });

        this.logger.log(`Artha analysis completed for assessment ${assessmentId}`);
    }

    private async calculateReadiness(userId: string, tier: number, currentData: any) {
        // Logic extracted from ArthaService
        const response = await fetch(`${this.ML_SERVICE_URL}/readiness/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentData),
            signal: AbortSignal.timeout(15000)
        });

        if (response.ok) {
            const result = await response.json();
            const readinessIndex = Math.round(result.readinessIndex);
            await this.repository.updateProfileReadiness(userId, readinessIndex);
            return readinessIndex;
        }
        throw new Error(`ML Service failed with status ${response.status}`);
    }

    private async generateAiFeedback(tier: number, data: any) {
        const response = await fetch(`${this.AI_SERVICE_URL}/ai/intelligence`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tier, data }),
            signal: AbortSignal.timeout(90000)
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error(`AI Service failed with status ${response.status}`);
    }
}
