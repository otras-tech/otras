import { Module } from '@nestjs/common';
import { CareerController } from './career.controller';
import { CareerAIService } from './career.service';

@Module({
  controllers: [CareerController],
  providers: [CareerAIService],
  exports: [CareerAIService]
})
export class CareerAiModule {}
