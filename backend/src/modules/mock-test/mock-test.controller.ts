import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MockTestService } from './mock-test.service';
import {
  StartMockAttemptDto,
  SubmitMockAttemptDto,
  SubmitExamAttemptDto,
} from './dto/mock-test.dto';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/types/types';
import { ForbiddenException } from '@nestjs/common';

@ApiTags('Mock Tests')
@ApiBearerAuth('access-token')
@Controller('mock-test')
export class MockTestController {
  constructor(private readonly mockTestService: MockTestService) {}

  @Get()
  @ApiOperation({ summary: 'List all mock tests with optional filtering (Paginated)' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Pagination cursor (ID)',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Pagination limit (Max 100)',
  })
  @ApiResponse({ status: 200, description: 'List of mock tests' })
  async findAll(
    @Query('categoryId', new ParseIntPipe({ optional: true }))
    categoryId?: number,
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.mockTestService.findAll(categoryId, cursor, take);
  }

  @UseGuards(JwtAuthGuard)
  @Post('start-attempt')
  @ApiOperation({ summary: 'Start a new mock test attempt' })
  @ApiResponse({ status: 201, description: 'Attempt started' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async startAttempt(
    @Body() dto: StartMockAttemptDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.mockTestService.startAttempt(user.otrId!, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('attempts')
  @ApiOperation({ summary: 'Submit a standard mock test attempt' })
  @ApiResponse({ status: 201, description: 'Attempt submitted' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async submitAttempt(
    @Body() dto: SubmitMockAttemptDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.mockTestService.submitAttempt(user.otrId!, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('exam-attempts')
  @ApiOperation({ summary: 'Submit a structured exam attempt' })
  @ApiResponse({ status: 201, description: 'Exam attempt submitted' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async submitExamAttempt(
    @Body() dto: SubmitExamAttemptDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.mockTestService.submitExamAttempt(user.otrId!, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('attempts/recent/:otrId')
  @ApiOperation({ summary: 'Get recent mock test attempts for a user' })
  @ApiResponse({ status: 200, description: 'Returns recent attempts' })
  async getRecentAttempt(
    @Param('otrId') otrId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.mockTestService.getUserMockAttempts(user.otrId!, otrId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('rank/:mockTestId/:otrId')
  @ApiOperation({ summary: 'Calculate user rank in a specific mock test' })
  @ApiResponse({ status: 200, description: 'Returns rank details' })
  async calculateRank(
    @Param('mockTestId', ParseIntPipe) mockTestId: number,
    @Param('otrId') otrId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.mockTestService.calculateRank(user.otrId!, mockTestId, otrId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific mock test' })
  @ApiResponse({ status: 200, description: 'Mock test details' })
  @ApiResponse({ status: 404, description: 'Mock test not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mockTestService.findOne(id);
  }
}
