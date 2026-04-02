import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CareerReadinessService } from './career-readiness.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Career Readiness')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('career-readiness')
export class CareerReadinessController {
  constructor(private readonly careerReadinessService: CareerReadinessService) {}

  @Post('save')
  @ApiOperation({ summary: 'Save results for a career readiness assessment' })
  @ApiResponse({ status: 201, description: 'Result saved' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  saveResult(
    @Body()
    data: {
      otrId: string;
      testId: number | string;
      answers: { questionId: number | string; selectedOption: string }[];
    },
    @Request() req: any,
  ) {
    return this.careerReadinessService.saveResult(req.user.otrId, data);
  }

  @Get('result/:otrId')
  @ApiOperation({ summary: 'Get latest career readiness result for a user' })
  @ApiResponse({ status: 200, description: 'User result' })
  getByOtrId(@Param('otrId') otrId: string, @Request() req: any) {
    return this.careerReadinessService.getByOtrId(req.user.otrId, otrId);
  }
}
