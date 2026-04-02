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
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Mock Tests (Full Exams)')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new test (Admin only)' })
  create(@Body() createTestDto: CreateTestDto) {
    return this.testService.create(createTestDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all available tests' })
  findAll(
    @Query('cursor') cursor?: number,
    @Query('take') take?: number,
  ) {
    return this.testService.findAll(cursor ? Number(cursor) : undefined, take ? Number(take) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific test' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.testService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update test metadata (Admin only)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTestDto: UpdateTestDto,
  ) {
    return this.testService.update(id, updateTestDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a test (Admin only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.testService.remove(id);
  }
}
