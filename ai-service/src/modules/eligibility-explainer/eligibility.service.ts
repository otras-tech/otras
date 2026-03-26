import { Injectable } from '@nestjs/common';
import { eligibilityPrompt } from './eligibility.prompt';

import { runAIService } from '../../utils/runAIService';

@Injectable()
export class EligibilityService {
  constructor() {}

  async generate(payload: any) {
    return runAIService(eligibilityPrompt(payload), payload.language, {
        jsonMode: true,
        expectedFields: ['decision', 'improvements', 'alternatives']
    });
  }
}

