import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CacheService } from '../../common/cache/cache.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ExamService } from './exam.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateExamDto } from './dto/create-exam.dto';

@ApiTags('Exams')
@Controller('exams')
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly cacheService: CacheService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @Post()
  @ApiOperation({ summary: 'Create a new exam (Admin only)' })
  @ApiResponse({ status: 201, description: 'Exam created successfully' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createExamDto: CreateExamDto) {
    const result = await this.examService.create(createExamDto);
    await this.examService.invalidateCache();
    return result;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing exam (Admin only)' })
  @ApiResponse({ status: 200, description: 'Exam updated' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: CreateExamDto,
  ) {
    const result = await this.examService.update(id, updateData);
    await this.examService.invalidateCache();
    await this.cacheService.del(`exam_details_${id}`);
    return result;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an exam (Admin only)' })
  @ApiResponse({ status: 200, description: 'Exam deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.examService.remove(id);
    await this.examService.invalidateCache();
    await this.cacheService.del(`exam_details_${id}`);
    return result;
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('exams_all')
  @CacheTTL(300) // 5 minutes (Static data)
  @ApiOperation({ summary: 'Get all exams' })
  @ApiResponse({ status: 200, description: 'List of exams' })
  findAll() {
    return this.examService.findAll();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // 5 minutes
  @ApiOperation({ summary: 'Get exam details by ID' })
  @ApiResponse({ status: 200, description: 'Exam details' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    // Note: CacheInterceptor by default uses the URL as key if No CacheKey provided
    return this.examService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @ApiBearerAuth('access-token')
  @Get(':id/test')
  @ApiOperation({
    summary: 'Get a random existing test for this exam (No side effects)',
  })
  @ApiResponse({ status: 200, description: 'Existing test details' })
  getTest(@Param('id', ParseIntPipe) id: number) {
    return this.examService.getTest(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @Post(':id/test')
  @ApiOperation({ summary: 'Generate a new test for this exam (Side effects)' })
  @ApiResponse({ status: 201, description: 'New test generated' })
  generateTest(@Param('id', ParseIntPipe) id: number) {
    return this.examService.generateTest(id);
  }

  @Get('tier/:tier')
  @ApiOperation({ summary: 'Filter exams by tier' })
  findByTier(@Param('tier') tier: string) {
    return this.examService.findByTier(tier);
  }
}
