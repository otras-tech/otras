import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @Post()
  @ApiOperation({ summary: 'Create a new subject (Admin only)' })
  @ApiResponse({ status: 201, description: 'Subject created' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subjects' })
  @ApiResponse({ status: 200, description: 'List of subjects' })
  findAll() {
    return this.subjectService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subject by ID' })
  @ApiResponse({ status: 200, description: 'Subject details' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectService.findOne(id);
  }

  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateSubjectDto,
  ) {
    return this.subjectService.update(id, data);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subjectService.remove(id);
  }
}
