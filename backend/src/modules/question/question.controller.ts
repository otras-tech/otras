import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { QuestionService } from './question.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateQuestionDto } from './dto/create-question.dto';

@ApiTags('Questions')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new question in the bank' })
  @ApiResponse({ status: 201, description: 'Question created' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() data: CreateQuestionDto) {
    return this.questionService.create(data);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('questions_all')
  @CacheTTL(300) // 5 minutes
  @ApiOperation({ summary: 'Get all questions with optional filtering (Paginated)' })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({
    name: 'examId',
    required: false,
    description: 'Filter by Exam ID',
  })
  @ApiQuery({
    name: 'subjectId',
    required: false,
    description: 'Filter by Subject ID',
  })
  @ApiResponse({ status: 200, description: 'List of questions' })
  findAll(
    @Query('examId') examId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.questionService.findAll({
      examId: examId ? +examId : undefined,
      subjectId: subjectId ? +subjectId : undefined,
      cursor,
      take,
    });
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600) // 10 minutes
  @ApiOperation({ summary: 'Get question details by ID' })
  @ApiResponse({ status: 200, description: 'Question details' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a question' })
  @ApiResponse({ status: 200, description: 'Question updated' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreateQuestionDto>,
  ) {
    return this.questionService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a question' })
  @ApiResponse({ status: 200, description: 'Question deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.remove(id);
  }
}
