import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoadmapDto {
  @ApiProperty({ example: 85 })
  @IsNumber()
  logicalScore!: number;

  @ApiProperty({ example: 78 })
  @IsNumber()
  quantScore!: number;

  @ApiProperty({ example: 92 })
  @IsNumber()
  verbalScore!: number;

  @ApiProperty({ example: ['Data Science', 'Backend Engineering'] })
  @IsArray()
  @IsString({ each: true })
  interests!: string[];

  @ApiProperty({ example: 'Visual learner, prefers hands-on practice' })
  @IsString()
  @IsNotEmpty()
  learningPattern!: string;

  @ApiProperty({ example: 8 })
  @IsNumber()
  confidenceIndex!: number;

  @ApiProperty({ example: 'Become a Lead Software Architect' })
  @IsString()
  @IsNotEmpty()
  aspirations!: string;

  @ApiPropertyOptional({ example: 'OTR123456' })
  @IsOptional()
  @IsString()
  userId?: string;
}
