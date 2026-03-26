import {
  IsString,
  IsNumber,
  IsArray,
  IsInt,
  Min,
  Max,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoadmapDto {
  @ApiProperty()
  @IsString()
  exam: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  readinessIndex: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  aptitude: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  subject: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  timeManagement: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  weakAreas: string[];

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(52)
  availableWeeks: number;
}
