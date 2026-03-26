import {
  IsNumber,
  IsObject,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PerformanceDto {
  @ApiProperty({
    example: {
      Quant: 48,
      Reasoning: 65,
      English: 70,
    },
  })
  @IsObject()
  sectionScores: Record<string, number>;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalScore: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  accuracy: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  timeTakenMinutes: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentile: number;
}
