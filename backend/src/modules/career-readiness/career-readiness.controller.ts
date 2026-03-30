import { Controller, Post, Get, Body, Param, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { CareerReadinessService } from './career-readiness.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubmitCareerReadinessDto } from './dto/career-readiness.dto';

@ApiTags('Career Readiness')
@Controller('career-readiness')
export class CareerReadinessController {
  private readonly logger = new Logger(CareerReadinessController.name);
  constructor(private readonly careerReadinessService: CareerReadinessService) {}

  @Post()
  @ApiOperation({ summary: 'Submit answers for a career readiness assessment' })
  @ApiResponse({ status: 201, description: 'Results calculated and saved' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async saveResult(@Body() body: SubmitCareerReadinessDto) {
    this.logger.log(`Received submission request: ${JSON.stringify(body)}`);
    try {
      const result = await this.careerReadinessService.saveResult(body);
      this.logger.log('Successfully saved result');
      return result;
    } catch (error) {
      this.logger.error('Error in saveResult', error.stack);
      throw error;
    }
  }

  @Get(':otrId')
  @ApiOperation({ summary: 'Get career readiness assessment history by OTR ID' })
  @ApiResponse({ status: 200, description: 'List of assessment scores' })
  async getByOtrId(@Param('otrId') otrId: string) {
    return this.careerReadinessService.getByOtrId(otrId);
  }
}
