import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { TestService } from './test.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@ApiTags('Tests')
@ApiBearerAuth('access-token')
@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a test (Admin only)' })
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testService.update(+id, updateTestDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a test (Admin only)' })
  remove(@Param('id') id: string) {
    return this.testService.remove(+id);
  }
}
