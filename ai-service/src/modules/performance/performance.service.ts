import { Injectable } from '@nestjs/common';
import { performancePrompt } from './performance.prompt';

import { runAIService } from '../../utils/runAIService';

@Injectable()
export class PerformanceService {
  constructor() {}

  async generate(payload: any) {
    return runAIService(performancePrompt(payload), payload.language, {
        jsonMode: true,
        expectedFields: ['weaknesses', 'suggestions', 'timeStrategy', 'routine']
    });
  }
}

