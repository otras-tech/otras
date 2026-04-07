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
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CacheService } from '../../common/cache/cache.service';
import { ApplicationService } from './application.service';
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
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/application.dto';

@ApiTags('Applications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly cacheService: CacheService,
  ) { }

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
  @ApiOperation({ summary: 'Get applications by OTR ID (Admin only) - Paginated' })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of applications for the user' })
  findByOtrId(
    @Param('otrId') otrId: string,
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.applicationService.findByOtrId(otrId, cursor, take);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get applications by User ID (Self or Admin) - Paginated' })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of applications for the user' })
  @ApiResponse({ status: 403, description: 'Forbidden - access denied' })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: any,
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.applicationService.findByUser(req.user.id, req.user.role, userId, cursor, take);
  }

  @Get()
  @Roles('ADMIN')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('applications_all')
  @CacheTTL(300) // 5 minutes
  @ApiOperation({ summary: 'Get all applications (Admin only) - Paginated' })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of all applications' })
  findAll(
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return this.applicationService.findAll(cursor, take);
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
