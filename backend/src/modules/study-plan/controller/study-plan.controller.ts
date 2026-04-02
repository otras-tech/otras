import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Logger,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StudyPlanService } from '../service/study-plan.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiPropertyOptional,
  ApiBearerAuth,
} from '@nestjs/swagger';

class UpdateActivityStatusDto {
  @ApiPropertyOptional({ example: true })
  completed?: boolean;
  @ApiPropertyOptional({ example: false })
  missed?: boolean;
}

@ApiTags('Study Plans')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('study-plan')
export class StudyPlanController {
  private readonly logger = new Logger(StudyPlanController.name);
  constructor(private readonly studyPlanService: StudyPlanService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a study plan (Step 1: AI Analysis)' })
  @ApiResponse({ status: 201, description: 'AI generated plan summary' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  generate(@Body() dto: CreateStudyPlanDto, @Request() req: any) {
    return this.studyPlanService.generate(req.user.id, req.user.role, dto);
  }

  @Post('save')
  @ApiOperation({ summary: 'Save the generated study plan to database' })
  @ApiResponse({ status: 201, description: 'Plan saved successfully' })
  save(
    @Body() body: { dto: CreateStudyPlanDto; aiData: Record<string, unknown> },
    @Request() req: any,
  ) {
    return this.studyPlanService.save(req.user.id, req.user.role, body.dto, body.aiData);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all study plans for a user' })
  @ApiResponse({ status: 200, description: 'List of plans' })
  findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: any,
  ) {
    return this.studyPlanService.findByUserId(req.user.id, req.user.role, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get study plan by ID' })
  @ApiResponse({ status: 200, description: 'Plan details' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.studyPlanService.findOne(req.user.id, req.user.role, id);
  }

  @Patch('activity/:activityId/:userId')
  @ApiOperation({ summary: 'Update status of a specific study activity' })
  updateActivityStatus(
    @Param('activityId') activityId: string,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() data: UpdateActivityStatusDto,
    @Request() req: any,
  ) {
    return this.studyPlanService.updateActivityStatus(req.user.id, req.user.role, activityId, userId, data);
  }

  @Post(':id/simulate-day-passed')
  @ApiOperation({ summary: 'Simulate time passage for automated rescheduling testing' })
  async simulateDayPassed(@Param('id') id: string, @Request() req: any) {
    return this.studyPlanService.simulateDayPassed(req.user.id, req.user.role, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hard-delete (soft-delete coming soon) a study plan' })
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.studyPlanService.delete(req.user.id, req.user.role, id);
  }
}
