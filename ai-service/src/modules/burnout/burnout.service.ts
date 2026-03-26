import { Injectable } from '@nestjs/common';
import { burnoutPrompt } from './burnout.prompt';

import { runAIService } from '../../utils/runAIService';

@Injectable()
export class BurnoutService {
  constructor() {}

  async generate(payload: any) {
    return runAIService(burnoutPrompt(payload), payload.language, {
        jsonMode: true,
        expectedFields: ['riskInterpretation', 'strategies', 'advice']
    });
  }
}

