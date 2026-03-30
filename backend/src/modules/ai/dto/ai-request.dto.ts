import { IsString, IsNumber, IsArray, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AiRequestDto {
  @ApiProperty({ example: 'SSC CGL', description: 'The target exam name' })
  @IsString()
  @IsNotEmpty()
  exam: string;

  @ApiProperty({ example: 85, description: 'Current user score in assessment' })
  @IsNumber()
  score: number;

  @ApiPropertyOptional({ example: 85, description: 'Logical reasoning score' })
  @IsNumber()
  @IsOptional()
  logicalScore?: number;

  @ApiPropertyOptional({ example: 70, description: 'Quantitative aptitude score' })
  @IsNumber()
  @IsOptional()
  quantScore?: number;

  @ApiPropertyOptional({ example: 90, description: 'Verbal ability score' })
  @IsNumber()
  @IsOptional()
  verbalScore?: number;

  @ApiPropertyOptional({ example: 80, description: 'Confidence index (0-100)' })
  @IsNumber()
  @IsOptional()
  confidenceScore?: number;

  @ApiPropertyOptional({ example: ['Geometry', 'Verbal Reasoning'], description: 'List of weak subject areas' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  weakAreas?: string[];

  @ApiPropertyOptional({ example: ['Tech', 'Management'], description: 'User interests' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiPropertyOptional({ example: 'Visual', description: 'User learning pattern' })
  @IsString()
  @IsOptional()
  learningPattern?: string;

  @ApiPropertyOptional({ example: 'IAS Officer', description: 'User aspirations' })
  @IsString()
  @IsOptional()
  aspirations?: string;

  @ApiPropertyOptional({ example: '123', description: 'User ID' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ example: 'en', enum: ['en', 'hi', 'te'], description: 'Preferred language' })
  @IsString()
  @IsIn(['en', 'hi', 'te'])
  language: 'en' | 'hi' | 'te';
}
