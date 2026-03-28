import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CareerAIController } from './controller/career-ai.controller';
import { CareerAIService } from './service/career-ai.service';
import { CareerAIProcessor } from './service/career-ai.processor';
import { NotificationGateway } from '../../common/notification.gateway';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'career-ai',
    }),
  ],
  controllers: [CareerAIController],
  providers: [CareerAIService, CareerAIProcessor, NotificationGateway],
  exports: [CareerAIService],
})
export class CareerAIModule {}
