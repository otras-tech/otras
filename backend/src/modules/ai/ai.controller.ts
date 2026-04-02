import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AiRequestDto } from './dto/ai-request.dto';
import { AiService } from './ai.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('AI Engine')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('roadmap')
  @ApiOperation({ summary: 'Generate a personalized AI-driven study roadmap' })
  @ApiResponse({ status: 201, description: 'Roadmap generation started' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async generateRoadmap(@Body() dto: AiRequestDto, @Request() req: any) {
    return this.aiService.generate(req.user.otrId, req.user.role, dto);
  }

  @Get('status/:id')
  @ApiOperation({ summary: 'Check status of a roadmap generation' })
  async getStatus(@Param('id') id: string, @Request() req: any) {
    return this.aiService.getStatus(req.user.otrId, req.user.role, id);
  }
}
