import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common'
import { CareerAIService } from '../service/career-ai.service'
import { CreateRoadmapDto } from '../dto/create-roadmap.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('AI Career Guidance')
@Controller("career-ai")
export class CareerAiController {
  constructor(private service: CareerAIService) {}

  @Post("generate-roadmap")
  @ApiOperation({ summary: 'Generate a personalized AI-driven career roadmap' })
  @ApiResponse({ status: 201, description: 'Career roadmap generated successfully' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async generateRoadmap(@Body() body: CreateRoadmapDto) {
    return this.service.generateRoadmap(body)
  }
}
