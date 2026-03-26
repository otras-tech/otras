import { Module } from '@nestjs/common';
import { StudyPlanController } from './study-plan.controller';
import { StudyPlanService } from './study-plan.service';
import { AiModule } from '../../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [StudyPlanController],
  providers: [StudyPlanService],
})
export class StudyPlanModule {}
