import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { ExamService } from './exam.service';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) { }

  @UseGuards(AdminAuthGuard)
  @Post()
  create(@Body() createExamDto: any) {
    return this.examService.create(createExamDto);
  }

  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateData: any) {
    return this.examService.update(id, updateData);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.examService.remove(id);
  }

  @Get()
  findAll() {
    return this.examService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.examService.findOne(id);
  }

  @Get(':id/random-test')
  getRandomTest(@Param('id', ParseIntPipe) id: number) {
    return this.examService.getRandomTest(id);
  }

  @Get('tier/:tier')
  findByTier(@Param('tier') tier: string) {
    return this.examService.findByTier(tier);
  }
}
