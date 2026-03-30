import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { StudyPlanService } from '../service/study-plan.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';

@Controller('study-plan')
export class StudyPlanController {
  constructor(private readonly studyPlanService: StudyPlanService) {}

  @Post('generate')
  async generate(@Body() dto: CreateStudyPlanDto) {
    try {
      console.log('Processing StudyPlan generate request...');
      const result = await this.studyPlanService.generate(dto);
      console.log('StudyPlan generation successful in controller.');
      return result;
    } catch (e) {
      console.error('FATAL: StudyPlan Controller Generate Error:', e);
      throw e;
    }
  }

  @Post('save')
  async save(@Body() body: { dto: CreateStudyPlanDto; aiData: any }) {
    console.log('Saving StudyPlan:', body.dto.targetExam);
    return this.studyPlanService.save(body.dto, body.aiData);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.studyPlanService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studyPlanService.findOne(id);
  }

  @Patch('activity/:activityId')
  async updateActivity(
    @Param('activityId') activityId: string,
    @Body('userId', ParseIntPipe) userId: number,
    @Body('completed') completed?: boolean,
    @Body('missed') missed?: boolean,
  ) {
    return this.studyPlanService.updateActivityStatus(activityId, userId, {
      completed,
      missed,
    });
  }

  @Post(':id/next-day')
  async nextDay(@Param('id') id: string) {
    return this.studyPlanService.moveToNextDay(id);
  }

  @Post(':id/simulate-day-passed')
  async simulateDayPassed(@Param('id') id: string) {
    return this.studyPlanService.simulateDayPassed(id);
  }

  @Post('simulate-date-change/:id')
  async simulateDateChange(@Param('id') id: string) {
    console.log('Simulate date change triggered for:', id);
    return this.studyPlanService.moveMissedTasks(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.studyPlanService.delete(id);
  }
}
