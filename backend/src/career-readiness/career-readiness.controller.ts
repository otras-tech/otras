import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CareerReadinessService } from './career-readiness.service';

@Controller('career-readiness')
export class CareerReadinessController {
  constructor(
    private readonly careerReadinessService: CareerReadinessService,
  ) {}

  @Post()
  async saveResult(
    @Body() body: { otrId: string; testId: any; answers: any[] },
  ) {
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
  async getByOtrId(@Param('otrId') otrId: string) {
    return this.careerReadinessService.getByOtrId(otrId);
  }
}
