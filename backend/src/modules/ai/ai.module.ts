import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { OpenAiProvider } from './providers/openai.provider';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AiProcessor } from './processor/ai.processor';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    ...(process.env.DISABLE_REDIS === 'true'
      ? []
      : [
          BullModule.registerQueue({
            name: 'career-ai'
          }),
        ]),
  ],
  controllers: [AiController],
  providers: [
    AiService, 
    OpenAiProvider, 
    AiProcessor,
    ...(process.env.DISABLE_REDIS === 'true'
      ? [
          {
            provide: 'BullQueue_career-ai',
            useValue: { add: async () => ({ id: 'fake-ai-job-id' }) },
          },
        ]
      : []),
  ],
  exports: [AiService]
})
export class AiModule {}
