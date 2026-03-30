import { Controller, Get, Post, Body, Param, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { JobService } from './job.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateJobDto } from './dto/create-job.dto';

@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new job posting' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active job postings' })
  @ApiResponse({ status: 200, description: 'List of jobs' })
  findAll() {
    return this.jobService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job details by ID' })
  @ApiResponse({ status: 200, description: 'Job record' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.findOne(id);
  }
}
