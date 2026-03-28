import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CareerAIService } from '../service/career-ai.service';

@Controller('career-ai')
export class CareerAIController {
  constructor(private readonly careerAIService: CareerAIService) {}

  @Post('generate-roadmap')
  async generateRoadmap(@Body() dto: any) {
    return this.careerAIService.generateRoadmap(dto);
  }

  @Get('status/:jobId')
  async getStatus(@Param('jobId') jobId: string) {
    return this.careerAIService.getJobStatus(jobId);
  }
}
