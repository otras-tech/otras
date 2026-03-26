import { Controller, Post, Body } from '@nestjs/common';
import { CareerAIService } from './career.service';

@Controller('career-ai')
export class CareerController {
  constructor(private readonly careerService: CareerAIService) {}

  @Post()
  async generate(@Body() dto: any) {
    return this.careerService.generate(dto);
  }
}
