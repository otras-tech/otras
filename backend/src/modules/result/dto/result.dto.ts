import { IsNumber, IsOptional, IsArray, ValidateNested, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartTestDto {
  @ApiProperty({ example: 1, description: 'User ID of the student' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 101, description: 'ID of the test to start' })
  @IsNumber()
  @IsNotEmpty()
  testId: number;

  @ApiPropertyOptional({ example: 1, description: 'Artha Tier (1, 2, or 3)' })
  @IsOptional()
  @IsNumber()
  tier?: number;
}

export class AnswerDto {
  @ApiProperty({ example: 5001, description: 'Question ID' })
  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @ApiProperty({ example: 'A', description: 'Selected option (A, B, C, D)' })
  @IsString()
  @IsNotEmpty()
  selectedOption: string;
}

export class SubmitTestDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 101 })
  @IsNumber()
  @IsNotEmpty()
  testId: number;

  @ApiProperty({ type: [AnswerDto], description: 'List of user answers' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  tier?: number;

  @ApiPropertyOptional({ example: 1234, description: 'Existing result ID to update' })
  @IsOptional()
  @IsNumber()
  resultId?: number;
}
