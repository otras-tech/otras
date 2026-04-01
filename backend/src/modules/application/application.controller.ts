import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/application.dto';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new exam application' })
  @ApiResponse({ status: 201, description: 'Application submitted' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateApplicationDto) {
    return this.applicationService.create(dto.userId, dto.examId);
  }

  @Get('user/otr/:otrId')
  @ApiOperation({ summary: 'Get applications by OTR ID' })
  @ApiResponse({
    status: 200,
    description: 'List of applications for the user',
  })
  findByOtrId(@Param('otrId') otrId: string) {
    return this.applicationService.findByOtrId(otrId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get applications by User ID' })
  @ApiResponse({
    status: 200,
    description: 'List of applications for the user',
  })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.applicationService.findByUser(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all applications (Admin)' })
  @ApiResponse({ status: 200, description: 'List of all applications' })
  findAll() {
    return this.applicationService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update application status phases (Admin)' })
  @ApiResponse({ status: 200, description: 'Application status updated' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusData: UpdateApplicationStatusDto,
  ) {
    return this.applicationService.updateStatus(id, statusData);
  }
}
