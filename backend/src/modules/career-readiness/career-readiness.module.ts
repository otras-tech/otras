import { Module } from '@nestjs/common';
import { CareerReadinessController } from './career-readiness.controller';
import { CareerReadinessService } from './career-readiness.service';
import { CareerReadinessRepository } from './repository/career-readiness.repository';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CareerReadinessController],
  providers: [CareerReadinessService, CareerReadinessRepository],
  exports: [CareerReadinessService, CareerReadinessRepository],
})
export class CareerReadinessModule {}
