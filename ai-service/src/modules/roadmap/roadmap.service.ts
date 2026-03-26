// ======================================================
// Roadmap Service
// ======================================================

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { roadmapPrompt } from './roadmap.prompt';

import { runAIService } from '../../utils/runAIService';

@Injectable()
export class RoadmapService {
  constructor() {}

  async generate(payload: any) {
    return runAIService(roadmapPrompt(payload), payload.language, {
        jsonMode: true,
        expectedFields: ['overview', 'plan', 'strategy', 'advisory']
    });
  }
}

