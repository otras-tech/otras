import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler'
import { RoadmapService } from '../modules/roadmap/roadmap.service';
import { CareerService } from '../modules/career-guidance/career.service';
import { EligibilityService } from '../modules/eligibility-explainer/eligibility.service';
import { PerformanceService } from '../modules/performance/performance.service';
import { BurnoutService } from '../modules/burnout/burnout.service';
import { ReportService } from '../modules/report/report.service';
import { IntelligenceService } from '../modules/artha/intelligence.service';


import { runAIService } from '../utils/runAIService';

@Controller('ai')
export class AiController {
  constructor(
    private roadmap: RoadmapService,
    private career: CareerService,
    private eligibility: EligibilityService,
    private performance: PerformanceService,
    private burnout: BurnoutService,
    private report: ReportService,
    private intelligence: IntelligenceService,
  ) {}


  @Post('roadmap')
  roadmapGen(@Body() body: any) {
    return this.roadmap.generate(body);
  }

  @Post('career')
  careerGen(@Body() body: any) {
    return this.career.generate(body);
  }

  @Post('eligibility')
  eligibilityGen(@Body() body: any) {
    return this.eligibility.generate(body);
  }

  @Post('performance')
  performanceGen(@Body() body: any) {
    return this.performance.generate(body);
  }

  @Post('burnout')
  burnoutGen(@Body() body: any) {
    return this.burnout.generate(body);
  }

  @Post('report')
  reportGen(@Body() body: any) {
    return this.report.generate(body);
  }

  @Post('intelligence')
  intelligenceGen(@Body() body: any) {
    console.log("AI_SERVICE: Incoming intelligence request", JSON.stringify(body, null, 2));
    return this.intelligence.generateFeedback(body.tier || 1, body.data || body);
  }


  @Post('generate')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async generateAI(@Body() body: any) {
    const lang = body.language || body.payload?.language || 'en-IN';
    return runAIService(body.prompt, lang);
  }
}
