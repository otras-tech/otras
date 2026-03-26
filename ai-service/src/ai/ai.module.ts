import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ProviderFactory } from '../providers/provider.factory';

import { OpenAIProvider } from '../providers/openai.provider'
import { MistralProvider } from '../providers/mistral.provider'
import { LlamaProvider } from '../providers/llama.provider'

import { RoadmapService } from '../modules/roadmap/roadmap.service';
import { CareerService } from '../modules/career-guidance/career.service';
import { EligibilityService } from '../modules/eligibility-explainer/eligibility.service';
import { PerformanceService } from '../modules/performance/performance.service';
import { BurnoutService } from '../modules/burnout/burnout.service';
import { ReportService } from '../modules/report/report.service';
import { IntelligenceService } from '../modules/artha/intelligence.service';
import { ModelRouterService } from '../orchestrator/model-router.service';


@Module({
  providers: [
    AiService,
    ModelRouterService,
    RoadmapService,
    CareerService,
    EligibilityService,
    PerformanceService,
    BurnoutService,
    ReportService,
    IntelligenceService,
    OpenAIProvider,

    MistralProvider,
    LlamaProvider,
    ProviderFactory,
  ],
  controllers: [AiController],
  exports: [AiService, ModelRouterService],
})
export class AiModule {}
