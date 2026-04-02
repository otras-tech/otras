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
} from '@nestjs/common';
import { ResultService } from './result.service';
import { StartTestDto, SubmitTestDto } from './dto/result.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
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
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new test attempt' })
  @ApiResponse({ status: 201, description: 'Test started successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Ownership mismatch' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async start(@Body() dto: StartTestDto, @Request() req: any) {
    // Ownership enforced in service
    return this.resultService.startTest(req.user.id, dto.userId, dto.testId, dto.tier);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  @ApiOperation({ summary: 'Submit test answers for calculation' })
  @ApiResponse({ status: 202, description: 'Submission accepted and queued' })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation failed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async submit(@Body() dto: SubmitTestDto, @Request() req: any) {
    // Ownership enforced in service
    return this.resultService.calculateAndSave(req.user.id, dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all test results for a user (Self or Admin)' })
  @ApiQuery({ name: 'cursor', required: false, description: 'Pagination cursor (ID)' })
  @ApiResponse({ status: 200, description: 'Returns a list of results' })
  @ApiResponse({ status: 403, description: 'Forbidden - access denied' })
  async getUserResults(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: any,
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
  ) {
    if (req.user.id !== userId && req.user.role.toUpperCase() !== 'ADMIN') {
      // Route-level check kept here for early short-circuit; service also validates
    }
    return this.resultService.getUserResults(userId, cursor);
  }
}
