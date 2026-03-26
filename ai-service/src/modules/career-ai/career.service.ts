import { Injectable, Logger } from '@nestjs/common';
import { runAIService } from '../../utils/runAIService';
import { roadmapPrompt } from './prompt';

@Injectable()
export class CareerAIService {
  private readonly logger = new Logger(CareerAIService.name);

  async generate(dto: any) {
    try {
      this.logger.log(`CareerAI: Generating roadmap for ${dto.language}`);
      const prompt = roadmapPrompt(dto);
      
      const result = await runAIService(prompt, dto.language, {
        jsonMode: true,
        expectedFields: ['summary', 'recommendations', 'sixMonth', 'oneYear']
      });

      return { roadmap: result };
    } catch (error) {
      this.logger.error(`CareerAI generation failed: ${error.message}`);
      return { 
        roadmap: this.getFallbackPlan(),
        error: error.message 
      };
    }
  }

  private getFallbackPlan() {
    return {
      summary: "AI plan temporarily unavailable. Returning safe guidance.",
      recommendations: ["Self-evaluation", "Review basics", "Identify goals"],
      sixMonth: [
        { month: "Month 1", tasks: ["Focus on foundational logic", "Complete first assessment unit"] },
        { month: "Month 2", tasks: ["Quantitative aptitude drill", "Develop reading habits"] },
        { month: "Month 3", tasks: ["Verbal speed exercises", "Weekly mock simulation"] },
        { month: "Month 4", tasks: ["Topic-wise strength mapping", "Strategy development"] },
        { month: "Month 5", tasks: ["Full-length timed mock tests", "Weak area focus"] },
        { month: "Month 6", tasks: ["Final concept polish", "Exam day readiness"] }
      ],
      oneYear: [
        { phase: "Advanced Mastery", tasks: ["Senior level certifications", "Implementation projects"] }
      ]
    };
  }
}