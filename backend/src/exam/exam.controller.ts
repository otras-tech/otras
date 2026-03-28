import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ExamService } from './exam.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@Controller('exams')
@UseInterceptors(CacheInterceptor)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  @CacheTTL(300000)
  findAll() {
    return this.examService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examService.findOne(+id);
  }

  @Get(':id/random-test')
  getRandomTest(@Param('id') id: string) {
    return this.examService.getRandomTest(+id);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() createExamDto: any) {
    return this.examService.create(createExamDto);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  update(@Param('id') id: string, @Body() updateExamDto: any) {
    return this.examService.update(+id, updateExamDto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.examService.remove(+id);
  }
}
