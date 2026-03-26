import { Injectable, Logger } from '@nestjs/common';
import { studyPlanPrompt } from './prompt';

import { runAIService } from '../../utils/runAIService';

@Injectable()
export class StudyPlanService {
  private readonly logger = new Logger(StudyPlanService.name);

  constructor() { }

  async generate(input: any) {
    const totalDays = input.planDurationDays || 7;
    const chunkSize = 5;
    const chunks = Math.ceil(totalDays / chunkSize);

    this.logger.log(`StudyPlan: Generating ${totalDays} days in ${chunks} chunks.`);

    let allDays: any[] = [];
    let summaries: string[] = [];
    let recommendations: string[] = [];

    const chunkPromises = Array.from({ length: chunks }, (_, i) => {
      const startDay = (i * chunkSize) + 1;
      const daysToGen = Math.min(chunkSize, totalDays - (i * chunkSize));
      const prompt = studyPlanPrompt(input, daysToGen, startDay);
      
      return runAIService(prompt, input.language, {
        jsonMode: true,
        expectedFields: ['summary', 'days']
      });
    });

    const results = await Promise.all(chunkPromises);

    for (const result of results) {
      if (result) {
        if (Array.isArray(result.days)) allDays = [...allDays, ...result.days];
        if (result.summary) summaries.push(result.summary);
        if (Array.isArray(result.recommendations)) {
          recommendations = [...recommendations, ...result.recommendations];
        }
      }
    }

    if (allDays.length === 0) {
      this.logger.error("Failed to generate any days for the study plan.");
      return this.getFallback();
    }

    // ✅ Final Validation: Sort by dayNumber & Remove duplicates
    allDays.sort((a, b) => a.dayNumber - b.dayNumber);
    const uniqueDays = Array.from(new Map(allDays.map(d => [d.dayNumber, d])).values());

    this.logger.log(`StudyPlan: Final merged plan contains ${uniqueDays.length} unique days.`);

    return {
      planDurationDays: uniqueDays.length,
      summary: summaries.join(" | "),
      recommendations: [...new Set(recommendations)],
      days: uniqueDays
    };
  }

  private getFallback() {
    return {
      days: [],
      summary: "AI study plan generation failed. Returning safe template.",
      recommendations: []
    };
  }
}