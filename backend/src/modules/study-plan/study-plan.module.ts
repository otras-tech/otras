import { Module } from '@nestjs/common';
import { StudyPlanController } from './controller/study-plan.controller';
import { StudyPlanService } from './service/study-plan.service';
import { StudyPlanRepository } from './repository/study-plan.repository';
import { ReschedulerService } from './service/rescheduler.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudyPlanController],
  providers: [StudyPlanService, StudyPlanRepository, ReschedulerService],
  exports: [StudyPlanService],
})
export class StudyPlanModule {}
