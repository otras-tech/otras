import {
  IsString,
  IsNumber,
  IsArray,
  Min,
  Max,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReportDto {
  @ApiProperty()
  @IsString()
  exam: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  readinessIndex: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  strengths: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  improvementAreas: string[];

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  overallPercentile: number;
}
