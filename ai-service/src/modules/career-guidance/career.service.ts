import { Injectable } from '@nestjs/common';
import { careerPrompt } from './career.prompt';

import { runAIService } from '../../utils/runAIService';

@Injectable()
export class CareerService {
  constructor() {}

  async generate(payload: any) {
    return runAIService(careerPrompt(payload), payload.language, {
        jsonMode: true,
        expectedFields: ['clusters', 'reasoning', 'roadmap', 'nextSteps']
    });
  }
}

