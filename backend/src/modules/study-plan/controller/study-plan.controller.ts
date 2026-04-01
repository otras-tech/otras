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
} from '@nestjs/common';
import { StudyPlanService } from '../service/study-plan.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiPropertyOptional,
} from '@nestjs/swagger';

class UpdateActivityStatusDto {
  @ApiPropertyOptional({ example: true })
  completed?: boolean;
  @ApiPropertyOptional({ example: false })
  missed?: boolean;
}

@ApiTags('Study Plans')
@Controller('study-plan')
export class StudyPlanController {
  private readonly logger = new Logger(StudyPlanController.name);
  constructor(private readonly studyPlanService: StudyPlanService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a study plan (Step 1: AI Analysis)' })
  @ApiResponse({ status: 201, description: 'AI generated plan summary' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  generate(@Body() dto: CreateStudyPlanDto) {
    return this.studyPlanService.generate(dto);
  }

  @Post('save')
  @ApiOperation({ summary: 'Save the generated study plan to database' })
  @ApiResponse({ status: 201, description: 'Plan saved successfully' })
  save(
    @Body() body: { dto: CreateStudyPlanDto; aiData: Record<string, unknown> },
  ) {
    return this.studyPlanService.save(body.dto, body.aiData);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all study plans for a user' })
  @ApiResponse({ status: 200, description: 'List of plans' })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.studyPlanService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get study plan by ID' })
  @ApiResponse({ status: 200, description: 'Plan details' })
  findOne(@Param('id') id: string) {
    return this.studyPlanService.findOne(id);
  }

  @Patch('activity/:activityId/:userId')
  @ApiOperation({ summary: 'Update status of a specific study activity' })
  updateActivityStatus(
    @Param('activityId') activityId: string,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() data: UpdateActivityStatusDto,
  ) {
    return this.studyPlanService.updateActivityStatus(activityId, userId, data);
  }

  @Post(':id/simulate-day-passed')
  async simulateDayPassed(@Param('id') id: string) {
    return this.studyPlanService.simulateDayPassed(id);
  }

  async simulateDateChange(@Param('id') id: string) {
    this.logger.log(`Simulate date change triggered for: ${id}`);
    return this.studyPlanService.moveMissedTasks(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.studyPlanService.delete(id);
  }
}
