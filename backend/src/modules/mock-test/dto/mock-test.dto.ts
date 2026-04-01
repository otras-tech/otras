import {
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartMockAttemptDto {
  @ApiProperty({ example: 'OTR123456', description: 'User OTR ID' })
  @IsString()
  @IsNotEmpty()
  otrId!: string;

  @ApiProperty({ example: 10, description: 'ID of the MockTest' })
  @IsNumber()
  @IsNotEmpty()
  mockTestOrTestId!: number;
}

export class SubmitMockAttemptDto {
  @ApiProperty({ example: 'OTR123456' })
  @IsString()
  @IsNotEmpty()
  otrId!: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  mockTestId!: number;

  @ApiProperty({ example: 85, description: 'Total obtained score' })
  @IsNumber()
  @IsNotEmpty()
  score!: number;

  @ApiProperty({ example: 100, description: 'Max marks possible' })
  @IsNumber()
  @IsNotEmpty()
  totalMarks!: number;

  @ApiPropertyOptional({
    example: 123,
    description: 'Optional: ID of the attempt from /start-attempt',
  })
  @IsOptional()
  @IsNumber()
  attemptId?: number;
}

export class SubmitExamAttemptDto {
  @ApiProperty({ example: 'OTR123456' })
  @IsString()
  @IsNotEmpty()
  otrId!: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  examId!: number;

  @ApiProperty({ example: 75.5 })
  @IsNumber()
  @IsNotEmpty()
  score!: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  totalMarks!: number;

  @ApiPropertyOptional({ example: 123, description: 'Existing attempt ID' })
  @IsOptional()
  @IsNumber()
  attemptId?: number;

  @ApiPropertyOptional({
    example: 15,
    description: 'Number of correct answers',
  })
  @IsOptional()
  @IsNumber()
  correctAnswers?: number;

  @ApiPropertyOptional({
    example: { Quant: 10, Logical: 5 },
    description: 'JSON string or object for breakdown',
  })
  @IsOptional()
  @IsObject()
  subjectBreakdown?: Record<string, number>;
}
