import { Injectable } from '@nestjs/common';
import { reportPrompt } from './report.prompt';

import { runAIService } from '../../utils/runAIService';

@Injectable()
export class ReportService {
  constructor() {}

  async generate(payload: any) {
    return runAIService(reportPrompt(payload), payload.language, {
        jsonMode: true,
        expectedFields: ['summary', 'assessment', 'strengthsAndImprovements', 'plan', 'parentSummary']
    });
  }
}

