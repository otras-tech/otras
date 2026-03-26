import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { ExamService } from './exam.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateExamDto } from './dto/create-exam.dto';

@ApiTags('Exams')
@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) { }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @Post()
  @ApiOperation({ summary: 'Create a new exam (Admin only)' })
  @ApiResponse({ status: 201, description: 'Exam created successfully' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createExamDto: CreateExamDto) {
    return this.examService.create(createExamDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing exam (Admin only)' })
  @ApiResponse({ status: 200, description: 'Exam updated' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id', ParseIntPipe) id: number, @Body() updateData: CreateExamDto) {
    return this.examService.update(id, updateData);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an exam (Admin only)' })
  @ApiResponse({ status: 200, description: 'Exam deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.examService.remove(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exams' })
  @ApiResponse({ status: 200, description: 'List of exams' })
  findAll() {
    return this.examService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam details by ID' })
  @ApiResponse({ status: 200, description: 'Exam details' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.examService.findOne(id);
  }

  @Get(':id/random-test')
  @ApiOperation({ summary: 'Generate a random test from exam subjects' })
  @ApiResponse({ status: 200, description: 'Randomly generated test questions' })
  getRandomTest(@Param('id', ParseIntPipe) id: number) {
    return this.examService.getRandomTest(id);
  }

  @Get('tier/:tier')
  @ApiOperation({ summary: 'Filter exams by tier' })
  findByTier(@Param('tier') tier: string) {
    return this.examService.findByTier(tier);
  }
}
