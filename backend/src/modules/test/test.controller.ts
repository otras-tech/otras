import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CacheService } from '../../common/cache/cache.service';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Mock Tests (Full Exams)')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly cacheService: CacheService,
  ) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new test (Admin only)' })
  create(@Body() createTestDto: CreateTestDto) {
    return this.testService.create(createTestDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('tests_all')
  @CacheTTL(300) // 5 minutes
  @ApiOperation({ summary: 'List all available tests (Paginated)' })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of tests' })
  findAll(
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.testService.findAll(cursor, take);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600) // 10 minutes
  @ApiOperation({ summary: 'Get details of a specific test' })
  @ApiResponse({ status: 200, description: 'Test record' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.testService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update test metadata (Admin only)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTestDto: UpdateTestDto,
  ) {
    const test = await this.testService.update(id, updateTestDto);
    await this.cacheService.del(`test_details_${id}`);
    return test;
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a test (Admin only)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const test = await this.testService.remove(id);
    await this.cacheService.del(`test_details_${id}`);
    return test;
  }
}
