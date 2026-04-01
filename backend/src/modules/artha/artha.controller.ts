import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArthaService } from './artha.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ArthaProgressDto } from './dto/artha-progress.dto';
import {
  StartTierDto,
  ArthaTierResultDto,
  ArthaQuestionAttemptDto,
} from './dto/artha-tier.dto';

@ApiTags('Artha AI Assessment')
@Controller('artha')
export class ArthaController {
  constructor(private service: ArthaService) {}

  @Get('status/:userId')
  @ApiOperation({ summary: 'Get current Artha assessment status for a user' })
  @ApiResponse({
    status: 200,
    description: 'Current status and readiness scores',
  })
  async getStatus(@Param('userId') userId: string) {
    return this.service.getStatus(userId);
  }

  @Post('start-tier/:tier')
  @ApiOperation({ summary: 'Start a specific assessment tier' })
  @ApiResponse({ status: 201, description: 'Assessment session initialized' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async startTier(
    @Body() body: StartTierDto,
    @Param('tier', ParseIntPipe) tier: number,
  ) {
    return this.service.startTierAssessment(body.userId, tier);
  }

  @Post('tier1')
  @ApiOperation({
    summary: 'Complete Tier 1 assessment (Logical/Quant/Verbal)',
  })
  @ApiResponse({ status: 201, description: 'Tier 1 results processed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async completeTier1(
    @Body() body: ArthaProgressDto & { assessmentId?: string },
  ) {
    return this.service.processTier1(body, body.assessmentId);
  }

  @Post('tier2')
  @ApiOperation({ summary: 'Complete Tier 2 assessment (Domain specific)' })
  @ApiResponse({ status: 201, description: 'Tier 2 results processed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async completeTier2(@Body() body: ArthaTierResultDto) {
    return this.service.processTier2(
      body.userId,
      body.assessmentId,
      body.language,
      body.attemptedCount,
      body.totalQuestions,
    );
  }

  @Post('tier3')
  @ApiOperation({
    summary: 'Complete Tier 3 assessment (Advanced/Case studies)',
  })
  @ApiResponse({ status: 201, description: 'Tier 3 results processed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async completeTier3(@Body() body: ArthaTierResultDto) {
    return this.service.processTier3(
      body.userId,
      body.assessmentId,
      body.language,
      body.attemptedCount,
      body.totalQuestions,
    );
  }

  @Post('attempt-question')
  @ApiOperation({
    summary: 'Record an individual question attempt within an assessment',
  })
  @ApiResponse({ status: 201, description: 'Attempt recorded' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async attemptQuestion(@Body() body: ArthaQuestionAttemptDto) {
    return this.service.recordQuestionAttempt(body);
  }

  @Get('recent-reports/:userId')
  @ApiOperation({ summary: 'Get recent Artha assessment reports' })
  async getRecentReports(@Param('userId') userId: string) {
    return this.service.getStatus(userId); // getStatus now includes recentReports
  }
}
