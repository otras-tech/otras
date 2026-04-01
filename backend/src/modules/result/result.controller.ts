import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ResultService } from './result.service';
import { StartTestDto, SubmitTestDto } from './dto/result.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Results')
@ApiBearerAuth('access-token')
@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @UseGuards(JwtAuthGuard)
  @Post('start')
  @ApiOperation({ summary: 'Start a new test attempt' })
  @ApiResponse({ status: 201, description: 'Test started successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Ownership mismatch' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async start(@Body() dto: StartTestDto, @Request() req: any) {
    if (req.user.id !== dto.userId) {
      throw new ForbiddenException('Cannot start test for another user');
    }
    return this.resultService.startTest(dto.userId, dto.testId, dto.tier);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  @ApiOperation({ summary: 'Submit test answers for calculation' })
  @ApiResponse({ status: 202, description: 'Submission accepted and queued' })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation failed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async submit(@Body() dto: SubmitTestDto, @Request() req: any) {
    if (req.user.id !== dto.userId) {
      throw new ForbiddenException('Cannot submit test for another user');
    }
    return this.resultService.calculateAndSave(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all test results for a user' })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Pagination cursor (ID)',
  })
  @ApiResponse({ status: 200, description: 'Returns a list of results' })
  async getUserResults(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: any,
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
  ) {
    if (req.user.id !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.resultService.getUserResults(userId, cursor);
  }
}
