import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ArthaService } from './artha.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ArthaProgressDto } from './dto/artha-progress.dto';
import {
  StartTierDto,
  ArthaTierResultDto,
  ArthaQuestionAttemptDto,
} from './dto/artha-tier.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Artha AI Assessment')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('artha')
export class ArthaController {
  constructor(private service: ArthaService) {}

  @Get('status/:userId')
  @ApiOperation({ summary: 'Get current Artha assessment status for a user' })
  @ApiResponse({ status: 200, description: 'Current status and readiness scores' })
  async getStatus(
    @Param('userId') userId: string,
    @Request() req: any,
  ) {
    return this.service.getStatus(req.user.id, req.user.otrId, req.user.role, userId);
  }

  @Post('start-tier/:tier')
  @ApiOperation({ summary: 'Start a specific assessment tier' })
  @ApiResponse({ status: 201, description: 'Assessment session initialized' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async startTier(
    @Body() body: StartTierDto,
    @Param('tier', ParseIntPipe) tier: number,
    @Request() req: any,
  ) {
    return this.service.startTierAssessment(req.user.id, req.user.otrId, req.user.role, body.userId, tier);
  }

  @Post('tier1')
  @ApiOperation({ summary: 'Complete Tier 1 assessment (Logical/Quant/Verbal)' })
  @ApiResponse({ status: 201, description: 'Tier 1 results processed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async completeTier1(
    @Body() body: ArthaProgressDto & { assessmentId?: string },
    @Request() req: any,
  ) {
    return this.service.processTier1(req.user.id, req.user.otrId, req.user.role, body, body.assessmentId);
  }

  @Post('tier2')
  @ApiOperation({ summary: 'Complete Tier 2 assessment (Domain specific)' })
  @ApiResponse({ status: 201, description: 'Tier 2 results processed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async completeTier2(
    @Body() body: ArthaTierResultDto,
    @Request() req: any,
  ) {
    return this.service.processTier2(
      req.user.id,
      req.user.otrId,
      req.user.role,
      body.userId,
      body.assessmentId,
      body.language,
      body.attemptedCount,
      body.totalQuestions,
    );
  }

  @Post('tier3')
  @ApiOperation({ summary: 'Complete Tier 3 assessment (Advanced/Case studies)' })
  @ApiResponse({ status: 201, description: 'Tier 3 results processed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async completeTier3(
    @Body() body: ArthaTierResultDto,
    @Request() req: any,
  ) {
    return this.service.processTier3(
      req.user.id,
      req.user.otrId,
      req.user.role,
      body.userId,
      body.assessmentId,
      body.language,
      body.attemptedCount,
      body.totalQuestions,
    );
  }

  @Post('attempt-question')
  @ApiOperation({ summary: 'Record an individual question attempt within an assessment' })
  @ApiResponse({ status: 201, description: 'Attempt recorded' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async attemptQuestion(
    @Body() body: ArthaQuestionAttemptDto,
    @Request() req: any,
  ) {
    return this.service.recordQuestionAttempt(req.user.id, req.user.otrId, req.user.role, body);
  }

  @Get('recent-reports/:userId')
  @ApiOperation({ summary: 'Get recent Artha assessment reports' })
  async getRecentReports(
    @Param('userId') userId: string,
    @Request() req: any,
  ) {
    // getStatus now includes recentReports
    return this.service.getStatus(req.user.id, req.user.otrId, req.user.role, userId);
  }
}
