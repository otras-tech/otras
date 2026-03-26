import { Controller, Post, Body } from '@nestjs/common';
import { StudyPlanService } from './study-plan.service';

@Controller('study-plan')
export class StudyPlanController {
  constructor(private readonly studyPlanService: StudyPlanService) {}

  @Post()
  async generate(@Body() input: any) {
    return this.studyPlanService.generate(input);
  }
}
