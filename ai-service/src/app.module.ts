import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

import openaiConfig from './config/openai.config'
import mistralConfig from './config/mistral.config'
import llamaConfig from './config/llama.config'
import aiConfig from './config/ai.config'

import { AiModule } from './ai/ai.module'
import { CareerAiModule } from './modules/career-ai/career-ai.module'
import { StudyPlanModule } from './modules/study-plan/study-plan.module'

@Module({

  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        openaiConfig,
        mistralConfig,
        llamaConfig,
        aiConfig
      ],
    }),

    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    AiModule,
    CareerAiModule,
    StudyPlanModule,

  ],
//   providers: [
//     {
//       provide: APP_GUARD,
//       useClass: ThrottlerGuard,
//     },
//   ],

})
export class AppModule {}
