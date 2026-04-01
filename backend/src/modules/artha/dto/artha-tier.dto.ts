import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartTierDto {
  @ApiProperty({ example: 'OTR123456' })
  @IsString()
  @IsNotEmpty()
  userId!: string;
}

export class ArthaTierResultDto {
  @ApiProperty({ example: 'OTR123456' })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiPropertyOptional({ example: 'uuid-1234' })
  @IsOptional()
  @IsString()
  assessmentId?: string;

  @ApiPropertyOptional({ example: 'English' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  attemptedCount?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  totalQuestions?: number;
}

export class ArthaQuestionAttemptDto {
  @ApiProperty({ example: 'uuid-1234' })
  @IsString()
  @IsNotEmpty()
  assessmentId!: string;

  @ApiProperty({ example: 101 })
  @IsNumber()
  @IsNotEmpty()
  questionId!: number;

  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  selectedOption!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  isCorrect!: boolean;

  @ApiProperty({ example: 45, description: 'Time taken in seconds' })
  @IsNumber()
  @IsNotEmpty()
  timeTaken!: number;
}
