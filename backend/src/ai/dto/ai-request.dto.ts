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

  @ApiPropertyOptional({ example: ['Geometry', 'Verbal Reasoning'], description: 'List of weak subject areas' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  weakAreas: string[];

  @ApiProperty({ example: 'en', enum: ['en', 'hi', 'te'], description: 'Preferred language' })
  @IsString()
  @IsIn(['en', 'hi', 'te'])
  language: 'en' | 'hi' | 'te';
}
