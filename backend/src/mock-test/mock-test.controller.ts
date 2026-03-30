import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MockTestService } from './mock-test.service';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

class StartAttemptDto {
  @IsString()
  @IsNotEmpty()
  otrId: string;

  @IsNumber()
  @IsNotEmpty()
  mockTestId: number;
}

class AttemptDto {
  @IsString()
  @IsNotEmpty()
  otrId: string;

  @IsNumber()
  @IsNotEmpty()
  mockTestId: number;

  @IsNumber()
  @IsNotEmpty()
  score: number;

  @IsNumber()
  @IsNotEmpty()
  totalMarks: number;
}

class ExamAttemptDto {
  @IsString()
  @IsNotEmpty()
  otrId: string;

  @IsNumber()
  @IsNotEmpty()
  examId: number;

  @IsNumber()
  @IsNotEmpty()
  score: number;

  @IsNumber()
  @IsNotEmpty()
  totalMarks: number;

  @IsNumber()
  @IsOptional()
  attemptId? : number;

  @IsNumber()
  @IsOptional()
  correctAnswers? : number;

  @IsOptional()
  subjectBreakdown? : any;
}

@Controller('mock-test')
export class MockTestController {
  constructor(private readonly mockTestService: MockTestService) {}

  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.mockTestService.findAll(categoryId ? +categoryId : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Post('start-attempt')
  startAttempt(@Body() dto: StartAttemptDto) {
    return this.mockTestService.startAttempt(dto.otrId, dto.mockTestId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('attempts')
  submitAttempt(@Body() dto: AttemptDto) {
    return this.mockTestService.submitAttempt(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('exam-attempts')
  submitExamAttempt(@Body() dto: ExamAttemptDto) {
    return this.mockTestService.submitExamAttempt(dto);
  }

  @Get('attempts/recent/:otrId')
  getRecentAttempt(@Param('otrId') otrId: string) {
    return this.mockTestService.getRecentAttempt(otrId);
  }

  @Get('rank/:mockTestId/:otrId')
  calculateRank(
    @Param('mockTestId') mockTestId: string,
    @Param('otrId') otrId: string,
  ) {
    return this.mockTestService.calculateRank(+mockTestId, otrId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mockTestService.findOne(+id);
  }
}
