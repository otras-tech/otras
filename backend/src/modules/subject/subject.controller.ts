import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CacheService } from '../../common/cache/cache.service';
import { SubjectService } from './subject.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@ApiTags('Subjects')
@ApiBearerAuth('access-token')
@Controller('subjects')
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly cacheService: CacheService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new subject (Admin only)' })
  @ApiResponse({ status: 201, description: 'Subject created' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('subjects_all')
  @CacheTTL(600) // 10 minutes
  @ApiOperation({ summary: 'Get all subjects (Paginated)' })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of subjects' })
  findAll(
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.subjectService.findAll(cursor, take);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600) // 10 minutes
  @ApiOperation({ summary: 'Get subject by ID' })
  @ApiResponse({ status: 200, description: 'Subject details' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a subject (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subject updated' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateSubjectDto,
  ) {
    const result = await this.subjectService.update(id, data);
    await this.cacheService.del(`subject_details_${id}`);
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a subject (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subject deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.subjectService.remove(id);
    await this.cacheService.del(`subject_details_${id}`);
    return result;
  }
}
