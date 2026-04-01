import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudyPlanDto {
  @ApiProperty({ example: 1, description: 'ID of the User' })
  @IsInt()
  @IsNotEmpty()
  userId!: number;

  @ApiPropertyOptional({ example: 1, description: 'ID of the target Exam' })
  @IsInt()
  @IsOptional()
  examId?: number;

  @ApiProperty({
    example: 'SSC CGL',
    description: 'Name of the target examination',
  })
  @IsString()
  @IsNotEmpty()
  targetExam!: string;

  @ApiProperty({
    example: '2026-10-15',
    description: 'Expected date of the exam',
  })
  @IsDateString()
  @IsNotEmpty()
  examDate!: string;

  @ApiPropertyOptional({ example: 120 })
  @IsInt()
  @IsOptional()
  tier1Score?: number;

  @ApiPropertyOptional({ example: 350 })
  @IsInt()
  @IsOptional()
  tier2Score?: number;

  @ApiProperty({
    example: 'Intermediate',
    description: 'Current preparation level',
  })
  @IsString()
  @IsNotEmpty()
  currentLevel!: string;

  @ApiProperty({
    example: ['Geometry', 'Grammar'],
    description: 'List of weak subject areas',
  })
  @IsArray()
  @IsString({ each: true })
  weakAreas!: string[];

  @ApiProperty({ example: 4, description: 'Daily hours available for study' })
  @IsInt()
  @IsNotEmpty()
  dailyStudyHours!: number;

  @ApiProperty({
    example: 'One per week',
    description: 'How often to take mock tests',
  })
  @IsString()
  @IsNotEmpty()
  mockFrequency!: string;

  @ApiProperty({
    example: 'Focus on weak areas first',
    description: 'Strategy for revision',
  })
  @IsString()
  @IsNotEmpty()
  revisionStrategy!: string;

  @ApiProperty({
    example: 'Morning',
    description: 'Preferred time segments for studying',
  })
  @IsString()
  @IsNotEmpty()
  preferredStudyTimes!: string;

  @ApiPropertyOptional({ example: 'en', enum: ['en', 'hi', 'te'] })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({
    example: 30,
    description: 'Duration of the study plan in days',
  })
  @IsInt()
  @IsOptional()
  planDurationDays?: number;
}
