import { Controller, Post, Get, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { CareerReadinessService } from './career-readiness.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubmitCareerReadinessDto } from './dto/career-readiness.dto';

@ApiTags('Career Readiness')
@Controller('career-readiness')
export class CareerReadinessController {
  constructor(private readonly careerReadinessService: CareerReadinessService) {}

  @Post()
  @ApiOperation({ summary: 'Submit answers for a career readiness assessment' })
  @ApiResponse({ status: 201, description: 'Results calculated and saved' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async saveResult(@Body() body: SubmitCareerReadinessDto) {
    console.log('Received submission request:', JSON.stringify(body, null, 2));
    try {
      const result = await this.careerReadinessService.saveResult(body);
      console.log('Successfully saved result');
      return result;
    } catch (error) {
      console.error('Error in saveResult:', error);
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
