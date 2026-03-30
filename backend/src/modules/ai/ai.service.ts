import { Injectable, BadRequestException } from '@nestjs/common';
import { AiRequestDto } from './dto/ai-request.dto';
import { buildPrompt } from './utils/prompt-builder';
import { OpenAiProvider } from './providers/openai.provider';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  constructor(
    private readonly openAiProvider: OpenAiProvider,
    @InjectQueue('career-ai') private aiQueue: Queue,
    private prisma: PrismaService,
    private configService: ConfigService
  ) { }

  async generate(dto: AiRequestDto) {
    const { language, ...data } = dto;

    if (!['en', 'hi', 'te'].includes(language)) {
      throw new BadRequestException('Unsupported language');
    }

    // Prepare data with defaults
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

    // Use a stable identifier for status tracking
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
        }
    });

    const roadmap = await (this.prisma.roadmap.create({
        data: {
            profileId: prof.id,
            summary: "Processing career study plan...",
            recommendations: [],
            phase1: "Queued",
            phase2: "Queued",
            status: 'PENDING'
        } as any
    }) as any);

    if (this.configService.get('DISABLE_REDIS') === 'true') {
        process.nextTick(async () => {
            // Dev context: process locally
            try {
                const prompt = buildPrompt(data, language);
                const systemPrompt = "You are an institutional career advisor.";
                const simulatedResponse = await this.openAiProvider.generateCompletion(systemPrompt, prompt);
                
                // simulatedResponse might be an object or a string depending on provider
                const summary = typeof simulatedResponse === 'string' ? simulatedResponse : (simulatedResponse as any).summary || "Generated roadmap";
                const recommendations = (simulatedResponse as any).recommendations && Array.isArray((simulatedResponse as any).recommendations) ? (simulatedResponse as any).recommendations : [];

                await (this.prisma.roadmap.update({
                    where: { id: roadmap.id },
                    data: {
                        summary,
                        recommendations,
                        phase1: (simulatedResponse as any).phase1 || "Completed",
                        phase2: (simulatedResponse as any).phase2 || "Completed",
                        status: 'COMPLETED'
                    } as any
                }) as any);
            } catch (err) {
                console.error('Local AiService execution failed:', err);
                await this.prisma.roadmap.update({
                    where: { id: roadmap.id },
                    data: { status: 'FAILED' }
                });
            }
        });
    } else {
        const job = await this.aiQueue.add('generate-roadmap', {
            data: richData,
            language,
            roadmapId: roadmap.id
        });
        await this.prisma.roadmap.update({
            where: { id: roadmap.id },
            data: { jobId: job.id }
        });
    }

    return {
      success: true,
      status: 'processing',
      message: 'Roadmap generation started',
      jobId: roadmap.id, // Using roadmap ID for status check
      language
    };
  }

  async getStatus(roadmapId: string) {
      const roadmap = await (this.prisma.roadmap.findUnique({
          where: { id: roadmapId },
          include: { IntelligenceProfile: true }
      }) as any);
      if (!roadmap) return { success: false, status: 'NOT_FOUND' };
      return {
          success: true,
          status: roadmap.status,
          roadmap: roadmap.status === 'COMPLETED' ? roadmap : null
      };
  }
}
