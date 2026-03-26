import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, UsePipes, ValidationPipe, Patch, Delete } from '@nestjs/common';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { TestService } from './test.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@ApiTags('Tests')
@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) { }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @Post()
  @ApiOperation({ summary: 'Create a new test (Admin only)' })
  @ApiResponse({ status: 201, description: 'Test created' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createTestDto: CreateTestDto) {
    return this.testService.create(createTestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tests' })
  @ApiResponse({ status: 200, description: 'List of tests' })
  findAll() {
    return this.testService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get test by ID' })
  @ApiResponse({ status: 200, description: 'Test details' })
  @ApiResponse({ status: 404, description: 'Test not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.testService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testService.update(+id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testService.remove(+id);
  }
}
