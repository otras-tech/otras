import { Module } from '@nestjs/common';
import { CareerReadinessController } from './career-readiness.controller';
import { CareerReadinessService } from './career-readiness.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CareerReadinessController],
  providers: [CareerReadinessService],
})
export class CareerReadinessModule {}
