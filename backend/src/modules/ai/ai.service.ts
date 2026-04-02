import { Injectable, BadRequestException, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AiRequestDto } from './dto/ai-request.dto';
import { buildPrompt } from './utils/prompt-builder';
import { OpenAiProvider } from './providers/openai.provider';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AiRepository } from './repository/ai.repository';
import { ConfigService } from '@nestjs/config';

interface SimulatedRoadmap {
  summary?: string;
  recommendations?: string[];
  phase1?: string;
  phase2?: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly openAiProvider: OpenAiProvider,
    @InjectQueue('career-ai') private aiQueue: Queue,
    private readonly repository: AiRepository,
    private readonly configService: ConfigService,
  ) {}

  async generate(requesterOtrId: string, requesterRole: string, dto: AiRequestDto) {
    if (requesterOtrId !== dto.userId && requesterRole !== 'ADMIN') {
      throw new ForbiddenException('Cannot generate roadmap for another user');
    }

    const { language, ...data } = dto;

    if (!['en', 'hi', 'te'].includes(language)) {
      throw new BadRequestException('Unsupported language');
    }

    const richData = {
      userId: dto.userId?.toString() || 'unknown',
      logicalScore: dto.logicalScore || 0,
      quantScore: dto.quantScore || 0,
      verbalScore: dto.verbalScore || 0,
      interests: dto.interests || [],
      learningPattern: dto.learningPattern || 'Standard',
      confidenceScore: dto.confidenceScore || 0,
      aspirations: dto.aspirations || 'None provided',
    };

    const prof = await this.repository.createProfile({
      userId: richData.userId,
      logicalScore: Number(richData.logicalScore),
      quantScore: Number(richData.quantScore),
      verbalScore: Number(richData.verbalScore),
      interests: richData.interests,
      learningPattern: richData.learningPattern,
      confidenceIndex: Number(richData.confidenceScore),
      aspirations: richData.aspirations,
    });

    const roadmap = await this.repository.createRoadmap({
      profileId: prof.id,
      summary: 'Processing career study plan...',
      recommendations: [],
      phase1: 'Queued',
      phase2: 'Queued',
      status: 'PENDING',
    });

    if (this.configService.get('DISABLE_REDIS') === 'true') {
      process.nextTick(async () => {
        try {
          const prompt = buildPrompt(data as Record<string, unknown>, language);
          const systemPrompt = 'You are an institutional career advisor.';
          const simulatedResponse =
            (await this.openAiProvider.generateCompletion(
              systemPrompt,
              prompt,
            )) as SimulatedRoadmap;

          const summary =
            typeof simulatedResponse === 'string'
              ? simulatedResponse
              : (simulatedResponse.summary ?? 'Generated roadmap');

          const recommendations = Array.isArray(
            simulatedResponse.recommendations,
          )
            ? simulatedResponse.recommendations
            : [];

          await this.repository.updateRoadmap(roadmap.id, {
            summary,
            recommendations,
            phase1: simulatedResponse.phase1 ?? 'Completed',
            phase2: simulatedResponse.phase2 ?? 'Completed',
            status: 'COMPLETED',
          });
        } catch (err) {
          this.logger.error('Local AiService execution failed:', err);
          await this.repository.updateRoadmap(roadmap.id, { status: 'FAILED' });
        }
      });
    } else {
      const job = await this.aiQueue.add('generate-roadmap', {
        data: richData,
        language,
        roadmapId: roadmap.id,
      });
      await this.repository.updateRoadmap(roadmap.id, { jobId: job.id });
    }

    return {
      success: true,
      status: 'processing',
      message: 'Roadmap generation started',
      jobId: roadmap.id,
      language,
    };
  }

  async getStatus(requesterOtrId: string, requesterRole: string, roadmapId: string) {
    const roadmap = await this.repository.findRoadmapById(roadmapId);
    if (!roadmap) throw new NotFoundException('Roadmap not found');

    if (roadmap.IntelligenceProfile.userId !== requesterOtrId && requesterRole !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    return {
      success: true,
      status: roadmap.status,
      roadmap: roadmap.status === 'COMPLETED' ? roadmap : null,
    };
  }
}
