import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ResultService } from './result.service';
import { IsNumber, IsOptional, IsArray } from 'class-validator';

class StartResultDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  testId: number;

  @IsNumber()
  @IsOptional()
  tier?: number;
}

class SubmitResultDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  testId: number;

  @IsArray()
  answers: any[];

  @IsNumber()
  @IsOptional()
  tier?: number;

  @IsNumber()
  @IsOptional()
  resultId?: number;
}

@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post('start')
  async start(@Body() body: StartResultDto) {
    return this.resultService.startTest(body.userId, body.testId, body.tier);
  }

  @Post()
  async submit(@Body() body: SubmitResultDto) {
    // In a real app, userId should come from JWT
    return this.resultService.calculateAndSave(
      body.userId,
      body.testId,
      body.answers,
      body.tier,
      body.resultId,
    );
  }

  @Get('user/:userId')
  async getUserResults(@Param('userId', ParseIntPipe) userId: number) {
    return this.resultService.getUserResults(userId);
  }
}
