import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { AiRequestDto } from './dto/ai-request.dto';
import { buildPrompt } from './utils/prompt-builder';
import { OpenAiProvider } from './providers/openai.provider';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../database/prisma.service';
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
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async generate(dto: AiRequestDto) {
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

    const prof = await this.prisma.intelligenceProfile.create({
      data: {
        userId: richData.userId,
        logicalScore: Number(richData.logicalScore),
        quantScore: Number(richData.quantScore),
        verbalScore: Number(richData.verbalScore),
        interests: richData.interests,
        learningPattern: richData.learningPattern,
        confidenceIndex: Number(richData.confidenceScore),
        aspirations: richData.aspirations,
      },
    });

    const roadmap = await this.prisma.roadmap.create({
      data: {
        profileId: prof.id,
        summary: 'Processing career study plan...',
        recommendations: [],
        phase1: 'Queued',
        phase2: 'Queued',
        status: 'PENDING',
      },
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

          await this.prisma.roadmap.update({
            where: { id: roadmap.id },
            data: {
              summary,
              recommendations,
              phase1: simulatedResponse.phase1 ?? 'Completed',
              phase2: simulatedResponse.phase2 ?? 'Completed',
              status: 'COMPLETED',
            },
          });
        } catch (err) {
          this.logger.error('Local AiService execution failed:', err);
          await this.prisma.roadmap.update({
            where: { id: roadmap.id },
            data: { status: 'FAILED' },
          });
        }
      });
    } else {
      const job = await this.aiQueue.add('generate-roadmap', {
        data: richData,
        language,
        roadmapId: roadmap.id,
      });
      await this.prisma.roadmap.update({
        where: { id: roadmap.id },
        data: { jobId: job.id },
      });
    }

    return {
      success: true,
      status: 'processing',
      message: 'Roadmap generation started',
      jobId: roadmap.id,
      language,
    };
  }

  async getStatus(roadmapId: string) {
    const roadmap = await this.prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: { IntelligenceProfile: true },
    });
    if (!roadmap) return { success: false, status: 'NOT_FOUND' };
    return {
      success: true,
      status: roadmap.status,
      roadmap: roadmap.status === 'COMPLETED' ? roadmap : null,
    };
  }
}
