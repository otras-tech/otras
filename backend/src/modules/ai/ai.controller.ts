import { Controller, Post, Body, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { AiRequestDto } from './dto/ai-request.dto';
import { AiService } from './ai.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('AI Engine')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('roadmap')
  @ApiOperation({ summary: 'Generate a personalized AI-driven study roadmap' })
  @ApiResponse({ status: 201, description: 'Roadmap generated successfully' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async generateRoadmap(@Body() dto: AiRequestDto) {
    return this.aiService.generate(dto);
  }

  @Get('status/:id')
  @ApiOperation({ summary: 'Check status of a roadmap generation' })
  async getStatus(@Param('id') id: string) {
    return this.aiService.getStatus(id);
  }
}
