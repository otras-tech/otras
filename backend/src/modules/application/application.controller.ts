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
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/application.dto';

@ApiTags('Applications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new exam application (Self or Admin)' })
  @ApiResponse({ status: 201, description: 'Application submitted' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only apply for yourself' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateApplicationDto, @Request() req: any) {
    return this.applicationService.create(
      req.user.id,
      req.user.role,
      dto.userId,
      dto.examId,
    );
  }

  @Get('user/otr/:otrId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get applications by OTR ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of applications for the user' })
  findByOtrId(@Param('otrId') otrId: string) {
    return this.applicationService.findByOtrId(otrId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get applications by User ID (Self or Admin)' })
  @ApiResponse({ status: 200, description: 'List of applications for the user' })
  @ApiResponse({ status: 403, description: 'Forbidden - access denied' })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: any,
  ) {
    return this.applicationService.findByUser(req.user.id, req.user.role, userId);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all applications (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all applications' })
  findAll() {
    return this.applicationService.findAll();
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update application status phases (Admin only)' })
  @ApiResponse({ status: 200, description: 'Application status updated' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusData: UpdateApplicationStatusDto,
    @Request() req: any,
  ) {
    return this.applicationService.updateStatus(req.user.role, id, statusData);
  }
}
