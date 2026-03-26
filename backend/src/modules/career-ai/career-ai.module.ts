import { Module } from '@nestjs/common';
import { CareerAiController } from './controller/career-ai.controller';
import { CareerAIService } from './service/career-ai.service';

@Module({
  controllers: [CareerAiController],
  providers: [CareerAIService],
  exports: [CareerAIService],
})
export class CareerAIModule {}
