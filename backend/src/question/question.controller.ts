import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() data: any) {
    return this.questionService.create(data);
  }

  @Get()
  findAll(
    @Query('examId') examId?: string,
    @Query('subjectId') subjectId?: string,
  ) {
    return this.questionService.findAll({
      examId: examId ? +examId : undefined,
      subjectId: subjectId ? +subjectId : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.questionService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
