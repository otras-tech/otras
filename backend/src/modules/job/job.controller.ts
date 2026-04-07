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
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CacheService } from '../../common/cache/cache.service';
import { JobService } from './job.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly cacheService: CacheService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new job posting (Admin only)' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createJobDto: CreateJobDto) {
    const result = await this.jobService.create(createJobDto);
    await this.cacheService.del('jobs_all*'); // Invalidate paginated lists
    return result;
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('jobs_all')
  @CacheTTL(600) // 10 minutes
  @ApiOperation({ summary: 'Get all active job postings (Paginated)' })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of jobs' })
  findAll(
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.jobService.findAll(cursor, take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job details by ID' })
  @ApiResponse({ status: 200, description: 'Job record' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.findOne(id);
  }
}
