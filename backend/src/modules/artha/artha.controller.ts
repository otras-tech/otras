import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ArthaService } from './artha.service';

import { ArthaProgressDto } from './dto/artha-progress.dto';

import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

class ArthaStartTierDto {
  @IsString()
  userId: string = '';
}

class ArthaTierAssessmentDto {
  @IsString()
  userId: string = '';

  @IsString()
  @IsOptional()
  assessmentId?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsNumber()
  @IsOptional()
  attemptedCount?: number;

  @IsNumber()
  @IsOptional()
  totalQuestions?: number;
}

class ArthaQuestionAttemptDto {
  @IsString()
  assessmentId: string = '';

  @IsNumber()
  questionId: number = 0;

  @IsString()
  selectedOption: string = '';

  @IsBoolean()
  isCorrect: boolean = false;

  @IsNumber()
  timeTaken: number = 0;
}

@Controller('artha')
export class ArthaController {
  constructor(private service: ArthaService) {}

  @Get('status/:userId')
  async getStatus(@Param('userId') userId: string) {
    return this.service.getStatus(userId);
  }

  @Post('start-tier/:tier')
  async startTier(
    @Body() body: ArthaStartTierDto,
    @Param('tier') tier: string,
  ) {
    return this.service.startTierAssessment(body.userId, parseInt(tier, 10));
  }

  @Post('tier1')
  async completeTier1(
    @Body() body: ArthaProgressDto & { assessmentId?: string },
  ) {
    return this.service.processTier1(body, body.assessmentId);
  }

  @Post('tier2')
  async completeTier2(
    @Body() body: ArthaTierAssessmentDto,
  ) {
    return this.service.processTier2(
      body.userId,
      body.assessmentId,
      body.language,
      body.attemptedCount,
      body.totalQuestions,
    );
  }

  @Post('tier3')
  async completeTier3(
    @Body() body: ArthaTierAssessmentDto,
  ) {
    return this.service.processTier3(
      body.userId,
      body.assessmentId,
      body.language,
      body.attemptedCount,
      body.totalQuestions,
    );
  }

  @Post('attempt-question')
  async attemptQuestion(
    @Body() body: ArthaQuestionAttemptDto,
  ) {
    return this.service.recordQuestionAttempt(body);
  }

  @Get('recent-reports/:userId')
  async getRecentReports(@Param('userId') userId: string) {
    return this.service.getStatus(userId); // getStatus now includes recentReports
  }
}
