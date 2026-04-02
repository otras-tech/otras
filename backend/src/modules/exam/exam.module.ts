import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { ExamRepository } from './repository/exam.repository';

@Module({
  controllers: [ExamController],
  providers: [ExamService, ExamRepository],
  exports: [ExamService],
})
export class ExamModule {}
