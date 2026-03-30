import { Controller, Get, Post, Body, Param, Query, UseGuards, UsePipes, ValidationPipe, ParseIntPipe, Request, ForbiddenException, Req } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    otrId: string;
  };
}
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MockTestService } from './mock-test.service';
import { StartMockAttemptDto, SubmitMockAttemptDto, SubmitExamAttemptDto } from './dto/mock-test.dto';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Mock Tests')
@ApiBearerAuth('access-token')
@Controller('mock-test')
export class MockTestController {
  constructor(private readonly mockTestService: MockTestService) {}

  @Get()
  @ApiOperation({ summary: 'List all mock tests with optional filtering' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'cursor', required: false, description: 'Pagination cursor (ID)' })
  @ApiResponse({ status: 200, description: 'List of mock tests' })
  async findAll(
    @Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number,
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
  ) {
    return this.mockTestService.findAll(categoryId, cursor);
  }

  @UseGuards(JwtAuthGuard)
  @Post('start-attempt')
  @ApiOperation({ summary: 'Start a new mock test attempt' })
  @ApiResponse({ status: 201, description: 'Attempt started' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async startAttempt(@Body() dto: StartMockAttemptDto, @Req() req: AuthenticatedRequest) {
    if (req.user.otrId !== dto.otrId) {
       throw new ForbiddenException('Cannot start attempt for another user');
    }
    return this.mockTestService.startAttempt(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('attempts')
  @ApiOperation({ summary: 'Submit a standard mock test attempt' })
  @ApiResponse({ status: 201, description: 'Attempt submitted' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async submitAttempt(@Body() dto: SubmitMockAttemptDto, @Req() req: AuthenticatedRequest) {
    if (req.user.otrId !== dto.otrId) {
       throw new ForbiddenException('Cannot submit for another user');
    }
    return this.mockTestService.submitAttempt(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('exam-attempts')
  @ApiOperation({ summary: 'Submit a structured exam attempt' })
  @ApiResponse({ status: 201, description: 'Exam attempt submitted' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async submitExamAttempt(@Body() dto: SubmitExamAttemptDto, @Req() req: AuthenticatedRequest) {
    if (req.user.otrId !== dto.otrId) {
        throw new ForbiddenException('Cannot submit for another user');
    }
    return this.mockTestService.submitExamAttempt(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('attempts/recent/:otrId')
  @ApiOperation({ summary: 'Get recent mock test attempts for a user' })
  @ApiResponse({ status: 200, description: 'Returns recent attempts' })
  async getRecentAttempt(@Param('otrId') otrId: string, @Req() req: AuthenticatedRequest) {
    if (req.user.otrId !== otrId) {
       throw new ForbiddenException('Access denied');
    }
    return this.mockTestService.getUserMockAttempts(otrId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('rank/:mockTestId/:otrId')
  @ApiOperation({ summary: 'Calculate user rank in a specific mock test' })
  @ApiResponse({ status: 200, description: 'Returns rank details' })
  async calculateRank(
    @Param('mockTestId', ParseIntPipe) mockTestId: number,
    @Param('otrId') otrId: string,
    @Req() req: AuthenticatedRequest
  ) {
    if (req.user.otrId !== otrId) {
        throw new ForbiddenException('Access denied');
    }
    return this.mockTestService.calculateRank(mockTestId, otrId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific mock test' })
  @ApiResponse({ status: 200, description: 'Mock test details' })
  @ApiResponse({ status: 404, description: 'Mock test not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mockTestService.findOne(id);
  }
}
